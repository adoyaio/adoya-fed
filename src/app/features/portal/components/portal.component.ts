import { Component, OnInit } from "@angular/core";
import { AmplifyService } from "aws-amplify-angular";
import { Router } from "@angular/router";
import { tap } from "rxjs/operators";
import { UserAccount } from "src/app/shared/models/user-account";
import { UserAccountService } from "src/app/core/services/user-account.service";

@Component({
  selector: "app-portal",
  templateUrl: "./portal.component.html",
  styleUrls: ["./portal.component.scss"],
})
export class PortalComponent implements OnInit {
  constructor(
    private amplifyService: AmplifyService,
    private router: Router,
    private userAccountService: UserAccountService
  ) {
    // this.amplifyService.authStateChange$.subscribe((authState) => {
    //   if (authState.state === "signedIn") {
    //     this.signedIn = authState.state === "signedIn";
    //     if (!authState.user) {
    //       this.user = null;
    //     } else {
    //       this.user = authState.user;
    //       console.log(this.userAccountService.getCurrentUser().userName);
    //       // this.greeting = this.user.username;
    //     }
    //     this.router.navigateByUrl("/workbench/reporting");
    //   } else {
    //     this.router.navigateByUrl("/portal");
    //   }
    // });

    this.amplifyService.authStateChange$
      .pipe(
        tap((authState) => {
          if (authState.state === "signedIn") {
            this.signedIn = authState.state === "signedIn";
            if (!authState.user) {
              this.user = null;
            } else {
              this.user = authState.user;
              const user: UserAccount = this.userAccountService.getCurrentUser();
              this.userAccountService.setCurrentUser(user);
              // this.greeting = this.user.username;
            }
            this.router.navigateByUrl("/workbench/reporting");
          } else {
            this.router.navigateByUrl("/portal");
          }
        })
      )
      .subscribe();
  }
  signedIn: boolean;
  user: any;
  greeting: string;
  usernameAttributes = "email";
  signUpConfig = {
    header: "Client Portal Sign Up",
    hideAllDefaults: true,
    defaultCountryCode: "1",
    signUpFields: [
      {
        label: "Email",
        key: "email",
        required: true,
        displayOrder: 1,
        type: "string",
      },
      {
        label: "Password",
        key: "password",
        required: true,
        displayOrder: 2,
        type: "password",
      },
      // {
      //   label: "Phone Number",
      //   key: "phone_number",
      //   required: true,
      //   displayOrder: 3,
      //   type: "string",
      // },
      {
        label: "First Name",
        key: "first_name",
        required: false,
        displayOrder: 4,
        type: "string",
        custom: true,
      },
      {
        label: "Last Name",
        key: "last_name",
        required: false,
        displayOrder: 5,
        type: "string",
        custom: true,
      },
      {
        label: "Organization",
        key: "org_id",
        required: true,
        displayOrder: 6,
        type: "string",
        custom: true,
      },
    ],
  };

  ngOnInit(): void {}
}
