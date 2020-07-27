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
import { Observable, of } from "rxjs";
import { AmplifyService } from "aws-amplify-angular";
import { AuthState } from "aws-amplify-angular/dist/src/providers";
import { tap, switchMap, map, filter } from "rxjs/operators";
import { UserAccountService } from "../services/user-account.service";

@Injectable({ providedIn: "root" })
export class AuthGuard implements CanActivate {
  constructor(
    private amplifyService: AmplifyService,
    private userAccountService: UserAccountService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    let signedIn = false;
    //   return this.amplifyService.authState().pipe(
    //     map((authState: AuthState) => {
    //       console.log("canUpdate " + authState.user);

    //       signedIn = authState.state === "signedIn" ? true : false;
    //       console.log("setting signedIn " + signedIn);
    //       console.log("found state " + authState.state);
    //       return signedIn;
    //     })
    //   );
    // }

    // if (this.userAccountService.currentUser$ === undefined) {
    //   console.log("canActivate:: no current user");
    //   this.router.navigateByUrl("/portal");
    //   return false;
    // }

    if (
      this.userAccountService.getCurrentUser() === undefined ||
      this.userAccountService.getCurrentUser() === null
    ) {
      this.router.navigateByUrl("/portal");
      return false;
    }

    return true;
  }
}
