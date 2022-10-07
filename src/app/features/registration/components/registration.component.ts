import { Component, OnInit, ViewChild } from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import {
  MatCheckboxChange,
  MatDialog,
  MatSnackBar,
  MatStepper,
} from "@angular/material";
import { Router } from "@angular/router";
import { Auth } from "aws-amplify";

import {
  chain,
  find,
  get,
  has,
  isEmpty,
  isNil,
  set,
  map as _map,
  cloneDeep,
  each,
  some,
} from "lodash";
import { combineLatest, EMPTY, of, Subject } from "rxjs";
import { catchError, switchMap, take, takeUntil, tap } from "rxjs/operators";
import { Client, OrgDetails } from "src/app/core/models/client";
import { ClientPayload } from "src/app/core/models/client-payload";
import { AppService } from "src/app/core/services/app.service";
import { AppleService } from "src/app/core/services/apple.service";
import { ClientService } from "src/app/core/services/client.service";
import { UserAccountService } from "src/app/core/services/user-account.service";
import { CustomFormValidators } from "src/app/shared/dynamic-form/validators/CustomFormValidators";
import { DynamicModalComponent } from "src/app/shared/dynamic-modal/dynamic-modal.component";
import { CampaignData } from "../model/campaign-data";

@Component({
  selector: "app-registration",
  templateUrl: "./registration.component.html",
  styleUrls: ["./registration.component.scss"],
})
export class RegistrationComponent implements OnInit {
  @ViewChild("stepper", { static: false }) private stepper: MatStepper;

  countries = [
    { name: "United States", code: "US" },
    { name: "Canada", code: "CA" },
    { name: "United Kingdom", code: "GB" },
    { name: "Australia", code: "AU" },
    { name: "New Zealand", code: "NZ" },
    { name: "Phillippines", code: "PH" },
    { name: "Ireland", code: "IE" },
    { name: "India", code: "IN" },
  ];

  // currencies = [
  //   { code: "USD", countryCode: "US" },
  //   { code: "CAD", countryCode: "CA" },
  //   { code: "GBP", countryCode: "GB" },
  //   { code: "AUD", countryCode: "AU" },
  //   { code: "NZD", countryCode: "NZ" },
  //   { code: "PHP", countryCode: "PH" },
  //   { code: "EUR", countryCode: "IE" },
  //   { code: "INR", countryCode: "IN" },
  // ];

  printViewText = AppService.termsOfService;
  currencies = [];
  apps = [];
  app: any;
  keywordsBrand: string[] = [];
  keywordsCategory: string[] = [];
  keywordsCompetitors: string[] = [];
  client: Client;
  isLoadingResults = true;
  isSendingResults;
  orgId: string;
  emailAddresses: string;
  campaigns = [];

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

  private _destroyed$: Subject<boolean> = new Subject<boolean>();

  step2: any[] = [
    {
      ordinal: 1,
      complete: false,
      active: true,
      title: "Select Application and Country",
    },
    {
      ordinal: 2,
      complete: false,
      active: false,
      title: "Objective and CPI Goals",
    },
    {
      ordinal: 3,
      complete: false,
      active: false,
      title: "Lifetime and Daily Budget",
    },
    {
      ordinal: 4,
      complete: false,
      active: false,
      title: "List Competitors and Brands",
    },
    {
      ordinal: 5,
      complete: false,
      active: false,
      title: "Genders and age groups",
    },
    {
      ordinal: 6,
      complete: true,
      active: false,
      title: "Post Install Optimizations (Optional)",
    },
  ];

  form = this.fb.group({
    step1Form: this.fb.group({
      orgId: new FormControl("", Validators.required),
      appleOrgId: new FormControl("", Validators.required),
      clientId: new FormControl("", Validators.required),
      teamId: new FormControl("", Validators.required),
      keyId: new FormControl("", Validators.required),
      // privateKey: new FormControl("", Validators.required),
    }),
    step2Form: this.fb.group(
      {
        termsControl: new FormControl(undefined, Validators.required),
        substep1: this.fb.group({
          application: new FormControl(undefined, Validators.required),
          country: new FormControl(undefined, Validators.required),
          currency: new FormControl(undefined, Validators.required),
        }),
        substep2: this.fb.group({
          objective: new FormControl(undefined, Validators.required),
          cpi: new FormControl(undefined, this.costValidators),
        }),
        substep3: this.fb.group(
          {
            dailyBudget: new FormControl(undefined, this.dailyBudgetValidators),
            lifetimeBudget: new FormControl(
              undefined,
              this.lifetimeBudgetValidators
            ),
          },
          { validators: CustomFormValidators.budgetValidator }
        ),
        substep4: this.fb.group({
          competitors: new FormControl(undefined, Validators.required),
          category: new FormControl(undefined, Validators.required),
          brand: new FormControl(undefined, Validators.required),
        }),
        substep5: this.fb.group({
          genders: new FormControl(undefined, [Validators.required]),
          ages: new FormControl(undefined, [Validators.required]),
        }),
        substep6: this.fb.group({
          mmpObjective: new FormControl(undefined, Validators.required),
          cpp: new FormControl(undefined, this.costValidators),
          roas: new FormControl(undefined, this.costValidators),
          branchBidAdjusterEnabled: new FormControl(false),
          branchKey: new FormControl(undefined, Validators.required),
          branchSecret: new FormControl(undefined, Validators.required),
        }),
      },
      { validators: CustomFormValidators.budgetCpiValidator }
    ),
    step3Form: this.fb.group({}),
  });

