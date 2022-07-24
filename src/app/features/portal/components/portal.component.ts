import { Component, Input, OnInit } from "@angular/core";
import { AmplifyService } from "aws-amplify-angular";
import { Router } from "@angular/router";
import { tap } from "rxjs/operators";

@Component({
  selector: "app-portal",
  templateUrl: "./portal.component.html",
  styleUrls: ["./portal.component.scss"],
})
export class PortalComponent implements OnInit {
  @Input() signUpType: string;
  @Input() isSignUp: boolean;
  constructor(
    private amplifyService: AmplifyService,
    private router: Router // public dialogRef: MatDialogRef<PortalComponent> // @Inject(MAT_DIALOG_DATA) public data: PortalDialogData
  ) {}

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
      // {
      //   label: "Organization",
      //   key: "org_id",
      //   required: true,
      //   displayOrder: 6,
      //   type: "string",
      //   custom: true,
      // },
    ],
  };

  ngOnInit(): void {
    this.amplifyService.authStateChange$
      .pipe(
        tap((authState) => {
          // if (
          //   !window.location.href.includes("home") &&
          //   !window.location.href.includes("start")
          // )

          if (authState.state === "signedIn") {
            this.router.navigateByUrl("/workbench");
          } else {
            //this.router.navigateByUrl("/portal");
          }
        })
      )
      .subscribe();
  }
}
