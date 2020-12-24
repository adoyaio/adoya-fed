import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material";
import { Router } from "@angular/router";
import { AmplifyService } from "aws-amplify-angular";
import { catchError, map, tap } from "rxjs/operators";
import { Client } from "src/app/core/models/client";
import { ClientService } from "src/app/core/services/client.service";
import { UserAccountService } from "src/app/core/services/user-account.service";
import { CustomFormValidators } from "src/app/shared/dynamic-form/validators/CustomFormValidators";

@Component({
  selector: "app-preferences",
  templateUrl: "./preferences.component.html",
  styleUrls: ["./preferences.component.scss"],
})
export class PreferencesComponent implements OnInit {
  constructor(
    private amplifyService: AmplifyService,
    private router: Router,
    private fb: FormBuilder,
    private userAccountService: UserAccountService,
    private clientService: ClientService,
    private snackBar: MatSnackBar
  ) {}

  preferencesForm = this.fb.group({
    emailAddresses: [""],
  });

  client: Client = new Client();
  isLoadingResults = true;
  isSendingResults;
  orgId: string;

  ngOnInit() {
    this.preferencesForm
      .get("emailAddresses")
      .setValidators([
        CustomFormValidators.emailListValidator,
        Validators.minLength(1),
        Validators.required,
      ]);

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

    this.clientService
      .getClient(this.orgId)
      .pipe(
        tap((_) => {
          this.isLoadingResults = true;
        }),
        map((data) => {
          this.client = Client.buildFromGetClientResponse(data);

          this.preferencesForm
            .get("emailAddresses")
            .setValue(this.client.orgDetails.emailAddresses);

          this.isLoadingResults = false;
          return data;
        }),
        catchError(() => {
          this.isLoadingResults = false;
          return [];
        })
      )
      .subscribe();
  }
}
