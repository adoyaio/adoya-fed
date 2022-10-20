import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  Router,
} from "@angular/router";
import { Observable, Subject } from "rxjs";
import { get, isNil } from "lodash";
import { Auth } from "aws-amplify";

@Injectable({ providedIn: "root" })
export class IsAdminGuard implements CanActivate {
  destroyed$: Subject<boolean> = new Subject<boolean>();
  initialized = false;
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

        const email = get(val, "idToken.payload.email", "na");
        if (email === "info@adoya.io") {
          return true;
        }

        this.router.navigateByUrl("/portal");
        return false;
      },
      () => {
        this.router.navigateByUrl("/portal");
        return false;
      }
    );
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
  }
}
