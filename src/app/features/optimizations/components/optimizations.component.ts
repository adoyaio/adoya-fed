import { Router } from "@angular/router";
import { Component, OnInit, ViewChild } from "@angular/core";
import { AmplifyService } from "aws-amplify-angular";
import { map, tap, catchError, filter, take, takeUntil } from "rxjs/operators";
import { combineLatest, EMPTY, Subject } from "rxjs";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { UserAccountService } from "src/app/core/services/user-account.service";
import { ClientService } from "src/app/core/services/client.service";
import { Client } from "../../../core/models/client";
import {
  MatAccordion,
  MatCheckboxChange,
  MatSnackBar,
} from "@angular/material";
import {
  chain,
  each as _each,
  get,
  has,
  isEmpty,
  isNil,
  map as _map,
  set,
} from "lodash";
import { ClientPayload } from "src/app/core/models/client-payload";

@Component({
  selector: "app-optimizations",
  templateUrl: "./optimizations.component.html",
  styleUrls: ["./optimizations.component.scss"],
})
export class OptimizationsComponent implements OnInit {
  @ViewChild(MatAccordion, { static: false }) accordion: MatAccordion;
  private _destroyed$: Subject<boolean> = new Subject<boolean>();

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
    branchBidAdjusterEnabled: false,
    branchKey: [""],
    branchSecret: [""],
  });

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

    this.branchForm
      .get("cppThreshold")
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

    this.amplifyService
      .authState()
      .pipe(
        tap((authState) => {
          if (!(authState.state === "signedIn")) {
            this.router.navigateByUrl("/portal");
          }
        }),
        takeUntil(this._destroyed$)
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
        tap(() => {
          this.appleForm.markAsPristine();
        }),
        tap((data: Client) => {
          this.client = Client.buildFromGetClientResponse(data);
          this.buildCampaignForm(data);
          this.setAppleFormValues();
          this.isLoadingResults = false;
        }),
        take(1),
        catchError(() => {
          this.isLoadingResults = false;
          return EMPTY;
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
            this.branchForm.get("revenueOverSpend").disable();
            this.branchForm.get("branchKey").disable();
            this.branchForm.get("branchSecret").disable();
            return;
          }

          if (objective === "revenue_over_ad_spend") {
            this.branchForm.get("cppThreshold").disable();
            this.branchForm.get("revenueOverSpend").enable();
          }
          if (objective === "cost_per_purchase") {
            this.branchForm.get("cppThreshold").enable();
            this.branchForm.get("revenueOverSpend").disable();
          }
        }),
        takeUntil(this._destroyed$)
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this._destroyed$.next(true);
  }

  getClient(): void {
    this.isLoadingResults = true;
    this.clientService
      .getClient(this.orgId)
      .pipe(
        tap(() => {
          this.appleForm.markAsPristine();
          this.branchForm.markAsPristine();
        }),
        tap((data: Client) => {
          this.client = Client.buildFromGetClientResponse(data);
          this.setAppleFormValues();
          this.isLoadingResults = false;
        }),
        take(1),
        catchError(() => {
          this.isLoadingResults = false;
          return EMPTY;
        })
      )
      .subscribe();
  }

  setAppleFormValues() {
    // client level controls
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

    if (
      !this.client.orgDetails.branchIntegrationParameters
        .branchBidAdjusterEnabled
    ) {
      this.branchForm.get("cppThreshold").disable();
      this.branchForm.get("revenueOverSpend").disable();
      this.branchForm.get("branchObjective").disable();
      this.branchForm.get("branchKey").disable();
      this.branchForm.get("branchSecret").disable();
    }

    // campaign controls
    chain(this.client)
      .get("orgDetails")
      .get("appleCampaigns")
      .each((campaign) => {
        const cpi = get(campaign.bidParameters, "HIGH_CPI_BID_DECREASE_THRESH");
        const objective = get(campaign.bidParameters, "OBJECTIVE");
        const bidOverrides = !isEmpty(get(campaign, "bidParameters"));

        this.appleForm.get("highCPI_" + campaign.campaignId).setValue(cpi);
        this.appleForm
          .get("objective_" + campaign.campaignId)
          .setValue(objective);
        this.appleForm
          .get("checkbox_" + campaign.campaignId)
          .setValue(bidOverrides);

        if (!bidOverrides) {
          this.appleForm.get("highCPI_" + campaign.campaignId).disable();
          this.appleForm.get("objective_" + campaign.campaignId).disable();
        } else {
          this.appleForm.get("highCPI_" + campaign.campaignId).enable();
          this.appleForm.get("objective_" + campaign.campaignId).enable();
        }
      })
      .value();
  }

  buildCampaignForm(data: Client) {
    chain(data)
      .get("orgDetails")
      .get("appleCampaigns")
      .each((campaign) => {
        const cpi = new FormControl();
        const objective = new FormControl();
        const bidOverrides = new FormControl();

        this.appleForm.addControl("highCPI_" + campaign.campaignId, cpi);
        this.appleForm.addControl(
          "objective_" + campaign.campaignId,
          objective
        );
        this.appleForm.addControl(
          "checkbox_" + campaign.campaignId,
          bidOverrides
        );

        this.appleForm
          .get("highCPI_" + campaign.campaignId)
          .setValidators([
            Validators.min(0.1),
            Validators.max(1000),
            Validators.minLength(1),
            Validators.required,
          ]);
      })
      .value();
  }

  hasBidParameters(campaign: any) {
    return !chain(campaign).get("bidParameters", false).isEmpty().value();
  }

  isDirty(campaign: any): boolean {
    return (
      this.appleForm.get("highCPI_" + campaign.campaignId).dirty ||
      this.appleForm.get("objective_" + campaign.campaignId).dirty ||
      this.appleForm.get("checkbox_" + campaign.campaignId).dirty
    );
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 10000,
      panelClass: "standard",
    });
  }

  onResetForm() {
    this.appleForm.markAsPristine();
    this.branchForm.markAsPristine();
    this.getClient();
  }

  onAppleSubmit() {
    if (this.appleForm.valid && this.branchForm.valid) {
      this.isSendingResults = true;

      // Update client model TODO replace with cqrs pattern
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

      // Branch fields
      this.client.orgDetails.branchBidParameters.branchOptimizationGoal = this.branchForm.get(
        "branchObjective"
      ).value;

      this.client.orgDetails.branchBidParameters.costPerPurchaseThreshold = this.branchForm.get(
        "cppThreshold"
      ).value;

      this.client.orgDetails.branchBidParameters.revenueOverAdSpendThreshold = this.branchForm.get(
        "revenueOverSpend"
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

      // build campaigns
      chain(this.client)
        .get("orgDetails")
        .get("appleCampaigns")
        .each((campaign) => {
          // get the checkbox value to see if bid params overridden
          const hasOverrides = this.appleForm.get(
            "checkbox_" + campaign.campaignId
          ).value;

          if (hasOverrides) {
            const bidParameters = {};
            const cpi = this.appleForm.get("highCPI_" + campaign.campaignId)
              .value;

            const objective = this.appleForm.get(
              "objective_" + campaign.campaignId
            ).value;

            if (!isNil(cpi)) {
              set(bidParameters, "HIGH_CPI_BID_DECREASE_THRESH", cpi);
            }

            if (!isNil(objective)) {
              set(bidParameters, "OBJECTIVE", objective);
            }

            set(campaign, "bidParameters", bidParameters);
          } else {
            set(campaign, "bidParameters", {});
          }
        })
        .value();

      this.clientService
        .postClient(ClientPayload.buildFromClient(this.client))
        .pipe(
          tap(() => {
            this.isSendingResults = true;
          }),
          map((data) => {
            this.isSendingResults = false;
            this.appleForm.markAsPristine();
            this.branchForm.markAsPristine();
            this.openSnackBar("successfully updated settings!", "dismiss");
            return data;
          }),
          take(1),
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

  appleSubmitDisabled(): boolean {
    return this.appleForm.pristine || this.appleForm.invalid;
  }

  branchSubmitDisabled(): boolean {
    return this.branchForm.pristine || this.branchForm.invalid;
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

  handleCampaignCheckboxChange($event: MatCheckboxChange, campaign: any) {
    if ($event.checked) {
      this.appleForm.get("highCPI_" + campaign.campaignId).enable();
      this.appleForm.get("objective_" + campaign.campaignId).enable();
    } else {
      this.appleForm.get("highCPI_" + campaign.campaignId).disable();
      this.appleForm.get("objective_" + campaign.campaignId).disable();
    }
  }
}
