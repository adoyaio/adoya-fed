import { Router } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { AmplifyService } from "aws-amplify-angular";
import { map, tap, catchError, filter } from "rxjs/operators";
import { combineLatest } from "rxjs";
import { FormBuilder, Validators } from "@angular/forms";
import { UserAccountService } from "src/app/core/services/user-account.service";
import { ClientService } from "src/app/core/services/client.service";
import { Client } from "../../../core/models/client";
import { CustomFormValidators } from "src/app/shared/dynamic-form/validators/CustomFormValidators";

import { MatCheckboxChange, MatSnackBar } from "@angular/material";
import { each as _each, isNil, map as _map } from "lodash";
import { ClientPayload } from "src/app/core/models/client-payload";

@Component({
  selector: "app-optimizations",
  templateUrl: "./optimizations.component.html",
  styleUrls: ["./optimizations.component.scss"],
})
export class OptimizationsComponent implements OnInit {
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
    highCPIBrand: [""],
  });
  branchForm = this.fb.group({
    branchObjective: [""],
    cppThreshold: [""],
    cppThresholdBrand: [""],
    revenueOverSpend: [""],
    revenueOverSpendBrand: [""],
    branchBidAdjusterEnabled: false,
    branchKey: [""],
    branchSecret: [""],
  });

  // preferencesForm = this.fb.group({
  //   emailAddresses: [""],
  // });

  client: Client = new Client();
  isLoadingResults = true;
  isSendingResults;
  orgId: string;

  ngOnInit() {
    this.appleForm
      .get("highCPI")
      .setValidators([
        Validators.min(0.1),
        Validators.max(1000),
        Validators.minLength(1),
        Validators.required,
      ]);

    this.appleForm
      .get("highCPIBrand")
      .setValidators([
        Validators.min(0.1),
        Validators.max(1000),
        Validators.minLength(1),
        Validators.required,
      ]);

    this.branchForm
      .get("cppThreshold")
      .setValidators([
        Validators.min(0.1),
        Validators.max(1000),
        Validators.minLength(1),
        Validators.required,
      ]);

    this.branchForm
      .get("cppThresholdBrand")
      .setValidators([
        Validators.min(0.1),
        Validators.max(1000),
        Validators.minLength(1),
        Validators.required,
      ]);

    this.branchForm
      .get("revenueOverSpend")
      .setValidators([
        Validators.min(0.1),
        Validators.max(1000),
        Validators.minLength(1),
        Validators.required,
      ]);

    this.branchForm
      .get("revenueOverSpendBrand")
      .setValidators([
        Validators.min(0.1),
        Validators.max(1000),
        Validators.minLength(1),
        Validators.required,
      ]);

    // this.preferencesForm
    //   .get("emailAddresses")
    //   .setValidators([
    //     CustomFormValidators.emailListValidator,
    //     Validators.minLength(1),
    //     Validators.required,
    //   ]);

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
              this.client.orgDetails.bidParameters.highCPIBidDecreaseThreshExact
            );

          this.appleForm
            .get("highCPIBrand")
            .setValue(
              this.client.orgDetails.bidParameters.highCPIBidDecreaseThreshBrand
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
                .costPerPurchaseThresholdExact
            );

          this.branchForm
            .get("cppThresholdBrand")
            .setValue(
              this.client.orgDetails.branchBidParameters
                .costPerPurchaseThresholdBrand
            );

          this.branchForm
            .get("revenueOverSpend")
            .setValue(
              this.client.orgDetails.branchBidParameters
                .revenueOverAdSpendThresholdExact
            );

          this.branchForm
            .get("revenueOverSpendBrand")
            .setValue(
              this.client.orgDetails.branchBidParameters
                .revenueOverAdSpendThresholdBrand
            );

          this.branchForm
            .get("branchBidAdjusterEnabled")
            .setValue(
              this.client.orgDetails.branchIntegrationParameters
                .branchBidAdjusterEnabled
            );

          this.branchForm
            .get("branchKey")
            .setValue(
              this.client.orgDetails.branchIntegrationParameters.branchKey
            );

          this.branchForm
            .get("branchSecret")
            .setValue(
              this.client.orgDetails.branchIntegrationParameters.branchSecret
            );

          // this.preferencesForm
          //   .get("emailAddresses")
          //   .setValue(this.client.orgDetails.emailAddresses);

          if (
            !this.client.orgDetails.branchIntegrationParameters
              .branchBidAdjusterEnabled
          ) {
            this.branchForm.get("cppThreshold").disable();
            this.branchForm.get("cppThresholdBrand").disable();
            this.branchForm.get("revenueOverSpend").disable();
            this.branchForm.get("revenueOverSpendBrand").disable();
            this.branchForm.get("branchObjective").disable();
            this.branchForm.get("branchObjectiveBrand").disable();
            this.branchForm.get("branchKey").disable();
            this.branchForm.get("branchSecret").disable();
          }

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

  ngAfterViewInit() {
    combineLatest([
      this.branchForm.get("branchBidAdjusterEnabled").valueChanges,
      this.branchForm.get("branchObjective").valueChanges,
    ])
      .pipe(
        filter(([enabled, objective]) => !isNil(enabled) && !isNil(objective)),
        tap(([enabled, objective]) => {
          if (!enabled) {
            this.branchForm.get("cppThreshold").disable();
            this.branchForm.get("cppThresholdBrand").disable();
            this.branchForm.get("revenueOverSpend").disable();
            this.branchForm.get("revenueOverSpendBrand").disable();
            this.branchForm.get("revenueOverSpendBrand").disable();
            this.branchForm.get("branchKey").disable();
            this.branchForm.get("branchSecret").disable();
            return;
          }

          if (objective === "revenue_over_ad_spend") {
            this.branchForm.get("cppThreshold").disable();
            this.branchForm.get("cppThresholdBrand").disable();
            this.branchForm.get("revenueOverSpend").enable();
            this.branchForm.get("revenueOverSpendBrand").enable();
          }
          if (objective === "cost_per_purchase") {
            this.branchForm.get("cppThreshold").enable();
            this.branchForm.get("cppThresholdBrand").enable();
            this.branchForm.get("revenueOverSpend").disable();
            this.branchForm.get("revenueOverSpendBrand").disable();
          }
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
      .setValue(
        this.client.orgDetails.bidParameters.highCPIBidDecreaseThreshExact
      );

    this.appleForm
      .get("highCPIBrand")
      .setValue(
        this.client.orgDetails.bidParameters.highCPIBidDecreaseThreshBrand
      );

    this.branchForm
      .get("branchObjective")
      .setValue(
        this.client.orgDetails.branchBidParameters.branchOptimizationGoal
      );

    this.branchForm
      .get("cppThreshold")
      .setValue(
        this.client.orgDetails.branchBidParameters.costPerPurchaseThresholdExact
      );

    this.branchForm
      .get("cppThresholdBrand")
      .setValue(
        this.client.orgDetails.branchBidParameters.costPerPurchaseThresholdBrand
      );

    this.branchForm
      .get("revenueOverSpend")
      .setValue(
        this.client.orgDetails.branchBidParameters
          .revenueOverAdSpendThresholdExact
      );

    this.branchForm
      .get("revenueOverSpendBrand")
      .setValue(
        this.client.orgDetails.branchBidParameters
          .revenueOverAdSpendThresholdBrand
      );

    this.branchForm
      .get("branchBidAdjusterEnabled")
      .setValue(
        this.client.orgDetails.branchIntegrationParameters
          .branchBidAdjusterEnabled
      );
    this.branchForm
      .get("branchKey")
      .setValue(this.client.orgDetails.branchIntegrationParameters.branchKey);
    this.branchForm
      .get("branchSecret")
      .setValue(
        this.client.orgDetails.branchIntegrationParameters.branchSecret
      );

    // this.preferencesForm
    //   .get("emailAddresses")
    //   .setValue(this.client.orgDetails.emailAddresses);

    if (
      this.client.orgDetails.branchBidParameters.branchOptimizationGoal ===
      "revenue_over_ad_spend"
    ) {
      this.branchForm.get("cppThreshold").disable();
      this.branchForm.get("revenueOverSpend").enable();
    }

    if (
      this.client.orgDetails.branchBidParameters.branchOptimizationGoal ===
      "cost_per_purchase"
    ) {
      this.branchForm.get("cppThreshold").enable();
      this.branchForm.get("revenueOverSpend").disable();
    }
  }

  onAppleSubmit() {
    if (
      // this.preferencesForm.valid &&
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

      // campaign specific fields use one control for exact, broad, search; and one for brand
      this.client.orgDetails.bidParameters.highCPIBidDecreaseThreshExact = this.appleForm.get(
        "highCPI"
      ).value;

      this.client.orgDetails.bidParameters.highCPIBidDecreaseThreshBroad = this.appleForm.get(
        "highCPI"
      ).value;

      this.client.orgDetails.adgroupBidParameters.highCPIBidDecreaseThresh = this.appleForm.get(
        "highCPI"
      ).value;

      // brand
      this.client.orgDetails.bidParameters.highCPIBidDecreaseThreshBrand = this.appleForm.get(
        "highCPIBrand"
      ).value;

      // Branch fields
      this.client.orgDetails.branchBidParameters.branchOptimizationGoal = this.branchForm.get(
        "branchObjective"
      ).value;

      // campaign specific fields use one control for exact, broad, search; and one for brand
      this.client.orgDetails.branchBidParameters.costPerPurchaseThresholdExact = this.branchForm.get(
        "cppThreshold"
      ).value;

      this.client.orgDetails.branchBidParameters.costPerPurchaseThresholdBroad = this.branchForm.get(
        "cppThreshold"
      ).value;

      this.client.orgDetails.branchBidParameters.costPerPurchaseThresholdBrand = this.branchForm.get(
        "cppThresholdBrand"
      ).value;

      // campaign specific fields use one control for exact, broad, search; and one for brand
      this.client.orgDetails.branchBidParameters.revenueOverAdSpendThresholdExact = this.branchForm.get(
        "revenueOverSpend"
      ).value;

      this.client.orgDetails.branchBidParameters.revenueOverAdSpendThresholdBroad = this.branchForm.get(
        "revenueOverSpend"
      ).value;

      this.client.orgDetails.branchBidParameters.revenueOverAdSpendThresholdBrand = this.branchForm.get(
        "revenueOverSpendBrand"
      ).value;

      this.client.orgDetails.branchIntegrationParameters.branchBidAdjusterEnabled = this.branchForm.get(
        "branchBidAdjusterEnabled"
      ).value;

      this.client.orgDetails.branchIntegrationParameters.branchKey = this.branchForm.get(
        "branchKey"
      ).value;
      this.client.orgDetails.branchIntegrationParameters.branchSecret = this.branchForm.get(
        "branchSecret"
      ).value;

      this.clientService
        .postClient(ClientPayload.buildFromClient(this.client))
        .pipe(
          tap((_) => {
            this.isSendingResults = true;
          }),
          map((data) => {
            this.isSendingResults = false;
            this.openSnackBar("successfully updated settings!", "dismiss");
            return data;
          }),
          catchError(() => {
            this.isSendingResults = false;
            this.openSnackBar(
              "unable to process changes to settings at this time",
              "dismiss"
            );
            return [];
          })
        )
        .subscribe();
    } else {
      this.openSnackBar(
        "please double check settings, something appears to be invalid",
        "dismiss"
      );
    }
  }

  // onPreferencesSubmit() {
  //   if (
  //     this.preferencesForm.valid &&
  //     this.appleForm.valid &&
  //     this.branchForm.valid
  //   ) {
  //     this.isSendingResults = true;

  //     this.client.orgDetails.emailAddresses = _map(
  //       String(this.preferencesForm.get("emailAddresses").value).split(","),
  //       (val) => {
  //         return val.trim();
  //       }
  //     );

  //     this.clientService
  //       .postClient(ClientPayload.buildFromClient(this.client))
  //       .pipe(
  //         tap((_) => {
  //           this.isSendingResults = true;
  //         }),
  //         map((data) => {
  //           this.isSendingResults = false;
  //           this.openSnackBar("successfully updated preferences!", "dismiss");
  //           return data;
  //         }),
  //         catchError(() => {
  //           this.isSendingResults = false;
  //           this.openSnackBar(
  //             "unable to process changes to preferences or settings at this time",
  //             "dismiss"
  //           );
  //           return [];
  //         })
  //       )
  //       .subscribe();
  //   } else {
  //     this.openSnackBar(
  //       "please double check preferences and settings, something appears to be invalid",
  //       "dismiss"
  //     );
  //   }
  // }

  isBranchFormDisabled(): boolean {
    if (isNil(this.client.orgDetails)) {
      return true;
    }
    return !this.branchForm.get("branchBidAdjusterEnabled").value;
  }

  isControlDisabled(name: string): boolean {
    if (isNil(this.client.orgDetails)) {
      return true;
    }
    if (!this.branchForm.get("branchBidAdjusterEnabled").value) {
      return true;
    }

    return this.branchForm.get(name).disabled;
  }

  handleBranchCheckboxChange($event: MatCheckboxChange) {
    if ($event.checked) {
      this.branchForm.get("branchObjective").enable();
      this.branchForm.get("branchKey").enable();
      this.branchForm.get("branchSecret").enable();

      if (
        this.branchForm.get("branchObjective").value === "revenue_over_ad_spend"
      ) {
        this.branchForm.get("revenueOverSpend").enable();
      }

      if (
        this.branchForm.get("branchObjective").value === "cost_per_purchase"
      ) {
        this.branchForm.get("cppThreshold").enable();
      }
    } else {
      this.branchForm.get("cppThreshold").disable();
      this.branchForm.get("branchObjective").disable();
      this.branchForm.get("revenueOverSpend").disable();
      this.branchForm.get("branchKey").disable();
      this.branchForm.get("branchSecret").disable();
    }
  }
}
