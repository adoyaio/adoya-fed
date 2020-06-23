import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanLoad,
  Route,
  RouterStateSnapshot,
  UrlSegment,
} from "@angular/router";
import { Observable, of } from "rxjs";
import { AmplifyService } from "aws-amplify-angular";
import { AuthState } from "aws-amplify-angular/dist/src/providers";
import { tap, switchMap, map } from "rxjs/operators";

@Injectable({ providedIn: "root" })
export class AuthGuard implements CanActivate {
  constructor(private amplifyService: AmplifyService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    let signedIn = false;

    return this.amplifyService.authState().pipe(
      map((authState: AuthState) => {
        console.log("canUpdate " + authState.user);

        signedIn = authState.state === "signedIn" ? true : false;
        console.log("setting signedIn " + signedIn);
        console.log("found state " + authState.state);
        return signedIn;
      })
    );
  }
}