  get step1Form(): FormGroup {
    return this.form.get("step1Form") as FormGroup;
  }

  get step2Form(): FormGroup {
    return this.form.get("step2Form") as FormGroup;
  }

  get step3Form(): FormGroup {
    return this.form.get("step3Form") as FormGroup;
  }

  get substep1(): any {
    return this.step2Form.get("substep1");
  }
  get substep2(): any {
    return this.step2Form.get("substep2");
  }
  get substep3(): any {
    return this.step2Form.get("substep3");
  }
  get substep4(): any {
    return this.step2Form.get("substep4");
  }
  get substep5(): any {
    return this.step2Form.get("substep5");
  }
  get substep6(): any {
    return this.step2Form.get("substep6");
  }

  get cpiControl(): AbstractControl {
    return this.step2Form.get("substep2").get("cpi");
  }
  get dailyBudget(): AbstractControl {
    return this.step2Form.get("substep3").get("dailyBudget");
  }
  get lifetimeBudget(): AbstractControl {
    return this.step2Form.get("substep3").get("lifetimeBudget");
  }

  get termsControl(): AbstractControl {
    return this.step2Form.get("termsControl");
  }

  get dailyBudgetError(): string {
    if (this.dailyBudget.hasError("invalidDailyBudget")) {
      return "Daily budget cap must be 20x Target Cost Per Install";
    }
    if (this.dailyBudget.invalid) {
      return "Please enter a number between 1 and 10,000";
    }
  }

  get lifetimeBudgetError(): string {
    if (this.lifetimeBudget.hasError("invalidLifetimeBudget")) {
      return "Lifetime budget must exceed daily budget cap";
    }
    if (this.lifetimeBudget.invalid) {
      return "Please enter a number between 10 and 10,000,000";
    }
  }

  step3DailyBudgetError(formControlName: string): string {
    const formControl: AbstractControl = this.step3Form.get(formControlName);
    if (formControl.hasError("invalidDailyBudget")) {
      return "Must be greater or equal to Target Cost Per Install";
    }
    if (formControl.invalid) {
      return "Please enter a number between 1 and 10,000";
    }
  }

  step3LifetimeBudgetError(
    campaignType: string,
    formControlName: string
  ): string {
    const formControl: AbstractControl = this.step3Form.get(formControlName);
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

  get isStep3BackDisabled(): boolean {
    if (isNil(this.client) || isNil(this.client.orgDetails)) {
      return true;
    }
    return chain(this.client.orgDetails.appleCampaigns)
      .some((campaign) => {
        return campaign.status === "ENABLED";
      })
      .value();
  }

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private clientService: ClientService,
    private appleService: AppleService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private userAccountService: UserAccountService
  ) {}

  ngOnInit() {
    Auth.currentUserInfo().then((val) => {
      // this.orgId = get(val.attributes, "custom:org_id");
      this.orgId = this.userAccountService.orgId;
      this.emailAddresses = get(val.attributes, "email");
      this.clientService
        .getClient(this.orgId)
        .pipe(
          take(1),
          tap((data: any) => {
            this.client = Client.buildFromGetClientResponse(data, this.orgId);
            // check if client exists and has auth fields
            if (!isNil(this.client.orgDetails.auth)) {
              this.openSnackBar(
                "we found your apple search ads configuration! if you would like to continue, click 'next'",
                ""
              );
              this.setOrgIdValue();
              this.setStep1FormValues();
              this.setStep2FormValues();
              this.stepper.next();
            }
            this.isLoadingResults = false;
          }),
          catchError(() => {
            this.setOrgIdValue();
            this.isLoadingResults = false;
            return EMPTY;
          })
        )
        .subscribe();
    });
  }

