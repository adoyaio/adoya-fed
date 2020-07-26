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
    //console.log("authGuard:::" + this.userAccountService.getSignedInState());
    // return this.userAccountService.signedIn;
    // return this.userAccountService.getSignedInState();

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

    // return this.userAccountService.currentUser$.pipe(
    //   filter((user) => user !== undefined),
    //   map((user) => {
    //     console.log("canActivate");
    //     if (user) {
    //       console.log("canActivate:::found user" + user.Username);
    //       signedIn = true;
    //       //if(window.location.href)
    //       //this.router.navigate["/workbench"];
    //     } else {
    //       console.log("canActivate:::no user");
    //       signedIn = false;
    //       this.router.navigateByUrl("/portal");
    //     }
    //     return signedIn;
    //   })
    // );
    // return true;

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
