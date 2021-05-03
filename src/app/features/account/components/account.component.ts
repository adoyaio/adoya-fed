import { Component, OnInit } from "@angular/core";
import { AmplifyService } from "aws-amplify-angular";
import { FormBuilder } from "@angular/forms";
import { UserAccountService } from "src/app/core/services/user-account.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-account",
  templateUrl: "./account.component.html",
  styleUrls: ["./account.component.scss"],
})
export class AccountComponent implements OnInit {
  constructor(
    private amplifyService: AmplifyService,
    private fb: FormBuilder,
    private userAccountService: UserAccountService,
    private router: Router
  ) {}

  accountForm = this.fb.group({
    orgId: [""],
    firstName: [""],
    lastName: [""],
    email: [""],
  });

  ngOnInit() {
    const orgId = this.userAccountService
      .getCurrentUser()
      .UserAttributes.find((val) => {
        return val.Name === "custom:org_id";
      }).Value;

    this.accountForm.get("orgId").setValue(orgId);

    const firstName = this.userAccountService
      .getCurrentUser()
      .UserAttributes.find((val) => {
        return val.Name === "custom:first_name";
      }).Value;

    this.accountForm.get("firstName").setValue(firstName);

    const lastName = this.userAccountService
      .getCurrentUser()
      .UserAttributes.find((val) => {
        return val.Name === "custom:last_name";
      }).Value;

    this.accountForm.get("lastName").setValue(lastName);

    const email = this.userAccountService
      .getCurrentUser()
      .UserAttributes.find((val) => {
        return val.Name === "email";
      }).Value;

    this.accountForm.get("email").setValue(email);
  }

  onSupportClick() {
    this.router.navigateByUrl("/workbench/support");
  }
}
