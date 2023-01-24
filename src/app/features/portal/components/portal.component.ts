import { Component, Input, OnInit } from "@angular/core";
import { AmplifyService } from "aws-amplify-angular";
import { Router } from "@angular/router";
import { take, tap } from "rxjs/operators";
import { MatDialog } from "@angular/material";
import { DynamicModalComponent } from "src/app/shared/dynamic-modal/dynamic-modal.component";
import { AppService } from "src/app/core/services/app.service";
import { get } from "lodash";

@Component({
  selector: "app-portal",
  templateUrl: "./portal.component.html",
  styleUrls: ["./portal.component.scss"],
})
export class PortalComponent implements OnInit {
  @Input() signUpType: string;
  @Input() isSignUp: boolean;
  constructor(
    private dialog: MatDialog,
    private amplifyService: AmplifyService,
    private router: Router // public dialogRef: MatDialogRef<PortalComponent> // @Inject(MAT_DIALOG_DATA) public data: PortalDialogData
  ) {}

  printViewText = AppService.termsOfService;

  user: any;
  greeting: string;
  usernameAttributes = "email";
  // signUpConfig = {
  //   header: "Client Portal Sign Up",
  //   hideAllDefaults: true,
  //   defaultCountryCode: "1",
  //   signUpFields: [
  //     {
  //       label: "Email",
  //       key: "email",
  //       required: true,
  //       displayOrder: 1,
  //       type: "string",
  //     },
  //     {
  //       label: "Password",
  //       key: "password",
  //       required: true,
  //       displayOrder: 2,
  //       type: "password",
  //     },
  //     // {
  //     //   label: "Phone Number",
  //     //   key: "phone_number",
  //     //   required: true,
  //     //   displayOrder: 3,
  //     //   type: "string",
  //     // },
  //     {
  //       label: "First Name",
  //       key: "first_name",
  //       required: false,
  //       displayOrder: 4,
  //       type: "string",
  //       custom: true,
  //     },
  //     {
  //       label: "Last Name",
  //       key: "last_name",
  //       required: false,
  //       displayOrder: 5,
  //       type: "string",
  //       custom: true,
  //     },
  //     // {
  //     //   label: "Organization",
  //     //   key: "org_id",
  //     //   required: true,
  //     //   displayOrder: 6,
  //     //   type: "string",
  //     //   custom: true,
  //     // },
  //   ],
  // };

  ngOnInit(): void {
    this.amplifyService.authStateChange$
      .pipe(
        tap((authState) => {
          // if (
          //   !window.location.href.includes("home") &&
          //   !window.location.href.includes("start")
          // )

          if (authState.state === "signedIn") {
            if (authState.user.attributes.email === "info@adoya.io") {
              this.router.navigateByUrl("/onboarding");
              return;
            }
            this.router.navigateByUrl("/workbench");
          } else {
            //this.router.navigateByUrl("/portal");
          }
        })
      )
      .subscribe();
  }

  handlePrintTerms($event) {
    this.printViewText = get($event, "text");
    setTimeout(() => {
      window.print();
    });
  }

  handleShowTermsClick($event) {
    $event.preventDefault();
    this.printViewText = AppService.termsOfService;
    this.dialog
      .open(DynamicModalComponent, {
        data: {
          title: ``,
          content: AppService.termsOfService,
          actionYes: "Save",
          actionNo: "Close",
        },
        maxWidth: "500px",
        width: "500px",
        panelClass: "tooltip-dialog-box",
        autoFocus: false,
      })
      .afterClosed()
      .pipe(
        take(1),
        tap((val) => {
          if (val) {
            setTimeout(() => {
              window.print();
            });
          }
        })
      )
      .subscribe();
  }

  handleCTA() {
    window.open("https://www.adoya.io/apple-search-ads", "_blank");
  }
}
