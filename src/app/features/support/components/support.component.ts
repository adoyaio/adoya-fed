import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material";
import { Router } from "@angular/router";
import { AmplifyService } from "aws-amplify-angular";
import { catchError, map, tap } from "rxjs/operators";
import { ClientService } from "src/app/core/services/client.service";
import { SupportService } from "src/app/core/services/support.service";
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
    private supportService: SupportService,
    private snackBar: MatSnackBar
  ) {}

  public supportForm = this.fb.group({
    subject: [""],
    description: [""],
    username: [""],
    orgId: [""],
  });

  supportItem: SupportItem = new SupportItem();
  isLoadingResults = true;
  isSendingResults;
  orgId: string;
  subject: string;
  username: string;
  today: Date;

  ngOnInit() {
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

    this.today = new Date();
    this.subject =
      this.today.toLocaleDateString().toString() + " Adoya support ticket";
    this.supportForm.get("subject").setValue(this.subject);
    this.supportForm.get("username").setValue(this.username);
    this.supportForm.get("orgId").setValue(this.orgId);

    this.supportForm
      .get("description")
      .setValidators([Validators.minLength(1), Validators.required]);
  }
  onSupportSubmit() {
    this.isSendingResults = true;
    this.supportItem.description = this.supportForm.get("description").value;
    this.supportItem.username = this.supportForm.get("username").value;
    this.supportItem.subject = this.supportForm.get("subject").value;
    this.supportItem.orgId = this.supportForm.get("orgId").value;
    this.supportItem.type = "support";

    this.supportService
      .postSupportItem(this.supportItem)
      .pipe(
        tap((_) => {
          this.isSendingResults = true;
        }),
        map((data) => {
          this.isSendingResults = false;
          this.openSnackBar(
            "successfully sumbitted your support ticket. thank you for contacting adoya support!",
            "dismiss"
          );
          this.supportForm.reset();
          return data;
        }),
        catchError(() => {
          this.isSendingResults = false;
          this.openSnackBar(
            "unable to submit your support ticket, please enter required fields.",
            "dismiss"
          );
          return [];
        })
      )
      .subscribe();
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 10000,
      panelClass: "standard",
    });
  }
}
