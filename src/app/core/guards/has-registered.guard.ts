import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  Router,
} from "@angular/router";
import { EMPTY, Observable, Subject } from "rxjs";
import { tap, map, take, catchError } from "rxjs/operators";

import { ClientService } from "../services/client.service";
import { get, has, isNil } from "lodash";
import { Client } from "../models/client";
import { Auth } from "aws-amplify";

@Injectable({ providedIn: "root" })
export class HasRegisteredGuard implements CanActivate {
  destroyed$: Subject<boolean> = new Subject<boolean>();
  initialized = false;
  constructor(private clientService: ClientService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return Auth.currentUserInfo().then(
      (val) => {
        debugger;

        const user = get(val.attributes, "custom:org_id", get(val, "username"));

        // const orgId = get(val.attributes, "custom:org_id");

        if (isNil(user)) {
          return this.handleResult(false);
        }

        if (this.initialized) {
          return this.handleResult(true);
        }

        return this.clientService
          .getClient(user)
          .pipe(
            take(1),
            map((data) => {
              if (isNil(data)) {
                return this.handleResult(false);
              }
              const client = Client.buildFromGetClientResponse(data);
              if (!has(client.orgDetails, "hasRegistered")) {
                return this.handleResult(false);
              }
              return client.orgDetails.hasRegistered;
            }),
            tap((result) => this.handleResult(result)),
            catchError((e) => {
              this.handleResult(false);
              return EMPTY;
            })
          )
          .toPromise();
      },
      () => {
        return this.handleResult(false);
      }
    );
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
  }

  handleResult(result: boolean) {
    if (!result) {
      this.initialized = false;
      this.router.navigate(["/registration"]);
    }
    this.initialized = true;
    return result;
  }
}
