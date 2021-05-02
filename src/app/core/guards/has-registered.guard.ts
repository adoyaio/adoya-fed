import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanLoad,
  Route,
  RouterStateSnapshot,
  UrlSegment,
  Router,
} from "@angular/router";
import { Observable, of, Subject } from "rxjs";
import { AmplifyService } from "aws-amplify-angular";
import { AuthState } from "aws-amplify-angular/dist/src/providers";
import {
  tap,
  switchMap,
  map,
  filter,
  catchError,
  takeUntil,
} from "rxjs/operators";
import { UserAccountService } from "../services/user-account.service";
import { ClientService } from "../services/client.service";
import { get, has, isNil } from "lodash";
import { Client } from "../models/client";
import { HttpErrorResponse } from "@angular/common/http";

@Injectable({ providedIn: "root" })
export class HasRegisteredGuard implements CanActivate {
  destroyed$: Subject<boolean> = new Subject<boolean>();
  constructor(
    private amplifyService: AmplifyService,
    private userAccountService: UserAccountService,
    private clientService: ClientService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const orgId = this.userAccountService
      .getCurrentUser()
      .UserAttributes.find((val) => {
        return val.Name === "custom:org_id";
      }).Value;

    if (isNil(orgId)) {
      return this.handleResult(false);
    }

    return this.clientService.getClient(orgId).pipe(
      map((data) => {
        const client = Client.buildFromGetClientResponse(data);
        return has(client, "registered") && !!get(client, "registered");
      }),
      tap((result) => this.handleResult(result)),
      takeUntil(this.destroyed$),
      catchError((error: HttpErrorResponse) => {
        return of(this.handleResult(false));
      })
    );
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
  }

  handleResult(result: boolean) {
    if (!result) {
      this.router.navigate(["/registration"]);
    }
    return result;
  }
}
