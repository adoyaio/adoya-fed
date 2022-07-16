import { NavLinkService } from "./../services/nav-link.service";
import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { MatSidenav } from "@angular/material";
import { AmplifyService } from "aws-amplify-angular";
import { UserAccountService } from "src/app/core/services/user-account.service";
import { takeUntil, tap } from "rxjs/operators";
import { get } from "lodash";
import { Subject } from "rxjs";

@Component({
  selector: "app-secure-layout",
  templateUrl: "./secure-layout.component.html",
  styleUrls: ["./secure-layout.component.scss"],
})
export class SecureLayoutComponent implements OnInit {
  @ViewChild("drawer", { static: true }) private drawer: MatSidenav;
  destroyed$: Subject<boolean> = new Subject<boolean>();
  constructor(
    private router: Router,
    private navLinkService: NavLinkService,
    private amplifyService: AmplifyService,
    private userAccountService: UserAccountService
  ) {
    this.amplifyService
      .authState()
      .pipe(
        tap((authState) => {
          if (!(authState.state === "signedIn")) {
            this.userAccountService.jwtToken = undefined;
            this.userAccountService.orgId = undefined;
            this.router.navigateByUrl("/portal");
          }
          const jwtToken = get(
            authState,
            "user.signInUserSession.idToken.jwtToken"
          );
          const orgId = get(
            authState,
            "user.signInUserSession.idToken.payload.custom:org_id"
          );

          this.userAccountService.jwtToken = jwtToken;
          this.userAccountService.orgId = orgId;
        }),
        takeUntil(this.destroyed$)
      )
      .subscribe();
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.destroyed$.next(true);
  }

  toggleDrawer() {
    this.drawer.toggle();
  }
  handleLogoClick() {
    this.drawer.close();
  }
}
