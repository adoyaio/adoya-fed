import { Component, OnInit, ViewChild } from "@angular/core";
import {
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

import { chain, delay, find, get, has, isEmpty, isNil, set } from "lodash";
import { combineLatest, EMPTY, of, Subject } from "rxjs";
import {
  catchError,
  finalize,
  switchMap,
  take,
  takeUntil,
  tap,
} from "rxjs/operators";
import { Client, OrgDetails } from "src/app/core/models/client";
import { ClientPayload } from "src/app/core/models/client-payload";
import { ClientService } from "src/app/core/services/client.service";
import { UserAccountService } from "src/app/core/services/user-account.service";
import { CustomFormValidators } from "src/app/shared/dynamic-form/validators/CustomFormValidators";
import { DynamicModalComponent } from "src/app/shared/dynamic-modal/dynamic-modal.component";

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

  currencies = [
    { code: "USD", countryCode: "US" },
    { code: "CAD", countryCode: "CA" },
    { code: "GBP", countryCode: "GB" },
    { code: "AUD", countryCode: "AU" },
    { code: "NZD", countryCode: "NZ" },
    { code: "PHP", countryCode: "PH" },
    { code: "EUR", countryCode: "IE" },
    { code: "INR", countryCode: "IN" },
  ];

  apps = [];
  campaigns = [
    "Acme - US - Discovery - Broad Match",
    "Acme - US - Discovery - Exact Match",
    "Acme - US - Discovery - Search Match",
    "Acme - US - Competitor - Exact Match",
    "Acme - US - Non-Brand - Exact Match",
    "Acme - US - Brand - Exact Match",
  ]; // TODO load from api

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
  // get application(): any {
  //   return this.step2Form.get("substep1.application");
  // }

  // get country(): any {
  //   return this.step2Form.get("substep1.country");
  // }

  private _destroyed$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private clientService: ClientService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  step1Form = this.fb.group({
    orgId: new FormControl("", Validators.required),
    clientId: new FormControl("", Validators.required),
    teamId: new FormControl("", Validators.required),
    keyId: new FormControl("", Validators.required),
    privateKey: new FormControl("", Validators.required),
  });

  step2Form = this.fb.group({
    substep1: this.fb.group({
      application: new FormControl(undefined, Validators.required),
      country: new FormControl(undefined, Validators.required),
      currency: new FormControl(undefined, Validators.required),
    }),
    substep2: this.fb.group({
      objective: new FormControl(undefined, Validators.required),
      cpi: new FormControl(undefined, [
        Validators.required,
        Validators.min(0.1),
        Validators.max(1000),
        Validators.minLength(1),
      ]),
    }),
    substep3: this.fb.group(
      {
        dailyBudget: new FormControl(undefined, [
          Validators.required,
          Validators.min(1),
          Validators.max(10000),
          Validators.minLength(1),
        ]),
        lifetimeBudget: new FormControl(undefined, [
          Validators.required,
          Validators.min(10),
          Validators.max(1000000),
          Validators.minLength(1),
        ]),
      },
      { validators: CustomFormValidators.budgetValidator }
    ),
    substep4: this.fb.group({
      competitors: new FormControl(undefined, Validators.required),
      phrases: new FormControl(undefined, Validators.required),
      brand: new FormControl(undefined, Validators.required),
    }),
    substep5: this.fb.group({
      genders: new FormControl(undefined, [Validators.required]),
      ages: new FormControl(undefined, [Validators.required]),
    }),
    substep6: this.fb.group({
      mmpObjective: new FormControl(undefined, Validators.required),
      cpp: new FormControl(undefined, [
        Validators.required,
        Validators.min(0.1),
        Validators.max(1000),
        Validators.minLength(1),
      ]),
      roas: new FormControl(undefined, [
        Validators.required,
        Validators.min(0.1),
        Validators.max(1000),
        Validators.minLength(1),
      ]),
      branchBidAdjusterEnabled: new FormControl(false),
      branchKey: new FormControl(undefined, Validators.required),
      branchSecret: new FormControl(undefined, Validators.required),
    }),
  });

  client: Client;
  isLoadingResults = true;
  isSendingResults;
  orgId: string;
  emailAddresses: string;

  ngOnInit() {
    // this.initializeClient();
    Auth.currentUserInfo().then((val) => {
      this.orgId = get(val.attributes, "custom:org_id");
      this.emailAddresses = get(val.attributes, "email");
      this.clientService
        .getClient(this.orgId)
        .pipe(
          take(1),
          tap((data: Client) => {
            this.client = Client.buildFromGetClientResponse(data);
            // check if client exists and has auth fields
            if (!isNil(this.client.orgDetails.auth)) {
              this.setOrgIdValue();
              this.setStep1FormValues();
              this.setStep2FormValues();
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
          // STEP 1
          if (val.selectedIndex === 1) {
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
              privateKey: this.step1Form.get("privateKey").value,
            };

            // set values from token
            this.client.orgId = +this.orgId; // NOTE this may diverge at some point from asa id
            this.client.orgDetails.orgId = +this.orgId;
            this.client.orgDetails.emailAddresses = [this.emailAddresses];

            this.clientService
              .postClient(ClientPayload.buildFromClient(this.client))
              .pipe(
                take(1),
                switchMap((data) => {
                  if (isNil(data)) {
                    this.openSnackBar(
                      "unable to process changes to settings at this time",
                      "dismiss"
                    );
                    this.isLoadingResults = false;
                    return;
                  }
                  return this.clientService.getAppleCampaigns(this.orgId).pipe(
                    take(1),
                    tap((val) => {
                      this.apps = val.data;
                      if (!isEmpty(val.data)) {
                        this.openSnackBar(
                          "we found some of your applications, please select one from the dropdown to continue",
                          "dismiss"
                        );
                      }
                    }),
                    finalize(() => {
                      this.isLoadingResults = false;
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

          // STEP 2
          if (val.selectedIndex === 2) {
            this.isLoadingResults = true;
            this.clientService
              .getClient(this.orgId)
              .pipe(
                take(1),
                switchMap((val) => {
                  const client = Client.buildFromGetClientResponse(val);

                  client.orgDetails.bidParameters.objective =
                    this.substep2.get("objective").value;

                  client.orgDetails.adgroupBidParameters.objective =
                    this.substep2.get("objective").value;

                  client.orgDetails.bidParameters.highCPIBidDecreaseThresh =
                    this.substep2.get("cpi").value;

                  client.orgDetails.adgroupBidParameters.highCPIBidDecreaseThresh =
                    this.substep2.get("cpi").value;

                  // Branch fields
                  client.orgDetails.branchBidParameters.branchOptimizationGoal =
                    this.substep6.get("mmpObjective").value;

                  client.orgDetails.branchBidParameters.costPerPurchaseThreshold =
                    this.substep6.get("cpp").value;

                  client.orgDetails.branchBidParameters.revenueOverAdSpendThreshold =
                    this.substep6.get("roas").value;

                  client.orgDetails.branchIntegrationParameters.branchBidAdjusterEnabled =
                    this.substep6.get("branchBidAdjusterEnabled").value;

                  client.orgDetails.branchIntegrationParameters.branchKey =
                    this.substep6.get("branchKey").value;

                  client.orgDetails.branchIntegrationParameters.branchSecret =
                    this.substep6.get("branchSecret").value;

                  // write the substep 1 values to client
                  client.orgDetails.appID =
                    this.substep1.get("application").value;

                  const app = chain(this.apps)
                    .find((app) => {
                      return app.adamId === this.client.orgDetails.appID;
                    })
                    .value();

                  client.orgDetails.appName = get(app, "appName");
                  client.orgDetails.clientName = get(app, "developerName");

                  client.orgDetails.currency =
                    this.substep1.get("currency").value;

                  return this.clientService
                    .postClient(ClientPayload.buildFromClient(client))
                    .pipe(
                      take(1),
                      tap(() => {
                        this.isLoadingResults = false;
                      }),
                      catchError(() => {
                        this.isSendingResults = false;
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
        }),
        takeUntil(this._destroyed$)
      )
      .subscribe();

    this.substep1
      .get("country")
      .valueChanges.pipe(
        tap((val) => {
          const currency = chain(this.currencies)
            .find((currency) => {
              return currency.countryCode === val;
            })
            .get("code")
            .value();

          this.substep1.get("currency").setValue(currency);
        }),
        takeUntil(this._destroyed$)
      )
      .subscribe();

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
      lowCPIBidIncreaseThresh: 0.4,
      objective: undefined,
      minBid: 0.1,
      noInstallBidDecreaseThresh: 0,
      highCPIBidDecreaseThresh: undefined,
      lowCPABidBoost: 1.15,
      maxBid: 3,
      staleRaiseBidBoost: 1.025,
      staleRaiseImpresshionThresh: 0,
    };

    this.client.orgDetails.bidParameters = {
      highCPABidDecrease: 0.85,
      tapThreshold: 7,
      objective: undefined,
      minBid: 0.1,
      noInstallBidDecreaseThresh: 0,
      highCPIBidDecreaseThresh: undefined,
      lowCPABidBoost: 1.15,
      maxBid: 0.35,
      staleRaiseBidBoost: 1.025,
      staleRaiseImpresshionThresh: 0,
    };

    this.client.orgDetails.branchIntegrationParameters = {
      branchBidAdjusterEnabled: false,
      branchKey: undefined,
      branchSecret: undefined,
    };

    this.client.orgDetails.branchBidParameters = {
      branchBidAdjustment: 0.1,
      branchOptimizationGoal: undefined,
      minAppleInstalls: 15,
      branchMinBid: 0.1,
      branchMaxBid: 25,
      revenueOverAdSpendThreshold: undefined,
      revenueOverAdSpendThresholdBuffer: 0.2,
      costPerPurchaseThreshold: undefined,
      costPerPurchaseThresholdBuffer: 0.2,
      objective: undefined,
    };

    this.client.orgDetails.disabled = false;

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

  setOrgIdValue() {
    this.step1Form.get("orgId").setValue(this.orgId);
  }

  setStep1FormValues() {
    this.step1Form
      .get("clientId")
      .setValue(this.client.orgDetails.auth.clientId);
    this.step1Form.get("teamId").setValue(this.client.orgDetails.auth.teamId);
    this.step1Form.get("keyId").setValue(this.client.orgDetails.auth.keyId);
    this.step1Form
      .get("privateKey")
      .setValue(this.client.orgDetails.auth.privateKey);
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
          const client = Client.buildFromGetClientResponse(val);
          client.orgDetails.hasRegistered = true;
          return this.clientService
            .postClient(ClientPayload.buildFromClient(client))
            .pipe(
              take(1),
              tap(() => {
                this.isLoadingResults = false;
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
      return this.step2Form.get("substep4").invalid;
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
          actionYes: "Close",
          actionNo: "Close",
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
      duration: 10000,
      panelClass: "standard",
    });
  }
}
