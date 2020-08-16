import { Validator } from "./../../../shared/dynamic-form/interfaces/validator.interface";
import { Router } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { AmplifyService } from "aws-amplify-angular";
import { map, tap, catchError } from "rxjs/operators";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from "@angular/forms";
import { UserAccountService } from "src/app/core/services/user-account.service";
import { ClientService } from "src/app/core/services/client.service";
import { Client } from "../../reporting/models/client";
import { CustomFormValidators } from "src/app/shared/dynamic-form/validators/CustomFormValidators";
import { EMPTY } from "rxjs";
import { ClientPayload } from "../../reporting/models/client-payload";
import { MatSnackBar } from "@angular/material";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit {
  constructor(
    private amplifyService: AmplifyService,
    private router: Router,
    private fb: FormBuilder,
    private userAccountService: UserAccountService,
    private clientService: ClientService,
    private snackBar: MatSnackBar
  ) {}

  appleForm = this.fb.group({
    objective: [""],
    highCPI: [""],
  });
  branchForm = this.fb.group({
    branchObjective: [""],
    cppThreshold: [""],
    revenueOverSpend: [""],
  });

  preferencesForm = this.fb.group({
    emailAddresses: [""],
  });

  client: Client = new Client();
  isLoadingResults = true;
  isSendingResults;
  orgId: string;

  ngOnInit() {
    this.appleForm
      .get("highCPI")
      .setValidators([Validators.min(0.1), Validators.max(1000)]);

    this.branchForm
      .get("cppThreshold")
      .setValidators([Validators.min(0.1), Validators.max(1000)]);

    this.branchForm
      .get("revenueOverSpend")
      .setValidators([Validators.min(0.1), Validators.max(1000)]);

    this.preferencesForm
      .get("emailAddresses")
      .setValidators([CustomFormValidators.emailListValidator]);

    // this.appleForm.get("objective").setValidators([Validators.required]);

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

          this.appleForm
            .get("objective")
            .setValue(this.client.orgDetails.bidParameters.objective);

          this.appleForm
            .get("highCPI")
            .setValue(
              this.client.orgDetails.bidParameters.highCPIBidDecreaseThresh
            );

          this.branchForm
            .get("branchObjective")
            .setValue(
              this.client.orgDetails.branchBidParameters.branchOptimizationGoal
            );

          this.branchForm
            .get("cppThreshold")
            .setValue(
              this.client.orgDetails.branchBidParameters
                .costPerPurchaseThreshold
            );

          this.branchForm
            .get("revenueOverSpend")
            .setValue(
              this.client.orgDetails.branchBidParameters
                .revenueOverAdSpendThreshold
            );

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

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 10000,
      panelClass: "standard",
    });
  }

  onResetForm() {
    this.appleForm
      .get("objective")
      .setValue(this.client.orgDetails.bidParameters.objective);

    this.appleForm
      .get("highCPI")
      .setValue(this.client.orgDetails.bidParameters.highCPIBidDecreaseThresh);

    this.branchForm
      .get("branchObjective")
      .setValue(
        this.client.orgDetails.branchBidParameters.branchOptimizationGoal
      );
    this.branchForm
      .get("cppThreshold")
      .setValue(
        this.client.orgDetails.branchBidParameters.costPerPurchaseThreshold
      );
    this.branchForm
      .get("revenueOverSpend")
      .setValue(
        this.client.orgDetails.branchBidParameters.revenueOverAdSpendThreshold
      );
    this.preferencesForm
      .get("emailAddresses")
      .setValue(this.client.orgDetails.emailAddresses);
  }

  onAppleSubmit() {
    if (
      this.preferencesForm.valid &&
      this.appleForm.valid &&
      this.branchForm.valid
    ) {
      this.isSendingResults = true;

      this.client.orgDetails.bidParameters.objective = this.appleForm.get(
        "objective"
      ).value;
      this.client.orgDetails.adgroupBidParameters.objective = this.appleForm.get(
        "objective"
      ).value;
      this.client.orgDetails.bidParameters.highCPIBidDecreaseThresh = this.appleForm.get(
        "highCPI"
      ).value;
      this.client.orgDetails.adgroupBidParameters.highCPIBidDecreaseThresh = this.appleForm.get(
        "highCPI"
      ).value;

      this.client.orgDetails.branchBidParameters.branchOptimizationGoal = this.branchForm.get(
        "branchObjective"
      ).value;
      this.client.orgDetails.branchBidParameters.costPerPurchaseThreshold = this.branchForm.get(
        "cppThreshold"
      ).value;
      this.client.orgDetails.branchBidParameters.revenueOverAdSpendThreshold = this.branchForm.get(
        "revenueOverSpend"
      ).value;

      this.clientService
        .postClient(ClientPayload.buildFromClient(this.client))
        .pipe(
          tap((_) => {
            this.isSendingResults = true;
          }),
          map((data) => {
            this.isSendingResults = false;
            this.openSnackBar("successfully updated settings", "dismiss");
            return data;
          }),
          catchError(() => {
            this.isSendingResults = false;
            this.openSnackBar(
              "unable to process changes to preferences or settings at this time",
              "dismiss"
            );
            return [];
          })
        )
        .subscribe();
    } else {
      this.openSnackBar(
        "please double check preferences and settings, something appears to be invalid",
        "dismiss"
      );
    }
  }

  onPreferencesSubmit() {
    if (
      this.preferencesForm.valid &&
      this.appleForm.valid &&
      this.branchForm.valid
    ) {
      this.isSendingResults = true;

      if (
        String(this.preferencesForm.get("emailAddresses").value).includes(",")
      ) {
        this.client.orgDetails.emailAddresses = String(
          this.preferencesForm.get("emailAddresses").value
        ).split(",");
      } else {
        this.client.orgDetails.emailAddresses = [
          this.preferencesForm.get("emailAddresses").value,
        ];
      }

      this.clientService
        .postClient(ClientPayload.buildFromClient(this.client))
        .pipe(
          tap((_) => {
            this.isSendingResults = true;
          }),
          map((data) => {
            this.isSendingResults = false;
            this.openSnackBar("successfully updated preferences", "dismiss");
            return data;
          }),
          catchError(() => {
            this.isSendingResults = false;
            this.openSnackBar(
              "unable to process changes to preferences or settings at this time",
              "dismiss"
            );
            return [];
          })
        )
        .subscribe();
    } else {
      this.openSnackBar(
        "please double check preferences and settings, something appears to be invalid",
        "dismiss"
      );
    }
  }
}