  ngAfterViewInit() {
    this.stepper.selectionChange
      .pipe(
        tap((val) => {
          // STEP 2
          if (val.selectedIndex === 2) {
            this.openSnackBar(
              "one moment, while we gather more details about your account",
              ""
            );

            this.initializeClient();
            this.isLoadingResults = true;
            if (
              has(this.client.orgDetails, "appleCampaigns") &&
              !isEmpty(this.client.orgDetails.appleCampaigns)
            ) {
              // modal warning
              this.showWarningDialog();
            }

            // TODO move all this into the modal
            this.client.orgDetails.auth = {
              clientId: this.step1Form.get("clientId").value,
              teamId: this.step1Form.get("teamId").value,
              keyId: this.step1Form.get("keyId").value,
              //privateKey: this.step1Form.get("privateKey").value,
              privateKey:
                "MHcCAQEEIJgiDLBqbaAb8pqgK74wEY/u0uiswAZkECJFkLUayk+9oAoGCCqGSM49AwEHoUQDQgAEfsYLIIQVzyQWizAguQWR9l7ZkXijRAzgJRXGuq/Q/th1FqlsFyE7vr4xDCw53+JoJebvKBy8QbZgSWON8TohdA==",
            };

            // set values from token
            this.client.orgId = this.orgId; // NOTE this may diverge at some point from asa id
            // this.client.orgDetails.orgId = +this.orgId;
            this.client.orgDetails.orgId =
              this.step1Form.get("appleOrgId").value;
            this.client.orgDetails.emailAddresses = [this.emailAddresses];

            this.clientService
              .postClient(ClientPayload.buildFromClient(this.client), false)
              .pipe(
                take(1),
                switchMap((data) => {
                  if (isNil(data)) {
                    this.openSnackBar(
                      "unable to process changes to settings at this time",
                      "dismiss"
                    );
                    this.isLoadingResults = false;
                  }
                  return this.appleService.getAppleApps(this.orgId).pipe(
                    tap((val) => {
                      this.isLoadingResults = false;
                      if (isEmpty(val.apps.data) || isEmpty(val.acls)) {
                        this.openSnackBar(
                          "unable to process changes to settings at this time",
                          "dismiss"
                        );
                      }
                      if (!isEmpty(val.apps.data)) {
                        this.openSnackBar(
                          "we found some of your applications! please select from the dropdown to continue",
                          ""
                        );
                      }
                      this.apps = val.apps.data;
                      this.currencies = _map(val.acls, (acl) => {
                        return { code: acl.currency };
                      });
                    }),
                    catchError(() => {
                      this.isLoadingResults = false;
                      this.openSnackBar(
                        "unable to process changes to settings at this time",
                        ""
                      );
                      return [];
                    })
                  );
                  // return combineLatest([
                  //   this.appleService.getAppleApps(this.orgId),
                  //   this.appleService.getAppleAcls(this.orgId),
                  // ]).pipe(
                  //   tap(([apps, acls]) => {
                  //     this.isLoadingResults = false;

                  //     if (isEmpty(apps.data) || isEmpty(acls)) {
                  //       this.openSnackBar(
                  //         "unable to process changes to settings at this time",
                  //         "dismiss"
                  //       );
                  //     }
                  //     if (!isEmpty(apps.data)) {
                  //       this.openSnackBar(
                  //         "we found some of your applications! please select from the dropdown to continue",
                  //         ""
                  //       );
                  //     }
                  //     this.apps = apps.data;
                  //     this.currencies = _map(acls, (acl) => {
                  //       return { code: acl.currency };
                  //     });
                  //   }),
                  //   catchError(() => {
                  //     this.isLoadingResults = false;
                  //     this.openSnackBar(
                  //       "unable to process changes to settings at this time",
                  //       ""
                  //     );
                  //     return [];
                  //   })
                  // );
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
        }),
        takeUntil(this._destroyed$)
      )
      .subscribe();

    // this.substep1
    //   .get("country")
    //   .valueChanges.pipe(
    //     tap((val) => {
    //       const currency = chain(this.currencies)
    //         .find((currency) => {
    //           return currency.countryCode === val;
    //         })
    //         .get("code")
    //         .value();

    //       this.substep1.get("currency").setValue(currency);
    //     }),
    //     takeUntil(this._destroyed$)
    //   )
    //   .subscribe();

    combineLatest([
      this.substep6.get("branchBidAdjusterEnabled").valueChanges,
      this.substep6.get("mmpObjective").valueChanges,
    ])
      .pipe(
        tap(([enabled, objective]) => {
          if (!enabled) {
            this.substep6.get("cpp").disable();
            this.substep6.get("roas").disable();
            this.substep6.get("branchKey").disable();
            this.substep6.get("branchSecret").disable();
            return;
          }

          if (objective === "revenue_over_ad_spend") {
            this.substep6.get("cpp").disable();
            this.substep6.get("roas").enable();
          }
          if (objective === "cost_per_purchase") {
            this.substep6.get("cpp").enable();
            this.substep6.get("roas").disable();
          }
        }),
        takeUntil(this._destroyed$)
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this._destroyed$.next(true);
  }

  handleShowTermsClick($event) {
    $event.preventDefault();
    this.dialog
      .open(DynamicModalComponent, {
        data: {
          title: `Terms of Service`,
          content: AppService.termsOfService,
          actionYes: "Save",
          actionNo: "Cancel",
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
            this.handlePrintTerms();
          }
        })
      )
      .subscribe();
  }

  handlePrintTerms() {
    window.print();
  }

  undoStep3Changes() {
    chain(this.client.orgDetails.appleCampaigns)
      .each((campaign) => {
        this.step3Form["controls"][`status|${campaign.campaignId}`].setValue(
          campaign.status === "ENABLED" ? true : false
        ),
          this.step3Form["controls"][
            `lifetimeBudget|${campaign.campaignId}`
          ].setValue(campaign.lifetimeBudget);
        this.step3Form["controls"][
          `dailyBudget|${campaign.campaignId}`
        ].setValue(campaign.dailyBudget);
      })
      .value();
    this.step3Form.markAsPristine();
  }

  updateAppleCampaign() {
    this.isLoadingResults = true;
    const payload = [];
    chain(this.client.orgDetails.appleCampaigns)
      .each((campaign) => {
        const statusCtrl =
          this.step3Form["controls"][`status|${campaign.campaignId}`];
        const lifetimeBudgetCtrl =
          this.step3Form["controls"][`lifetimeBudget|${campaign.campaignId}`];
        const dailyBudgetCtrl =
          this.step3Form["controls"][`dailyBudget|${campaign.campaignId}`];

        if (
          statusCtrl.dirty ||
          lifetimeBudgetCtrl.dirty ||
          dailyBudgetCtrl.dirty
        ) {
          payload.push({
            campaignId: campaign.campaignId,
            status: statusCtrl.value ? "ENABLED" : "PAUSED",
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
              this.step3Form.markAsPristine();
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

  step3Invalid(): boolean {
    if (this.step3Form.invalid) {
      return true;
    }

    const cpi: number = this.substep2.get("cpi").value;

    if (isEmpty(this.step3Form["controls"])) {
      return true;
    }

    if (isEmpty(this.client.orgDetails.appleCampaigns)) {
      return true;
    }

    const hasInvalid = chain(this.client.orgDetails.appleCampaigns)
      .some((campaign) => {
        const lifetimeBudgetCtrl =
          this.step3Form["controls"][`lifetimeBudget|${campaign.campaignId}`];
        const dailyBudgetCtrl =
          this.step3Form["controls"][`dailyBudget|${campaign.campaignId}`];

        const lifetimeBudgetCtrlValue: number = +lifetimeBudgetCtrl.value;
        const dailyBudgetCtrlValue: number = +dailyBudgetCtrl.value;
        const cpi: number = +this.cpiControl.value;

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

    return hasInvalid;
  }

  initializeClient() {
    // set default KeywordAdderParameters
    this.client = new Client();
    this.client.orgDetails = new OrgDetails();
    this.client.orgDetails.keywordAdderParameters = {
      targetedKeywordTapThreshold: 2,
      negativeKeywordConversionThreshold: 0,
      broadMatchDefaultBid: 1,
      exactMatchDefaultBid: 1,
      negativeKeywordTapThreshold: 10,
      targetedKeywordConversionThreshold: 2,
    };

    // set default AdgroupBidParameters
    this.client.orgDetails.adgroupBidParameters = {
      highCPABidDecrease: 0.85,
      tapThreshold: 7,
      objective: "standard",
      lowCPIBidIncreaseThresh: 0.4,
      minBid: 0.1,
      noInstallBidDecreaseThresh: 0,
      highCPIBidDecreaseThresh: 0,
      lowCPABidBoost: 1.15,
      maxBid: 3,
      staleRaiseBidBoost: 1.025,
      staleRaiseImpresshionThresh: 0,
    };

    this.client.orgDetails.bidParameters = {
      highCPABidDecrease: 0.85,
      tapThreshold: 7,
      objective: "standard",
      minBid: 0.1,
      noInstallBidDecreaseThresh: 0,
      highCPIBidDecreaseThresh: 0,
      lowCPABidBoost: 1.15,
      maxBid: 0.35,
      staleRaiseBidBoost: 1.025,
      staleRaiseImpresshionThresh: 0,
    };

    this.client.orgDetails.branchIntegrationParameters = {
      branchBidAdjusterEnabled: false,
      branchKey: "",
      branchSecret: "",
    };

    this.client.orgDetails.branchBidParameters = {
      branchBidAdjustment: 0.1,
      branchOptimizationGoal: "cost_per_purchase",
      minAppleInstalls: 15,
      branchMinBid: 0.1,
      branchMaxBid: 25,
      revenueOverAdSpendThreshold: 1,
      revenueOverAdSpendThresholdBuffer: 0.2,
      costPerPurchaseThreshold: 20,
      costPerPurchaseThresholdBuffer: 0.2,
    };

    this.client.orgDetails.disabled = false;
    this.client.orgDetails.appleCampaigns = [];

    // disable branch controls by defuault
    this.substep6.get("cpp").disable();
    this.substep6.get("mmpObjective").disable();
    this.substep6.get("roas").disable();
    this.substep6.get("branchKey").disable();
    this.substep6.get("branchSecret").disable();
  }

  handleBranchCheckboxChange($event: MatCheckboxChange) {
    if ($event.checked) {
      this.substep6.get("mmpObjective").enable();
      this.substep6.get("branchKey").enable();
      this.substep6.get("branchSecret").enable();

      if (this.substep6.get("mmpObjective").value === "revenue_over_ad_spend") {
        this.substep6.get("roas").enable();
      }

      if (this.substep6.get("mmpObjective").value === "cost_per_purchase") {
        this.substep6.get("cpp").enable();
      }
    } else {
      this.substep6.get("cpp").disable();
      this.substep6.get("mmpObjective").disable();
      this.substep6.get("roas").disable();
      this.substep6.get("branchKey").disable();
      this.substep6.get("branchSecret").disable();
    }
  }

  // DEPRECATED MIGRATE TO COGNITO ID
  setOrgIdValue(): void {
    this.step1Form.get("orgId").setValue(this.orgId);
    this.step1Form
      .get("appleOrgId")
      .setValue(get(this.client, "orgDetails.orgId"));
  }

  setStep1FormValues() {
    this.step1Form
      .get("clientId")
      .setValue(this.client.orgDetails.auth.clientId);
    this.step1Form.get("teamId").setValue(this.client.orgDetails.auth.teamId);
    this.step1Form.get("keyId").setValue(this.client.orgDetails.auth.keyId);
    // this.step1Form
    //   .get("privateKey")
    //   .setValue(this.client.orgDetails.auth.privateKey);
  }

  setStep2FormValues() {
    // client level controls
    this.substep2
      .get("objective")
      .setValue(this.client.orgDetails.bidParameters.objective);

    this.substep2
      .get("cpi")
      .setValue(this.client.orgDetails.bidParameters.highCPIBidDecreaseThresh);

    this.substep6
      .get("mmpObjective")
      .setValue(
        this.client.orgDetails.branchBidParameters.branchOptimizationGoal
      );

    this.substep6
      .get("cpp")
      .setValue(
        this.client.orgDetails.branchBidParameters.costPerPurchaseThreshold
      );

    this.substep6
      .get("roas")
      .setValue(
        this.client.orgDetails.branchBidParameters.revenueOverAdSpendThreshold
      );

    this.substep6
      .get("branchBidAdjusterEnabled")
      .setValue(
        this.client.orgDetails.branchIntegrationParameters
          .branchBidAdjusterEnabled
      );

    this.substep6
      .get("branchKey")
      .setValue(this.client.orgDetails.branchIntegrationParameters.branchKey);

    this.substep6
      .get("branchSecret")
      .setValue(
        this.client.orgDetails.branchIntegrationParameters.branchSecret
      );

    if (
      isNil(
        this.client.orgDetails.branchIntegrationParameters
          .branchBidAdjusterEnabled
      ) ||
      isNil(this.client.orgDetails.branchIntegrationParameters)
    ) {
      this.substep6.get("cpp").disable();
      this.substep6.get("roas").disable();
      this.substep6.get("mmpObjective").disable();
      this.substep6.get("branchKey").disable();
      this.substep6.get("branchSecret").disable();
    }
  }

  isOrdinalActive(ordinal: number): boolean {
    const step = find(this.step2, (step) => step.ordinal === ordinal);
    return get(step, "active", false);
  }

  submitStep(ordinal: number) {
    const step = find(this.step2, (step) => step.ordinal === ordinal);
    set(step, "complete", true);
    set(step, "active", false);

    const nextStep = find(this.step2, (step) => step.ordinal === ordinal + 1);
    set(nextStep, "complete", false);
    set(nextStep, "active", true);
  }

  complete() {
    this.isLoadingResults = true;
    this.clientService
      .getClient(this.orgId)
      .pipe(
        take(1),
        switchMap((val) => {
          const client = Client.buildFromGetClientResponse(val, this.orgId);
          client.orgDetails.hasRegistered = true;
          return this.clientService
            .postClient(ClientPayload.buildFromClient(client), false)
            .pipe(
              take(1),
              tap(() => {
                // this.isLoadingResults = false;
                this.router.navigateByUrl("/workbench");
              }),
              catchError(() => {
                this.isLoadingResults = false;
                this.openSnackBar(
                  "unable to process changes to settings at this time",
                  "dismiss"
                );
                return [];
              })
            );
        })
      )
      .subscribe();
  }

  goBack(ordinal: number) {
    const step = find(this.step2, (step) => step.ordinal === ordinal);
    set(step, "complete", true);
    set(step, "active", false);

    const prevStep = find(this.step2, (step) => step.ordinal === ordinal - 1);
    set(prevStep, "complete", false);
    set(prevStep, "active", true);
  }

  substepDisabled(): boolean {
    const activeSubstep = find(this.step2, (step) => step.active === true);

    if (activeSubstep.ordinal === 1) {
      return this.step2Form.get("substep1").invalid;
    }

    if (activeSubstep.ordinal === 2) {
      return this.step2Form.get("substep2").invalid;
    }

    if (activeSubstep.ordinal === 3) {
      return this.step2Form.get("substep3").invalid;
    }

    if (activeSubstep.ordinal === 4) {
      return (
        this.step2Form.get("substep4").invalid ||
        isEmpty(this.keywordsBrand) ||
        isEmpty(this.keywordsCompetitors) ||
        isEmpty(this.keywordsCategory)
      );
    }

    if (activeSubstep.ordinal === 5) {
      return this.step2Form.get("substep5").invalid;
    }

    if (activeSubstep.ordinal === 6) {
      return this.step2Form.get("substep6").invalid;
    }

    return false;
  }

  handleTooltipClick($event, field: string) {
    $event.preventDefault();
    this.dialog
      .open(DynamicModalComponent, {
        data: {
          title: `Locate your ${field}`,
          content: "Content",
        },
        maxWidth: "500px",
        width: "500px",
        panelClass: "tooltip-dialog-box",
        autoFocus: false,
      })
      .afterClosed()
      .subscribe();
  }

  showWarningDialog() {
    this.dialog
      .open(DynamicModalComponent, {
        data: {
          title: `Warning`,
          content:
            "You are attempting to re-register an existing account, clicking Yes below will delete any existing campaigns. Would you like to proceed?",
          actionYes: "Yes, continue and delete existing campaigns",
          actionNo: "No! Take me back to my dashboard",
        },
        maxWidth: "500px",
        width: "500px",
        panelClass: "tooltip-dialog-box",
        autoFocus: false,
      })
      .afterClosed()
      .subscribe();
  }

  handleOpenConsole($event) {
    $event.preventDefault();
    window.open(
      "https://app.searchads.apple.com/cm/app/settings/users/invite",
      "_blank"
    );
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 15000,
      panelClass: "standard",
    });
  }

  openIndefiniteSnackBar(message: string, action?: string) {
    this.snackBar.open(message, action, {
      panelClass: "standard",
    });
  }

  handleAddKeywords($event, type: string) {
    $event.preventDefault();
    const keywords: string = this.substep4.get(`${type}`).value;

    switch (type) {
      case "brand":
        this.keywordsBrand = keywords
          .split(",")
          .map((keyword) => keyword.trim().replace(".", "").replace(",", ""));
        break;

      case "category":
        this.keywordsCategory = keywords
          .split(",")
          .map((keyword) => keyword.trim().replace(".", "").replace(",", ""));
        break;

      case "competitors":
        this.keywordsCompetitors = keywords
          .split(",")
          .map((keyword) => keyword.trim().replace(".", "").replace(",", ""));
        break;
    }
  }

  handleRemoveKeywords(type: string, removed: string) {
    let newValue;
    switch (type) {
      case "brand":
        chain(this.keywordsBrand)
          .remove((keyword) => keyword == removed)
          .value();

        newValue = this.keywordsBrand;
        break;

      case "category":
        chain(this.keywordsCategory)
          .remove((keyword) => keyword == removed)
          .value();

        newValue = this.keywordsCategory;
        break;

      case "competitors":
        chain(this.keywordsCompetitors)
          .remove((keyword) => keyword == removed)
          .value();

        newValue = this.keywordsCompetitors;
        break;
    }

    this.substep4.get(`${type}`).setValue(newValue);
  }

  completeStep2() {
    this.dialog
      .open(DynamicModalComponent, {
        data: {
          title: `Terms of Service`,
          content: AppService.termsOfService,
          actionYes: "Agree",
          actionNo: "Cancel",
        },
        maxWidth: "500px",
        width: "500px",
        panelClass: "tooltip-dialog-box",
        autoFocus: false,
      })
      .afterClosed()
      .pipe(
        take(1),
        switchMap((val) => {
          if (val) {
            this.openSnackBar(
              "one moment, while we save your campaign configuration",
              ""
            );
            this.termsControl.setValue(true);
            this.isLoadingResults = true;
            return this.clientService.getClient(this.orgId).pipe(
              take(1),
              switchMap((val) => {
                // for adoya
                const client = Client.buildFromGetClientResponse(
                  val,
                  this.orgId
                );

                client.orgDetails.bidParameters.objective =
                  this.substep2.get("objective").value;

                client.orgDetails.adgroupBidParameters.objective =
                  this.substep2.get("objective").value;

                client.orgDetails.bidParameters.highCPIBidDecreaseThresh =
                  this.substep2.get("cpi").value;

                client.orgDetails.adgroupBidParameters.highCPIBidDecreaseThresh =
                  this.substep2.get("cpi").value;

                // branch fields
                if (!isNil(this.substep6.get("mmpObjective").value)) {
                  client.orgDetails.branchBidParameters.branchOptimizationGoal =
                    this.substep6.get("mmpObjective").value;
                }

                if (!isNil(this.substep6.get("cpp").value)) {
                  client.orgDetails.branchBidParameters.costPerPurchaseThreshold =
                    this.substep6.get("cpp").value;
                }

                if (!isNil(this.substep6.get("roas").value)) {
                  client.orgDetails.branchBidParameters.revenueOverAdSpendThreshold =
                    this.substep6.get("roas").value;
                }

                client.orgDetails.branchIntegrationParameters.branchBidAdjusterEnabled =
                  this.substep6.get("branchBidAdjusterEnabled").value;

                if (!isNil(this.substep6.get("branchKey").value)) {
                  client.orgDetails.branchIntegrationParameters.branchKey =
                    this.substep6.get("branchKey").value;
                }

                if (!isNil(this.substep6.get("branchSecret").value)) {
                  client.orgDetails.branchIntegrationParameters.branchSecret =
                    this.substep6.get("branchSecret").value;
                }

                // write the substep 1 values to client
                client.orgDetails.appID =
                  this.substep1.get("application").value;

                this.app = chain(this.apps)
                  .find((app) => {
                    return (
                      app.adamId === this.substep1.get("application").value
                    );
                  })
                  .value();

                client.orgDetails.appName = get(this.app, "appName");
                client.orgDetails.appID = get(this.app, "appID");
                client.orgDetails.clientName = get(this.app, "developerName");

                client.orgDetails.currency =
                  this.substep1.get("currency").value;

                // for apple
                const campaignData = new CampaignData();
                // campaignData.org_id = this.orgId;
                campaignData.org_id = client.orgDetails.orgId.toString();
                campaignData.app_name = get(this.app, "appName");
                campaignData.adam_id = get(this.app, "adamId");
                campaignData.campaign_target_country =
                  this.substep1.get("country").value;
                campaignData.lifetime_budget =
                  this.substep3.get("lifetimeBudget").value;
                campaignData.daily_budget =
                  this.substep3.get("dailyBudget").value;
                campaignData.objective = this.substep2.get("objective").value;
                campaignData.target_cost_per_install =
                  this.substep2.get("cpi").value;
                campaignData.gender = this.substep5.get("genders").value;
                campaignData.min_age = this.substep5.get("ages").value;
                campaignData.currency = this.substep1.get("currency").value;
                campaignData.targeted_keywords_competitor =
                  this.keywordsCompetitors;
                campaignData.targeted_keywords_category = this.keywordsCategory;
                campaignData.targeted_keywords_brand = this.keywordsBrand;

                // get auth
                return this.appleService.getAppleAuth(this.orgId).pipe(
                  take(1),
                  switchMap((val) => {
                    this.openIndefiniteSnackBar(
                      "creating apple search ads campaigns, this may take a few minutes! please don't refresh your browser during this time!",
                      ""
                    );
                    // set auth
                    set(campaignData, "authToken", val);

                    // run one api call for each of the campaign types
                    // competitor, category, brand, exact_discovery, broad_discovery, search_discovery
                    const competitorData = cloneDeep(campaignData);
                    set(competitorData, "campaignType", "competitor");

                    return this.appleService
                      .postAppleCampaign(this.orgId, competitorData)
                      .pipe(
                        take(1),
                        tap((val) => {
                          const statusControl = `status|${val.campaign.campaignId}`;

                          this.step3Form.addControl(
                            statusControl,
                            new FormControl(
                              val.campaign.status === "ENABLED" ? true : false
                            )
                          );

                          const lifetimeBudgetControl = `lifetimeBudget|${val.campaign.campaignId}`;
                          this.step3Form.addControl(
                            lifetimeBudgetControl,
                            new FormControl(
                              val.campaign.lifetimeBudget,
                              this.lifetimeBudgetValidatorsCompetitor
                            )
                          );

                          const dailyBudgetControl = `dailyBudget|${val.campaign.campaignId}`;
                          this.step3Form.addControl(
                            dailyBudgetControl,
                            new FormControl(
                              val.campaign.dailyBudget,
                              this.dailyBudgetValidators
                            )
                          );
                          this.campaigns.push(val.campaign);
                        }),
                        // category
                        switchMap(() => {
                          const categoryData = cloneDeep(campaignData);
                          set(categoryData, "campaignType", "category");
                          return this.appleService
                            .postAppleCampaign(this.orgId, categoryData)
                            .pipe(
                              take(1),
                              tap((val) => {
                                // set the forms for this campaign
                                const statusControl = `status|${val.campaign.campaignId}`;
                                this.step3Form.addControl(
                                  statusControl,
                                  new FormControl(
                                    val.campaign.status === "ENABLED"
                                      ? true
                                      : false
                                  )
                                );

                                const lifetimeBudgetControl = `lifetimeBudget|${val.campaign.campaignId}`;
                                this.step3Form.addControl(
                                  lifetimeBudgetControl,
                                  new FormControl(
                                    val.campaign.lifetimeBudget,
                                    this.lifetimeBudgetValidatorsCategory
                                  )
                                );

                                const dailyBudgetControl = `dailyBudget|${val.campaign.campaignId}`;
                                this.step3Form.addControl(
                                  dailyBudgetControl,
                                  new FormControl(
                                    val.campaign.dailyBudget,
                                    this.dailyBudgetValidators
                                  )
                                );

                                this.campaigns.push(val.campaign);
                              }),

                              // brand
                              switchMap(() => {
                                const brandData = cloneDeep(campaignData);
                                set(brandData, "campaignType", "brand");
                                return this.appleService
                                  .postAppleCampaign(this.orgId, brandData)
                                  .pipe(
                                    take(1),
                                    tap((val) => {
                                      const statusControl = `status|${val.campaign.campaignId}`;
                                      this.step3Form.addControl(
                                        statusControl,
                                        new FormControl(
                                          val.campaign.status === "ENABLED"
                                            ? true
                                            : false
                                        )
                                      );

                                      const lifetimeBudgetControl = `lifetimeBudget|${val.campaign.campaignId}`;
                                      this.step3Form.addControl(
                                        lifetimeBudgetControl,
                                        new FormControl(
                                          val.campaign.lifetimeBudget,
                                          this.lifetimeBudgetValidatorsBrand
                                        )
                                      );

                                      const dailyBudgetControl = `dailyBudget|${val.campaign.campaignId}`;
                                      this.step3Form.addControl(
                                        dailyBudgetControl,
                                        new FormControl(
                                          val.campaign.dailyBudget,
                                          this.dailyBudgetValidators
                                        )
                                      );
                                      this.campaigns.push(val.campaign);
                                    }),

                                    // exact discover
                                    switchMap(() => {
                                      const exactDiscoveryData =
                                        cloneDeep(campaignData);
                                      set(
                                        exactDiscoveryData,
                                        "campaignType",
                                        "exact_discovery"
                                      );
                                      return this.appleService
                                        .postAppleCampaign(
                                          this.orgId,
                                          exactDiscoveryData
                                        )
                                        .pipe(
                                          take(1),
                                          tap((val) => {
                                            const statusControl = `status|${val.campaign.campaignId}`;
                                            this.step3Form.addControl(
                                              statusControl,
                                              new FormControl(
                                                val.campaign.status ===
                                                "ENABLED"
                                                  ? true
                                                  : false
                                              )
                                            );

                                            const lifetimeBudgetControl = `lifetimeBudget|${val.campaign.campaignId}`;
                                            this.step3Form.addControl(
                                              lifetimeBudgetControl,
                                              new FormControl(
                                                val.campaign.lifetimeBudget,
                                                this.lifetimeBudgetValidatorsExactDiscovery
                                              )
                                            );

                                            const dailyBudgetControl = `dailyBudget|${val.campaign.campaignId}`;
                                            this.step3Form.addControl(
                                              dailyBudgetControl,
                                              new FormControl(
                                                val.campaign.dailyBudget,
                                                this.dailyBudgetValidators
                                              )
                                            );
                                            this.campaigns.push(val.campaign);
                                          }),

                                          // broad discovery
                                          switchMap(() => {
                                            const broadDiscoveryData =
                                              cloneDeep(campaignData);
                                            set(
                                              broadDiscoveryData,
                                              "campaignType",
                                              "broad_discovery"
                                            );
                                            return this.appleService
                                              .postAppleCampaign(
                                                this.orgId,
                                                broadDiscoveryData
                                              )
                                              .pipe(
                                                take(1),
                                                tap((val) => {
                                                  const statusControl = `status|${val.campaign.campaignId}`;
                                                  this.step3Form.addControl(
                                                    statusControl,
                                                    new FormControl(
                                                      val.campaign.status ===
                                                      "ENABLED"
                                                        ? true
                                                        : false
                                                    )
                                                  );

                                                  const lifetimeBudgetControl = `lifetimeBudget|${val.campaign.campaignId}`;
                                                  this.step3Form.addControl(
                                                    lifetimeBudgetControl,
                                                    new FormControl(
                                                      val.campaign.lifetimeBudget,
                                                      this.lifetimeBudgetValidatorsBroadDiscovery
                                                    )
                                                  );

                                                  const dailyBudgetControl = `dailyBudget|${val.campaign.campaignId}`;
                                                  this.step3Form.addControl(
                                                    dailyBudgetControl,
                                                    new FormControl(
                                                      val.campaign.dailyBudget,
                                                      this.dailyBudgetValidators
                                                    )
                                                  );
                                                  this.campaigns.push(
                                                    val.campaign
                                                  );
                                                }),

                                                // search discovery
                                                switchMap(() => {
                                                  const searchDiscoveryData =
                                                    cloneDeep(campaignData);
                                                  set(
                                                    searchDiscoveryData,
                                                    "campaignType",
                                                    "search_discovery"
                                                  );
                                                  return this.appleService
                                                    .postAppleCampaign(
                                                      this.orgId,
                                                      searchDiscoveryData
                                                    )
                                                    .pipe(
                                                      take(1),
                                                      tap((val) => {
                                                        const statusControl = `status|${val.campaign.campaignId}`;
                                                        this.step3Form.addControl(
                                                          statusControl,
                                                          new FormControl(
                                                            val.campaign
                                                              .status ===
                                                            "ENABLED"
                                                              ? true
                                                              : false
                                                          )
                                                        );

                                                        const lifetimeBudgetControl = `lifetimeBudget|${val.campaign.campaignId}`;
                                                        this.step3Form.addControl(
                                                          lifetimeBudgetControl,
                                                          new FormControl(
                                                            val.campaign.lifetimeBudget,
                                                            this.lifetimeBudgetValidatorsSearchDiscovery
                                                          )
                                                        );

                                                        const dailyBudgetControl = `dailyBudget|${val.campaign.campaignId}`;
                                                        this.step3Form.addControl(
                                                          dailyBudgetControl,
                                                          new FormControl(
                                                            val.campaign.dailyBudget,
                                                            this.dailyBudgetValidators
                                                          )
                                                        );
                                                        this.campaigns.push(
                                                          val.campaign
                                                        );
                                                      }),
                                                      switchMap(() => {
                                                        set(
                                                          client,
                                                          "orgDetails.appleCampaigns",
                                                          this.campaigns
                                                        );
                                                        return this.clientService
                                                          .postClient(
                                                            ClientPayload.buildFromClient(
                                                              client
                                                            ),
                                                            false
                                                          )
                                                          .pipe(
                                                            take(1),
                                                            tap(() => {
                                                              this.client =
                                                                client;
                                                              this.isLoadingResults =
                                                                false;
                                                              this.openSnackBar(
                                                                "we've completed creating your campaigns! please review details and complete registration to finalize",
                                                                ""
                                                              );
                                                              this.stepper.next();
                                                            })
                                                          );
                                                      })
                                                    );
                                                })
                                              );
                                          })
                                        );
                                    })
                                  );
                              })
                            );
                        })
                      );
                  })
                );

                // post to apple service for campaign creation
                // return this.appleService.postAppleCampaign(this.orgId, campaignData).pipe(
                //   take(1),
                //   switchMap((val) => {
                //       set(client, 'orgDetails.appleCampaigns', get(val, 'campaigns', []));
                //        // post to client service for clients json
                //       return this.clientService.postClient(ClientPayload.buildFromClient(client)).pipe(
                //         take(1),
                //         tap(() => {
                //           this.client = client;
                //           this.isLoadingResults = false;
                //           this.openSnackBar("we completed creating your campaigns! please review details and complete registration to finalize", "")
                //         })
                //       )
                //   })
                // )
              }),
              catchError(() => {
                this.isLoadingResults = false;
                this.openSnackBar(
                  "unable to process changes to settings at this time",
                  "dismiss"
                );
                this.stepper.previous();
                return [];
              })
            );
          } else {
            this.resetStep2();
          }
        })
      )
      .subscribe();
  }

  resetStep2() {
    chain(this.step2)
      .each((substep) => {
        set(substep, "complete", false);
        set(substep, "active", false);
        if (substep.ordinal === 1) {
          set(substep, "active", true);
        }
      })
      .value();

    setTimeout(() => {
      this.stepper.previous();
    }, 500);
  }
}
