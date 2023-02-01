import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  Router,
} from "@angular/router";

import { Auth } from "aws-amplify";
import { isNil } from "lodash";
import { Observable } from "rxjs/Observable";

@Injectable({ providedIn: "root" })
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return Auth.currentSession().then(
      (val) => {
        if (isNil(val)) {
          this.router.navigateByUrl("/portal");
          return false;
        }

        return true;
      },
      () => {
        this.router.navigateByUrl("/portal");
        return false;
      }
    );
  }
}
