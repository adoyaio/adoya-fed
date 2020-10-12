import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AmplifyService } from "aws-amplify-angular";
import { tap } from "rxjs/operators";
import { ClientService } from "src/app/core/services/client.service";
import { UserAccountService } from "src/app/core/services/user-account.service";
import { SupportItem } from "../models/support-item";

@Component({
  selector: "app-support",
  templateUrl: "./support.component.html",
  styleUrls: ["./support.component.scss"],
})
export class SupportComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userAccountService: UserAccountService,
    private amplifyService: AmplifyService
  ) {}

  supportForm = this.fb.group({
    subject: [""],
    description: [""],
    username: [""],
    orgId: [""],
  });

  client: SupportItem = new SupportItem();
  isLoadingResults = true;
  isSendingResults;
  orgId: string;
  subject: string;
  username: string;

  ngOnInit() {
    this.amplifyService
      .authState()
      .pipe(
        tap((authState) => {
          if (!(authState.state === "signedIn")) {
            this.router.navigateByUrl("/portal");
          }
        })
      )
      .subscribe();

    this.orgId = this.userAccountService
      .getCurrentUser()
      .UserAttributes.find((val) => {
        return val.Name === "custom:org_id";
      }).Value;

    this.username = this.userAccountService
      .getCurrentUser()
      .UserAttributes.find((val) => {
        return val.Name === "email";
      }).Value;

    this.subject = "10/15/25: Adoya support ticket";
    this.username = "jakub@weareher.com";
    this.supportForm.get("subject").disable();
    this.supportForm.get("subject").setValue(this.subject);

    this.supportForm.get("username").disable();
    this.supportForm.get("username").setValue(this.username);

    this.supportForm.get("orgId").disable();
    this.supportForm.get("orgId").setValue(this.orgId);

    this.supportForm
      .get("description")
      .setValidators([Validators.minLength(1), Validators.required]);
  }
  onSupportSubmit() {}
  onResetForm() {}
}
