//import { Component } from "@angular/core";

// @Component({
//   selector: 'app-root',
//   templateUrl: './app.component.html',
//   styleUrls: ['./app.component.scss']
// })
// export class AppComponent {
//   title = 'adoya-fed';
// }

import { AfterViewInit, Component, OnDestroy } from "@angular/core";
import { Title } from "@angular/platform-browser";
import {
  ActivatedRoute,
  NavigationCancel,
  NavigationEnd,
  NavigationStart,
  Router,
} from "@angular/router";
import { AmplifyService } from "aws-amplify-angular";
import { get, isNil } from "lodash";
import { Subject } from "rxjs";
import { filter, map, mergeMap, take, takeUntil, tap } from "rxjs/operators";
import { UserAccountService } from "./core/services/user-account.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements AfterViewInit, OnDestroy {
  isAppLoading = true;
  destroyed$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private router: Router,
    // private route: ActivatedRoute,
    private titleService: Title,
    private activatedRoute: ActivatedRoute,
    // private amplifyService: AmplifyService,
    private userAccountService: UserAccountService
  ) {
    this.titleService.setTitle("adoya client portal");

    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => {
          return this.activatedRoute;
        }),
        map((r) => {
          while (r.firstChild) {
            r = r.firstChild;
          }
          return r;
        }),
        filter((r) => r.outlet === "primary"),
        mergeMap((r) => r.data),
        map((event) => this.titleService.setTitle(event["title"])),
        takeUntil(this.destroyed$)
      )
      .subscribe();

    this.userAccountService.amplifyService
      .authState()
      .pipe(
        // take(1),
        tap((authState) => {
          if (!(authState.state === "signedIn")) {
            this.userAccountService.jwtToken = undefined;
            this.userAccountService.orgId = undefined;
            if (
              !window.location.href.includes("home") &&
              !window.location.href.includes("start") &&
              !window.location.href.includes("legal") &&
              !window.location.href.includes("portal-internal") &&
              !window.location.href.includes("login")
            )
              this.router.navigateByUrl("/portal");
          }
          const jwtToken = get(
            authState,
            "user.signInUserSession.idToken.jwtToken"
          );

          // TODO check if user is an agent and if so org id is set from agents page
          //debugger;
          const isAgent = get(
            authState,
            "user.signInUserSession.idToken.payload.custom:agent",
            0
          )
            ? true
            : false;

          if (isAgent) {
            //this.router.navigateByUrl("/workbench/agents");
            //return;
            this.userAccountService.agentId = get(authState, "user.username");
          }

          // orgid from custom:org_id if there is one
          //  legacy and admin users fallback to cognito id
          const orgId = get(
            authState,
            "user.signInUserSession.idToken.payload.custom:org_id",
            get(authState, "user.username")
          );

          const userName = get(authState, "user.attributes.email");

          this.userAccountService.jwtToken = jwtToken;
          this.userAccountService.orgId = orgId;
          this.userAccountService.userName = userName;
        })
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.isAppLoading = false;
    }, 500);
  }
}
