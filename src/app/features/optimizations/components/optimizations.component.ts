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
  MatSelectChange,
  MatSnackBar,
} from "@angular/material";
import {
  chain,
  cloneDeep,
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
  @ViewChild(MatAccordion) accordion: MatAccordion;
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
    cpi: [""],
  });
  branchForm = this.fb.group({
    mmpObjective: [""],
    cpp: [""],
    roas: [""],
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
      .get("cpi")
      .setValidators([
        Validators.min(0.1),
        Validators.max(1000),
        Validators.minLength(1),
        Validators.required,
      ]);
    this.branchForm
      .get("cpp")
      .setValidators([
        Validators.min(0.1),
        Validators.max(1000),
        Validators.minLength(1),
        Validators.required,
      ]);
    this.branchForm
      .get("roas")
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
          this.branchForm.markAsPristine();
        }),
        tap((data) => {
          this.client = Client.buildFromGetClientResponse(data);
          this.buildCampaignForm(this.client);
          this.setFormValues();
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
      this.branchForm.get("mmpObjective").valueChanges,
    ])
      .pipe(
        filter(([enabled, objective]) => !isNil(enabled) && !isNil(objective)),
        tap(([enabled, objective]) => {
          if (!enabled) {
            this.branchForm.get("cpp").disable();
            this.branchForm.get("roas").disable();
            this.branchForm.get("branchKey").disable();
            this.branchForm.get("branchSecret").disable();
            return;
          }

          if (objective === "revenue_over_ad_spend") {
            this.branchForm.get("cpp").disable();
            this.branchForm.get("roas").enable();
          }
          if (objective === "cost_per_purchase") {
            this.branchForm.get("cpp").enable();
            this.branchForm.get("roas").disable();
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
        take(1),
        tap(() => {
          this.appleForm.markAsPristine();
          this.branchForm.markAsPristine();
        }),
        tap((data) => {
          this.client = Client.buildFromGetClientResponse(data);
          this.setFormValues();
          this.isLoadingResults = false;
        }),
        catchError(() => {
          this.isLoadingResults = false;
          return EMPTY;
        })
      )
      .subscribe();
  }

  buildCampaignForm(data: Client) {
    chain(data)
      .get("orgDetails")
      .get("appleCampaigns")
      .each((campaign) => {
        // campaign level bid param overrides
        const cpi = new FormControl();
        const objective = new FormControl();
        const bidOverrides = new FormControl();

        this.appleForm.addControl("cpi_" + campaign.campaignId, cpi);
        this.appleForm.addControl(
          "objective_" + campaign.campaignId,
          objective
        );
        this.appleForm.addControl(
          "checkbox_" + campaign.campaignId,
          bidOverrides
        );

        this.appleForm
          .get("cpi_" + campaign.campaignId)
          .setValidators([
            Validators.min(0.1),
            Validators.max(1000),
            Validators.minLength(1),
            Validators.required,
          ]);

        // campaign level mmp bid param overrides
        const cpp = new FormControl();
        const roas = new FormControl();
        const mmpObjective = new FormControl();
        const mmpBidOverrides = new FormControl();

        this.appleForm.addControl(
          "mmpCheckbox_" + campaign.campaignId,
          mmpBidOverrides
        );
        this.appleForm.addControl("cpp_" + campaign.campaignId, cpp);
        this.appleForm.addControl("roas_" + campaign.campaignId, roas);
        this.appleForm.addControl(
          "mmpObjective_" + campaign.campaignId,
          mmpObjective
        );

        this.appleForm
          .get("mmpObjective_" + campaign.campaignId)
          .setValidators([Validators.required]);

        this.appleForm
          .get("cpp_" + campaign.campaignId)
          .setValidators([
            Validators.min(0.1),
            Validators.max(1000),
            Validators.minLength(1),
            Validators.required,
          ]);

        this.appleForm
          .get("roas_" + campaign.campaignId)
          .setValidators([
            Validators.min(0.1),
            Validators.max(1000),
            Validators.minLength(1),
            Validators.required,
          ]);
      })
      .value();
  }

  setFormValues() {
    // client level controls
    this.appleForm
      .get("objective")
      .setValue(this.client.orgDetails.bidParameters.objective);

    this.appleForm
      .get("cpi")
      .setValue(this.client.orgDetails.bidParameters.highCPIBidDecreaseThresh);

    this.branchForm
      .get("mmpObjective")
      .setValue(
        this.client.orgDetails.branchBidParameters.branchOptimizationGoal
      );

    this.branchForm
      .get("cpp")
      .setValue(
        this.client.orgDetails.branchBidParameters.costPerPurchaseThreshold
      );

    this.branchForm
      .get("roas")
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
      this.branchForm.get("cpp").disable();
      this.branchForm.get("roas").disable();
      this.branchForm.get("mmpObjective").disable();
      this.branchForm.get("branchKey").disable();
      this.branchForm.get("branchSecret").disable();
    }

    // campaign controls
    chain(this.client)
      .get("orgDetails")
      .get("appleCampaigns")
      .each((campaign) => {
        // bid param overrides
        const cpi = get(campaign, "bidParameters.HIGH_CPI_BID_DECREASE_THRESH");
        const objective = get(campaign, "bidParameters.OBJECTIVE");
        const bidOverrides = !isEmpty(get(campaign, "bidParameters"));

        this.appleForm.get("cpi_" + campaign.campaignId).setValue(cpi);
        this.appleForm
          .get("objective_" + campaign.campaignId)
          .setValue(objective);
        this.appleForm
          .get("checkbox_" + campaign.campaignId)
          .setValue(bidOverrides);

        if (!bidOverrides) {
          this.appleForm.get("cpi_" + campaign.campaignId).disable();
          this.appleForm.get("objective_" + campaign.campaignId).disable();
        } else {
          this.appleForm.get("cpi_" + campaign.campaignId).enable();
          this.appleForm.get("objective_" + campaign.campaignId).enable();
        }

        // mmp bid param overrides
        const cpp = get(
          campaign,
          "branchBidParameters.cost_per_purchase_threshold"
        );
        const roas = get(
          campaign,
          "branchBidParameters.revenue_over_ad_spend_threshold"
        );
        const mmpObjective = get(
          campaign,
          "branchBidParameters.branch_optimization_goal"
        );
        const mmpOverrides = !isEmpty(get(campaign, "branchBidParameters"));

        this.appleForm.get("cpp_" + campaign.campaignId).setValue(cpp);
        this.appleForm.get("roas_" + campaign.campaignId).setValue(roas);
        this.appleForm
          .get("mmpObjective_" + campaign.campaignId)
          .setValue(mmpObjective);
        this.appleForm
          .get("mmpCheckbox_" + campaign.campaignId)
          .setValue(mmpOverrides);

        if (!mmpOverrides) {
          this.appleForm.get("cpp_" + campaign.campaignId).disable();
          this.appleForm.get("roas_" + campaign.campaignId).disable();
          this.appleForm.get("mmpObjective_" + campaign.campaignId).disable();
        } else {
          this.appleForm.get("mmpObjective_" + campaign.campaignId).enable();
          if (mmpObjective === "revenue_over_ad_spend") {
            this.appleForm.get("roas_" + campaign.campaignId).enable();
            this.appleForm.get("cpp_" + campaign.campaignId).disable();
          } else {
            this.appleForm.get("roas_" + campaign.campaignId).disable();
            this.appleForm.get("cpp_" + campaign.campaignId).enable();
          }
        }
      })
      .value();
  }

  hasBidParameters(campaign: any) {
    return (
      !chain(campaign).get("bidParameters", false).isEmpty().value() ||
      !chain(campaign).get("branchBidParameters", false).isEmpty().value()
    );
  }

  isCampaignDirty(campaign: any): boolean {
    return (
      this.appleForm.get("cpi_" + campaign.campaignId).dirty ||
      this.appleForm.get("objective_" + campaign.campaignId).dirty ||
      this.appleForm.get("checkbox_" + campaign.campaignId).dirty ||
      this.appleForm.get("cpp_" + campaign.campaignId).dirty ||
      this.appleForm.get("roas_" + campaign.campaignId).dirty ||
      this.appleForm.get("mmpObjective_" + campaign.campaignId).dirty ||
      this.appleForm.get("mmpCheckbox_" + campaign.campaignId).dirty
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
      this.client.orgDetails.bidParameters.objective =
        this.appleForm.get("objective").value;
      this.client.orgDetails.adgroupBidParameters.objective =
        this.appleForm.get("objective").value;

      this.client.orgDetails.bidParameters.highCPIBidDecreaseThresh =
        this.appleForm.get("cpi").value;

      this.client.orgDetails.adgroupBidParameters.highCPIBidDecreaseThresh =
        this.appleForm.get("cpi").value;

      // Branch fields
      this.client.orgDetails.branchBidParameters.branchOptimizationGoal =
        this.branchForm.get("mmpObjective").value;

      this.client.orgDetails.branchBidParameters.costPerPurchaseThreshold =
        this.branchForm.get("cpp").value;

      this.client.orgDetails.branchBidParameters.revenueOverAdSpendThreshold =
        this.branchForm.get("roas").value;

      this.client.orgDetails.branchIntegrationParameters.branchBidAdjusterEnabled =
        this.branchForm.get("branchBidAdjusterEnabled").value;

      this.client.orgDetails.branchIntegrationParameters.branchKey =
        this.branchForm.get("branchKey").value;
      this.client.orgDetails.branchIntegrationParameters.branchSecret =
        this.branchForm.get("branchSecret").value;

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
            const cpi = this.appleForm.get("cpi_" + campaign.campaignId).value;

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

          // check if there are branch bid params overrides
          const hasBranchOverrides = this.appleForm.get(
            "mmpCheckbox_" + campaign.campaignId
          ).value;

          if (hasBranchOverrides) {
            const branchBidParameters = {};

            const mmpObjective = this.appleForm.get(
              "mmpObjective_" + campaign.campaignId
            ).value;

            if (mmpObjective === "revenue_over_ad_spend") {
              const roas = this.appleForm.get(
                "roas_" + campaign.campaignId
              ).value;

              set(branchBidParameters, "revenue_over_ad_spend_threshold", roas);
              set(
                branchBidParameters,
                "branch_optimization_goal",
                mmpObjective
              );
            } else {
              const cpp = this.appleForm.get(
                "cpp_" + campaign.campaignId
              ).value;
              set(branchBidParameters, "cost_per_purchase_threshold", cpp);
              set(
                branchBidParameters,
                "branch_optimization_goal",
                mmpObjective
              );
            }
            set(campaign, "branchBidParameters", branchBidParameters);
          } else {
            set(campaign, "branchBidParameters", {});
          }
        })
        .value();

      this.clientService
        .postClient(ClientPayload.buildFromClient(this.client))
        .pipe(
          take(1),
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

  isSearchCampaign(campaign: any): boolean {
    return get(campaign, "campaignType") === "search";
  }

  isBranchFormDisabled(): boolean {
    if (isNil(this.client.orgDetails)) {
      return true;
    }
    return !this.branchForm.get("branchBidAdjusterEnabled").value;
  }

  isControlDisabled(control: string): boolean {
    return this.appleForm.get(control).disabled;
  }

  appleSubmitDisabled(): boolean {
    return this.appleForm.pristine || this.appleForm.invalid;
  }

  undoDisabled(): boolean {
    return this.appleForm.pristine && this.branchForm.pristine;
  }

  branchSubmitDisabled(): boolean {
    return this.branchForm.pristine || this.branchForm.invalid;
  }

  handleBranchCheckboxChange($event: MatCheckboxChange) {
    if ($event.checked) {
      this.branchForm.get("mmpObjective").enable();
      this.branchForm.get("branchKey").enable();
      this.branchForm.get("branchSecret").enable();

      if (
        this.branchForm.get("mmpObjective").value === "revenue_over_ad_spend"
      ) {
        this.branchForm.get("roas").enable();
      }

      if (this.branchForm.get("mmpObjective").value === "cost_per_purchase") {
        this.branchForm.get("cpp").enable();
      }
    } else {
      this.branchForm.get("cpp").disable();
      this.branchForm.get("mmpObjective").disable();
      this.branchForm.get("roas").disable();
      this.branchForm.get("branchKey").disable();
      this.branchForm.get("branchSecret").disable();
    }
  }

  handleCampaignCheckboxChange($event: MatCheckboxChange, campaign: any) {
    if ($event.checked) {
      this.appleForm.get("cpi_" + campaign.campaignId).enable();
      this.appleForm.get("objective_" + campaign.campaignId).enable();
    } else {
      this.appleForm.get("cpi_" + campaign.campaignId).disable();
      this.appleForm.get("objective_" + campaign.campaignId).disable();
    }
  }

  handleCampaignMmpCheckboxChange($event: MatCheckboxChange, campaign: any) {
    if ($event.checked) {
      this.appleForm.get("mmpObjective_" + campaign.campaignId).enable();
    } else {
      this.appleForm.get("cpp_" + campaign.campaignId).disable();
      this.appleForm.get("roas_" + campaign.campaignId).disable();
      this.appleForm.get("mmpObjective_" + campaign.campaignId).disable();
    }
  }

  handleCampaignMmpObjectiveChange($event: MatSelectChange, campaign: any) {
    if ($event.value === "revenue_over_ad_spend") {
      this.appleForm.get("cpp_" + campaign.campaignId).disable();
      this.appleForm.get("roas_" + campaign.campaignId).enable();
    } else {
      this.appleForm.get("cpp_" + campaign.campaignId).enable();
      this.appleForm.get("roas_" + campaign.campaignId).disable();
    }
  }
}
