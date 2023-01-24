import { Router } from "@angular/router";
import { Component, OnInit, ViewChild } from "@angular/core";
import { AmplifyService } from "aws-amplify-angular";
import {
  map,
  tap,
  catchError,
  filter,
  take,
  takeUntil,
  switchMap,
} from "rxjs/operators";
import { combineLatest, EMPTY, Subject } from "rxjs";
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  Validators,
} from "@angular/forms";
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
  includes,
  isEmpty,
  isEqual,
  isNil,
  map as _map,
  set,
} from "lodash";
import { ClientPayload } from "src/app/core/models/client-payload";
import { AppleService } from "src/app/core/services/apple.service";

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
    private snackBar: MatSnackBar,
    private appleService: AppleService
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

  dailyBudgetValidators = [
    Validators.required,
    Validators.min(0.1),
    Validators.max(1000),
    Validators.minLength(1),
  ];

  lifetimeBudgetValidators = [
    Validators.required,
    Validators.min(10),
    Validators.max(1000000),
    Validators.minLength(1),
  ];

  lifetimeBudgetValidatorsCompetitor = [
    Validators.required,
    Validators.min(3),
    Validators.max(300000),
    Validators.minLength(1),
  ];

  lifetimeBudgetValidatorsCategory = [
    Validators.required,
    Validators.min(3),
    Validators.max(300000),
    Validators.minLength(1),
  ];

  lifetimeBudgetValidatorsBrand = [
    Validators.required,
    Validators.min(1.5),
    Validators.max(150000),
    Validators.minLength(1),
  ];

  lifetimeBudgetValidatorsExactDiscovery = [
    Validators.required,
    Validators.min(0.5),
    Validators.max(150000),
    Validators.minLength(1),
  ];

  lifetimeBudgetValidatorsBroadDiscovery = [
    Validators.required,
    Validators.min(2),
    Validators.max(100000),
    Validators.minLength(1),
  ];

  lifetimeBudgetValidatorsSearchDiscovery = [
    Validators.required,
    Validators.min(2),
    Validators.max(100000),
    Validators.minLength(1),
  ];

  costValidators = [
    Validators.required,
    Validators.min(0.1),
    Validators.max(1000),
    Validators.minLength(1),
  ];

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

    this.orgId = this.userAccountService.orgId;

    // deprecated
    // this.orgId = this.userAccountService
    //   .getCurrentUser()
    //   .UserAttributes.find((val) => {
    //     return val.Name === "custom:org_id";
    //   }).Value;

    this.clientService
      .getClient(this.orgId)
      .pipe(
        tap(() => {
          this.appleForm.markAsPristine();
          this.branchForm.markAsPristine();
        }),
        tap((data) => {
          this.client = Client.buildFromGetClientResponse(data, this.orgId);
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
          this.client = Client.buildFromGetClientResponse(data, this.orgId);
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
        const cpi = new FormControl(undefined, [
          Validators.min(0.1),
          Validators.max(1000),
          Validators.minLength(1),
          Validators.required,
        ]);
        const objective = new FormControl();
        const bidOverrides = new FormControl();
        const lifetimeBudget = new FormControl(
          undefined,
          campaign.campaignType === "competitor"
            ? this.lifetimeBudgetValidatorsCompetitor
            : campaign.campaignType === "category"
            ? this.lifetimeBudgetValidatorsCategory
            : campaign.campaignType === "brand"
            ? this.lifetimeBudgetValidatorsBrand
            : campaign.campaignType === "exact_discovery"
            ? this.lifetimeBudgetValidatorsExactDiscovery
            : campaign.campaignType === "broad_discovery"
            ? this.lifetimeBudgetValidatorsBroadDiscovery
            : campaign.campaignType === "search_discovery"
            ? this.lifetimeBudgetValidatorsSearchDiscovery
            : this.lifetimeBudgetValidators
        );
        const dailyBudget = new FormControl(
          undefined,
          this.dailyBudgetValidators
        );
        const genders = new FormControl();
        const ages = new FormControl();
        const status = new FormControl();

        this.appleForm.addControl("cpi" + campaign.campaignId, cpi);
        this.appleForm.addControl("objective" + campaign.campaignId, objective);
        this.appleForm.addControl(
          "checkbox" + campaign.campaignId,
          bidOverrides
        );

        this.appleForm.addControl(
          "lifetimeBudget" + campaign.campaignId,
          lifetimeBudget
        );

        this.appleForm.addControl(
          "dailyBudget" + campaign.campaignId,
          dailyBudget
        );

        this.appleForm.addControl("gender" + campaign.campaignId, genders);
        this.appleForm.addControl("minAge" + campaign.campaignId, ages);
        this.appleForm.addControl("status" + campaign.campaignId, status);

        // campaign level mmp bid param overrides
        const cpp = new FormControl();
        const roas = new FormControl();
        const mmpObjective = new FormControl();
        const mmpBidOverrides = new FormControl();

        this.appleForm.addControl(
          "mmpCheckbox" + campaign.campaignId,
          mmpBidOverrides
        );
        this.appleForm.addControl("cpp" + campaign.campaignId, cpp);
        this.appleForm.addControl("roas" + campaign.campaignId, roas);
        this.appleForm.addControl(
          "mmpObjective" + campaign.campaignId,
          mmpObjective
        );

        this.appleForm
          .get("mmpObjective" + campaign.campaignId)
          .setValidators([Validators.required]);

        this.appleForm
          .get("cpp" + campaign.campaignId)
          .setValidators([
            Validators.min(0.1),
            Validators.max(1000),
            Validators.minLength(1),
            Validators.required,
          ]);

        this.appleForm
          .get("roas" + campaign.campaignId)
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
        // apple campaign values
        const dailyBudget = get(campaign, "dailyBudget");
        const budgetLifetime = get(campaign, "lifetimeBudget");
        const gender = get(campaign, "gender");
        const minAge = get(campaign, "minAge");
        const status = get(campaign, "status");

        this.appleForm
          .get("dailyBudget" + campaign.campaignId)
          .setValue(dailyBudget);
        this.appleForm
          .get("lifetimeBudget" + campaign.campaignId)
          .setValue(budgetLifetime);
        this.appleForm
          .get("gender" + campaign.campaignId)
          .setValue(
            includes(gender, ["M", "F"])
              ? "all"
              : isEqual(gender, ["M"])
              ? "male"
              : isEqual(gender, ["F"])
              ? "female"
              : "all"
          );
        this.appleForm
          .get("minAge" + campaign.campaignId)
          .setValue(isNil(minAge) ? "all" : minAge);

        this.appleForm
          .get("status" + campaign.campaignId)
          .setValue(status === "ENABLED" ? true : false);

        // bid param overrides
        const cpi = get(campaign, "bidParameters.HIGH_CPI_BID_DECREASE_THRESH");
        const objective = get(campaign, "bidParameters.OBJECTIVE");
        const bidOverrides = !isEmpty(get(campaign, "bidParameters"));

        this.appleForm.get("cpi" + campaign.campaignId).setValue(cpi);
        this.appleForm
          .get("objective" + campaign.campaignId)
          .setValue(objective);
        this.appleForm
          .get("checkbox" + campaign.campaignId)
          .setValue(bidOverrides);

        if (!bidOverrides) {
          this.appleForm.get("cpi" + campaign.campaignId).disable();
          this.appleForm.get("objective" + campaign.campaignId).disable();
        } else {
          this.appleForm.get("cpi" + campaign.campaignId).enable();
          this.appleForm.get("objective" + campaign.campaignId).enable();
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

        this.appleForm.get("cpp" + campaign.campaignId).setValue(cpp);
        this.appleForm.get("roas" + campaign.campaignId).setValue(roas);
        this.appleForm
          .get("mmpObjective" + campaign.campaignId)
          .setValue(mmpObjective);
        this.appleForm
          .get("mmpCheckbox" + campaign.campaignId)
          .setValue(mmpOverrides);

        if (!mmpOverrides) {
          this.appleForm.get("cpp" + campaign.campaignId).disable();
          this.appleForm.get("roas" + campaign.campaignId).disable();
          this.appleForm.get("mmpObjective" + campaign.campaignId).disable();
        } else {
          this.appleForm.get("mmpObjective" + campaign.campaignId).enable();
          if (mmpObjective === "revenue_over_ad_spend") {
            this.appleForm.get("roas" + campaign.campaignId).enable();
            this.appleForm.get("cpp" + campaign.campaignId).disable();
          } else {
            this.appleForm.get("roas" + campaign.campaignId).disable();
            this.appleForm.get("cpp" + campaign.campaignId).enable();
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
      this.appleForm.get("cpi" + campaign.campaignId).dirty ||
      this.appleForm.get("objective" + campaign.campaignId).dirty ||
      this.appleForm.get("checkbox" + campaign.campaignId).dirty ||
      this.appleForm.get("cpp" + campaign.campaignId).dirty ||
      this.appleForm.get("roas" + campaign.campaignId).dirty ||
      this.appleForm.get("mmpObjective" + campaign.campaignId).dirty ||
      this.appleForm.get("mmpCheckbox" + campaign.campaignId).dirty ||
      this.appleForm.get("lifetimeBudget" + campaign.campaignId).dirty ||
      this.appleForm.get("dailyBudget" + campaign.campaignId).dirty ||
      this.appleForm.get("gender" + campaign.campaignId).dirty ||
      this.appleForm.get("minAge" + campaign.campaignId).dirty ||
      this.appleForm.get("status" + campaign.campaignId).dirty
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
          // budget gender age status values
          const status = this.appleForm.get(
            "status" + campaign.campaignId
          ).value;
          const lifetimeBudget = this.appleForm.get(
            "lifetimeBudget" + campaign.campaignId
          ).value;
          const dailyBudget = this.appleForm.get(
            "dailyBudget" + campaign.campaignId
          ).value;
          const gender = this.appleForm.get(
            "gender" + campaign.campaignId
          ).value;
          const minAge = this.appleForm.get(
            "minAge" + campaign.campaignId
          ).value;

          // set the values on the campaign
          campaign.lifetimeBudget = lifetimeBudget;
          campaign.dailyBudget = dailyBudget;
          campaign.status = status === true ? "ENABLED" : "PAUSED";
          campaign.gender =
            gender === "all" ? ["M", "F"] : gender === "male" ? ["M"] : ["F"];
          campaign.minAge = minAge === "all" ? undefined : minAge;

          // get the checkbox value to see if bid params overridden
          const hasOverrides = this.appleForm.get(
            "checkbox" + campaign.campaignId
          ).value;

          if (hasOverrides) {
            const bidParameters = {};
            const cpi = this.appleForm.get("cpi" + campaign.campaignId).value;

            const objective = this.appleForm.get(
              "objective" + campaign.campaignId
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
            "mmpCheckbox" + campaign.campaignId
          ).value;

          if (hasBranchOverrides) {
            const branchBidParameters = {};

            const mmpObjective = this.appleForm.get(
              "mmpObjective" + campaign.campaignId
            ).value;

            if (mmpObjective === "revenue_over_ad_spend") {
              const roas = this.appleForm.get(
                "roas" + campaign.campaignId
              ).value;

              set(branchBidParameters, "revenue_over_ad_spend_threshold", roas);
              set(
                branchBidParameters,
                "branch_optimization_goal",
                mmpObjective
              );
            } else {
              const cpp = this.appleForm.get("cpp" + campaign.campaignId).value;
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
        .patchClient(ClientPayload.buildFromClient(this.client), true)
        .pipe(
          take(1),
          tap(() => {
            this.isSendingResults = true;
          }),
          map((data) => {
            // TODO get
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
    if (this.appleForm.pristine || this.appleForm.invalid) {
      return true;
    }

    if (this.campaignsInvalid()) {
      return true;
    }

    return false;
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
      this.appleForm.get("cpi" + campaign.campaignId).enable();
      this.appleForm.get("objective" + campaign.campaignId).enable();
    } else {
      this.appleForm.get("cpi" + campaign.campaignId).disable();
      this.appleForm.get("objective" + campaign.campaignId).disable();
    }
  }

  handleCampaignMmpCheckboxChange($event: MatCheckboxChange, campaign: any) {
    if ($event.checked) {
      this.appleForm.get("mmpObjective" + campaign.campaignId).enable();
    } else {
      this.appleForm.get("cpp" + campaign.campaignId).disable();
      this.appleForm.get("roas" + campaign.campaignId).disable();
      this.appleForm.get("mmpObjective" + campaign.campaignId).disable();
    }
  }

  handleCampaignMmpObjectiveChange($event: MatSelectChange, campaign: any) {
    if ($event.value === "revenue_over_ad_spend") {
      this.appleForm.get("cpp" + campaign.campaignId).disable();
      this.appleForm.get("roas" + campaign.campaignId).enable();
    } else {
      this.appleForm.get("cpp" + campaign.campaignId).enable();
      this.appleForm.get("roas" + campaign.campaignId).disable();
    }
  }

  dailyBudgetError(formControlName: string): string {
    const formControl: AbstractControl = this.appleForm.get(formControlName);
    if (formControl.hasError("invalidDailyBudget")) {
      return "Must be greater or equal to Target Cost Per Install";
    }
    if (formControl.invalid) {
      return "Please enter a number between 1 and 10,000";
    }
  }

  lifetimeBudgetError(campaignType: string, formControlName: string): string {
    const formControl: AbstractControl = this.appleForm.get(formControlName);
    if (formControl.hasError("invalidLifetimeBudget")) {
      return "Lifetime budget must exceed daily budget cap";
    }
    if (formControl.invalid) {
      switch (campaignType) {
        case "competitor":
          return "Please enter a number between 3 and 300,000";

        case "category":
          return "Please enter a number between 3 and 300,000";

        case "brand":
          return "Please enter a number between 1.5 and 150,000";

        case "exact_discovery":
          return "Please enter a number between 1.5 and 150,000";

        case "broad_discovery":
          return "Please enter a number between 2 and 100,000";

        case "search_discovery":
          return "Please enter a number between 2 and 100,000";
      }
    }
  }

  updateAppleCampaign() {
    this.isLoadingResults = true;
    const payload = [];
    chain(this.client.orgDetails.appleCampaigns)
      .each((campaign) => {
        // const statusCtrl =
        //   this.appleForm["controls"][`status|${campaign.campaignId}`];
        const lifetimeBudgetCtrl =
          this.appleForm["controls"][`lifetimeBudget|${campaign.campaignId}`];
        const dailyBudgetCtrl =
          this.appleForm["controls"][`dailyBudget|${campaign.campaignId}`];

        if (lifetimeBudgetCtrl.dirty || dailyBudgetCtrl.dirty) {
          payload.push({
            campaignId: campaign.campaignId,
            lifetimeBudget: lifetimeBudgetCtrl.value,
            dailyBudget: dailyBudgetCtrl.value,
          });
        }
      })
      .value();

    this.appleService
      .patchAppleCampaign(this.orgId, payload)
      .pipe(
        take(1),
        switchMap((val) => {
          return this.clientService.getClient(this.orgId).pipe(
            take(1),
            tap((val) => {
              this.isLoadingResults = false;
              this.client = Client.buildFromGetClientResponse(val, this.orgId);
              this.appleForm.markAsPristine();
              this.openSnackBar(
                "we've completed updating your campaigns! please review details and complete registration to finalize",
                ""
              );
            })
          );
        }),
        catchError(() => {
          this.isLoadingResults = false;
          this.openSnackBar(
            "unable to process changes to settings at this time",
            "dismiss"
          );
          return [];
        })
      )
      .subscribe();
  }

  campaignsInvalid(): boolean {
    const globalCpi: number =
      this.client.orgDetails.bidParameters.highCPIBidDecreaseThresh;

    if (isEmpty(this.appleForm["controls"])) {
      return true;
    }

    if (isEmpty(this.client.orgDetails.appleCampaigns)) {
      return true;
    }

    const hasInvalid = chain(this.client.orgDetails.appleCampaigns)
      .some((campaign) => {
        const lifetimeBudgetCtrl =
          this.appleForm["controls"][`lifetimeBudget${campaign.campaignId}`];
        const dailyBudgetCtrl =
          this.appleForm["controls"][`dailyBudget${campaign.campaignId}`];

        const cpiCtrl = this.appleForm["controls"][`cpi${campaign.campaignId}`];

        const lifetimeBudgetCtrlValue: number = +lifetimeBudgetCtrl.value;
        const dailyBudgetCtrlValue: number = +dailyBudgetCtrl.value;

        const localCpi: number = +cpiCtrl.value;
        console.log("local cpi");
        console.log(localCpi);

        const cpi: number =
          isNil(localCpi) || isNaN(localCpi) ? globalCpi : localCpi;

        let retVal = false;
        if (dailyBudgetCtrlValue >= lifetimeBudgetCtrlValue) {
          lifetimeBudgetCtrl.setErrors({ invalidLifetimeBudget: true });
          retVal = true;
        } else {
          lifetimeBudgetCtrl.setErrors(null);
        }

        if (cpi > dailyBudgetCtrlValue) {
          dailyBudgetCtrl.setErrors({ invalidDailyBudget: true });
          retVal = true;
        } else {
          dailyBudgetCtrl.setErrors(null);
        }

        return retVal;
      })
      .value();

    console.log("james test " + hasInvalid);

    return hasInvalid;
  }
}
