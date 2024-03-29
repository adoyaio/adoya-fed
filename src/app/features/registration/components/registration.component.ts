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
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  Router,
} from "@angular/router";
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
  includes,
} from "lodash";
import { combineLatest, EMPTY, forkJoin, of, Subject, throwError } from "rxjs";
import {
  catchError,
  map,
  switchMap,
  take,
  takeUntil,
  tap,
} from "rxjs/operators";
import { Client, OrgDetails } from "src/app/core/models/client";
import { ClientPayload } from "src/app/core/models/client-payload";
import { AppService } from "src/app/core/services/app.service";
import { AppleService } from "src/app/core/services/apple.service";
import { ClientService } from "src/app/core/services/client.service";
import { UserAccountService } from "src/app/core/services/user-account.service";
import { CustomFormValidators } from "src/app/shared/dynamic-form/validators/CustomFormValidators";
import { DynamicModalComponent } from "src/app/shared/dynamic-modal/dynamic-modal.component";
import { SupportItem } from "../../support/models/support-item";
import { CampaignData } from "../model/campaign-data";
import { SupportService } from "src/app/core/services/support.service";
import { Location } from "@angular/common";
import { AdoyaCampaign } from "../model/adoya-campaign";

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
  isLoadingResults;
  isSendingResults;
  orgId: string;
  asaId: string;
  clientKey: string;
  appKey: string;
  public emailAddresses: string;
  username: string;
  campaigns = [];
  inviteSent = false;
  public isImportFlow = false;
  public hasExistingAsaCampaigns = false;
  appleCampaigns = [];

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

  substeps: any[] = [
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
    step0Form: this.fb.group({
      inviteControl: new FormControl(undefined, Validators.required),
      appleOrgId: new FormControl(undefined, Validators.required),
    }),
    step1Form: this.fb.group({
      orgId: new FormControl("", Validators.required), // this is the adoya orgId/cognito id
      // NOTE moved into step 0 so  we can pull
      // the skeleton appleOrgId: new FormControl("", Validators.required),
      clientId: new FormControl("", Validators.required),
      teamId: new FormControl("", Validators.required),
      keyId: new FormControl("", Validators.required),
    }),
    step2Form: this.fb.group(
      {
        termsControl: new FormControl(undefined, Validators.required),
        substep1: this.fb.group({
          application: new FormControl(undefined, Validators.required),
          country: new FormControl(undefined, Validators.required),
          currency: new FormControl(undefined, Validators.required),
        }),
        substep1import: this.fb.group({
          appleCampaign: new FormControl(undefined, Validators.required),
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

  get step0Form(): FormGroup {
    return this.form.get("step0Form") as FormGroup;
  }
  get step1Form(): FormGroup {
    return this.form.get("step1Form") as FormGroup;
  }

  public get step2Form(): FormGroup {
    return this.form.get("step2Form") as FormGroup;
  }

  get appleOrgIdControl(): AbstractControl {
    return this.step0Form.get("appleOrgId");
  }

  get step3Form(): FormGroup {
    return this.form.get("step3Form") as FormGroup;
  }

  get substep1(): any {
    return this.step2Form.get("substep1");
  }

  public get substep1import(): any {
    return this.step2Form.get("substep1import");
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

  get applicationControl(): AbstractControl {
    return this.step2Form.get("substep1").get("application");
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

  get inviteControl(): AbstractControl {
    return this.step0Form.get("inviteControl");
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
    // TODO revisit
    return true;
    // if (isNil(this.client) || isNil(this.client.orgDetails)) {
    //   return true;
    // }
    // return chain(this.client.orgDetails.appleCampaigns)
    //   .some((campaign) => {
    //     return campaign.status === "ENABLED";
    //   })
    //   .value();
  }

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private clientService: ClientService,
    private appleService: AppleService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private userAccountService: UserAccountService,
    private supportService: SupportService,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    public appService: AppService
  ) {}

  ngOnInit() {
    if (!isNil(this.activatedRoute.snapshot.queryParams["id"])) {
      this.asaId = this.activatedRoute.snapshot.queryParams["id"];
      this.setAsaIdValue();
    }
    Auth.currentUserInfo().then((val) => {
      // 2 flows, agent or directly as a client
      // NOTE now just one flow all users are agents

      // NOTE this is the cognito id
      this.orgId = this.userAccountService.agentId;
      this.emailAddresses = get(val.attributes, "email");

      // if they have a client entry then populate step 2 values and proceed
      if (!isNil(this.asaId)) {
        this.isLoadingResults = true;
        this.clientKey = `${this.orgId}__${this.asaId}`;
        this.clientService
          .getClient(this.clientKey)
          .pipe(
            take(1),
            tap((data: any) => {
              this.client = Client.buildFromGetClientResponse(
                data,
                this.clientKey
              );

              if (this.client.orgDetails.hasInvitedApiUser) {
                this.inviteControl.setValue(true);
              }
              // check if client exists has auth fields and has invited api user
              if (
                !isNil(this.client.orgDetails.auth) &&
                get(this.client.orgDetails, "hasInvitedApiUser", "false")
              ) {
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
              //this.setOrgIdValue();
              this.isLoadingResults = false;
              return EMPTY;
            })
          )
          .subscribe();
      }

      //  else {
      //   // get by agent id begins_with(agent id), and filter for the app that hasn't been registered
      //   this.clientService
      //     .getClients(this.userAccountService.agentId)
      //     .pipe(
      //       take(1),
      //       tap((data: any) => {
      //         const hasMultipleUnregisteredApps = chain(data)
      //           .filter((client: Client) => {
      //             return (
      //               client.orgDetails.isActiveClient &&
      //               !client.orgDetails.hasRegistered
      //             );
      //           })
      //           .value();

      //         // TODO modal here to handle if there are multiple unregistered apps
      //         if (get(data, "length", 0) > 1 && hasMultipleUnregisteredApps) {
      //           // FOR NOW REDIRECT TO AGENTS
      //           this.openSnackBar(
      //             "we found several unregistered applications. please select one to continue registration.",
      //             "dismiss"
      //           );
      //           this.router.navigateByUrl("/workbench/agents");
      //           return;
      //         }

      //         this.client = Client.buildFromGetClientResponse(data, this.orgId);

      //         if (this.client.orgDetails.hasInvitedApiUser) {
      //           this.inviteControl.setValue(true);
      //         }
      //         // check if client exists has auth fields and has invited api user
      //         if (
      //           !isNil(this.client.orgDetails.auth) &&
      //           get(this.client.orgDetails, "hasInvitedApiUser", "false")
      //         ) {
      //           this.openSnackBar(
      //             "we found your apple search ads configuration! if you would like to continue, click 'next'",
      //             ""
      //           );
      //           this.setOrgIdValue();
      //           this.setStep1FormValues();
      //           this.setStep2FormValues();
      //           this.stepper.next();
      //         }
      //         this.isLoadingResults = false;
      //       }),
      //       catchError(() => {
      //         this.setOrgIdValue();
      //         this.isLoadingResults = false;
      //         return EMPTY;
      //       })
      //     )
      //     .subscribe();
      // }
    });
  }

  ngAfterViewInit() {
    this.stepper.selectionChange
      .pipe(
        tap((val) => {
          // STEP 2
          this.substeps.forEach((val) => {
            if (val.ordinal === 1) {
              val.complete = false;
              val.active = true;
            } else {
              val.complete = false;
              val.active = false;
            }
          });
          if (val.selectedIndex === 2) {
            this.openSnackBar(
              "one moment, while we gather more details about your account",
              ""
            );

            this.isLoadingResults = true;
            if (
              has(this.client.orgDetails, "appleCampaigns") &&
              !isEmpty(this.client.orgDetails.appleCampaigns)
            ) {
              // TODO revisit
              // modal warning
              // this.showWarningDialog();
            }

            // TODO move all this into the modal
            this.client.orgDetails.auth = {
              clientId: this.step1Form.get("clientId").value,
              teamId: this.step1Form.get("teamId").value,
              keyId: this.step1Form.get("keyId").value,
            };

            // NOTE this now uses the composite key of cognito id __ asa id,
            // and once an app is selected will become cognito __ asa __ adamId
            this.client.orgId = this.clientKey;
            this.client.orgDetails.orgId = +this.appleOrgIdControl.value; // this represents an asa id number
            this.client.orgDetails.hasInvitedApiUser = true;
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

                  // on step 2 submission pull the
                  return this.appleService.getAppleApps(this.clientKey).pipe(
                    tap((val) => {
                      // TODO check for apps result and compare to getClients response

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

  handlePrintTerms($event) {
    this.printViewText = get($event, "text");
    setTimeout(() => {
      window.print();
    });
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
      .patchAppleCampaign(this.appKey, payload)
      .pipe(
        take(1),
        switchMap((val) => {
          return this.clientService.getClient(this.appKey).pipe(
            take(1),
            tap((val) => {
              this.isLoadingResults = false;
              this.client = Client.buildFromGetClientResponse(val, this.appKey);
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

  setOrgIdValue(): void {
    this.step1Form.get("orgId").setValue(this.orgId);
    // if (isNil(this.client)) {
    //   return;
    // }
    // THIS COMES OFF URL NOW
    // if (!isNil(this.client.orgDetails.orgId)) {
    //   this.step0Form
    //     .get("appleOrgId")
    //     .setValue(get(this.client, "orgDetails.orgId"));
    // }
  }

  setAsaIdValue(): void {
    this.step0Form.get("appleOrgId").setValue(this.asaId);
  }

  setStep1FormValues() {
    this.step1Form
      .get("clientId")
      .setValue(this.client.orgDetails.auth.clientId);
    this.step1Form.get("teamId").setValue(this.client.orgDetails.auth.teamId);
    this.step1Form.get("keyId").setValue(this.client.orgDetails.auth.keyId);
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
    const step = find(this.substeps, (step) => step.ordinal === ordinal);
    return get(step, "active", false);
  }

  continueImportFlow() {
    this.campaigns = [];
    this.isLoadingResults = true;
    const campaignsToImport = get(this.substep1import.value, "appleCampaign");

    // const campaignsToImport =
    //   this.substep1import.value.get("appleCampaign").value;

    // const campaignsToImport = this.substep1import
    //   .value()
    //   .get("appleCampaign")
    //   .value();

    if (!isNil(campaignsToImport) && !isEmpty(campaignsToImport)) {
      // make calls to adgroup for each selected campaign
      let adgroupCalls = campaignsToImport.map((campaign) => {
        return this.appleService.getAppleAdgroups(this.clientKey, campaign);
      });

      forkJoin(adgroupCalls)
        .pipe(
          tap((adgroupResponses) => {
            this.isLoadingResults = false;
            this.isImportFlow = true;

            adgroupResponses.forEach((adGroupResponse: any) => {
              get(adGroupResponse, "data").forEach((adGroup) => {
                // find the campaign
                let campaign = this.appleCampaigns.find((appleCampaign) => {
                  return appleCampaign.id === adGroup.campaignId;
                });

                this.campaigns.push(
                  // build adoya campaign from asa campaign and adgroup info
                  AdoyaCampaign.buildAdoyaCampaign(campaign, adGroup)
                );
              });
            });

            this.goNext(1);
          })
        )
        .subscribe();

      // this.campaigns = this.appleCampaigns.filter((val) =>
      //   includes(campaignsToImport, val.id)
      // );
    } else {
      this.isLoadingResults = false;
      this.isImportFlow = false;
      this.substep1import.disable();
      this.goNext(1);
    }

    // const step = find(this.substeps, (step) => step.ordinal === 1);
    // set(step, "complete", true);
    // set(step, "active", false);

    // const nextStep = find(this.substeps, (step) => step.ordinal === 2);
    // set(nextStep, "complete", false);
    // set(nextStep, "active", true);
  }

  // step 3 substeps
  submitStep(ordinal: number) {
    // on the first substep check for existing campaigns for the selected app
    if (ordinal === 1) {
      this.isLoadingResults = true;
      this.appleService
        .getAppleCampaigns(this.clientKey)
        .pipe(
          tap((val) => {
            this.isLoadingResults = false;

            if (!isNil(val.data) && !isEmpty(val.data)) {
              this.appleCampaigns = val.data;
              this.hasExistingAsaCampaigns = true;
              this.openSnackBar(
                "we found some of your apple search ads campaigns. please select campaigns that you would like to import, or to continue, click 'next'",
                ""
              );
            } else {
              this.goNext(ordinal);
            }
          })
        )
        .subscribe();
    } else if (ordinal === 2) {
      // if import flow skip all remaining substeps
      if (this.isImportFlow) {
        this.completeImportFlow();
      } else {
        this.goNext(ordinal);
      }
    } else {
      this.goNext(ordinal);
    }
  }

  goNext(ordinal: number) {
    const step = find(this.substeps, (step) => step.ordinal === ordinal);
    set(step, "complete", true);
    set(step, "active", false);

    const nextStep = find(
      this.substeps,
      (step) => step.ordinal === ordinal + 1
    );
    set(nextStep, "complete", false);
    set(nextStep, "active", true);
  }

  goBack(ordinal: number) {
    const step = find(this.substeps, (step) => step.ordinal === ordinal);
    set(step, "complete", true);
    set(step, "active", false);

    const prevStep = find(
      this.substeps,
      (step) => step.ordinal === ordinal - 1
    );
    set(prevStep, "complete", false);
    set(prevStep, "active", true);
  }

  complete() {
    this.isLoadingResults = true;
    this.clientService
      .getClient(this.appKey)
      .pipe(
        take(1),
        switchMap((val) => {
          const client = Client.buildFromGetClientResponse(val, this.appKey);
          client.orgDetails.hasRegistered = true;
          client.orgDetails.isActiveClient = true;
          return this.clientService
            .postClient(ClientPayload.buildFromClient(client), false)
            .pipe(
              take(1),
              tap(() => {
                // this.isLoadingResults = false;

                if (this.userAccountService.isAgent) {
                  // reset the saved apps
                  this.appService.isAgentsInitialized = false;
                  this.router.navigateByUrl("/workbench/applications");
                } else {
                  this.router.navigateByUrl("/workbench");
                }
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

  step1NextVisible(): boolean {
    if (isNil(this.client)) {
      return true;
    }
    return !this.client.orgDetails.hasInvitedApiUser;
  }

  substepDisabled(): boolean {
    const activeSubstep = find(this.substeps, (step) => step.active === true);

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
    $event.stopPropagation();
    $event.preventDefault();
    window.open(
      "https://app.searchads.apple.com/cm/app/settings/users/invite",
      "_blank"
    );
  }

  regHelpEventDisabled(): boolean {
    return isNil(this.appleOrgIdControl.value);
  }

  handleInviteSentEvent($event) {
    this.isSendingResults = true;
    $event.stopPropagation();
    $event.preventDefault();

    // we now know what the asa id is, if we didn't before from url
    this.asaId = this.appleOrgIdControl.value;
    this.clientKey = `${this.orgId}__${this.asaId}`;

    this.location.replaceState(`/registration?id=${this.asaId}`);

    const supportItem = new SupportItem();
    supportItem.description = `invite has been sent for api user`;
    supportItem.userId = this.clientKey;
    supportItem.username = this.emailAddresses;
    supportItem.subject = `an asa api user invite has been sent for ${this.orgId} `;
    supportItem.orgId = this.appleOrgIdControl.value;
    supportItem.type = "registration";

    this.supportService
      .postSupportItem(supportItem)
      .pipe(
        take(1),
        map((data) => {
          this.inviteSent = true;
          this.isSendingResults = false;
          this.openSnackBar(
            `thank you for inviting us to manage your campaigns! we'll notify you when you may continue to the next step.`,
            ""
          );

          return data;
        }),
        catchError(() => {
          this.isSendingResults = false;
          this.openSnackBar(
            "unable to process your request at this time, we apologize for the inconvenience",
            "dismiss"
          );
          return [];
        })
      )
      .subscribe();
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

  completeImportFlow() {
    this.dialog
      .open(DynamicModalComponent, {
        data: {
          title: ``,
          content: AppService.clickWrap,
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
            this.substep3.disable();
            this.substep4.disable();
            this.substep5.disable();
            this.substep6.disable();

            this.isLoadingResults = true;
            return this.clientService.getClient(this.clientKey).pipe(
              take(1),
              switchMap((val) => {
                // WRITE FINAL DB ENTRY TO APP KEY
                this.appKey = `${this.clientKey}__${this.applicationControl.value}`;

                const client = Client.buildFromGetClientResponse(
                  val,
                  this.appKey
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
                client.orgDetails.appID = get(this.app, "adamId");
                client.orgDetails.clientName = get(this.app, "developerName");

                client.orgDetails.currency =
                  this.substep1.get("currency").value;

                // get auth
                return this.appleService.getAppleAuth(this.clientKey).pipe(
                  take(1),
                  switchMap((val) => {
                    this.openIndefiniteSnackBar(
                      "importing apple search ads campaigns, this may take a few minutes. please don't refresh your browser during this time!",
                      ""
                    );

                    // finalize client with campaigns and hasRegistered
                    set(client, "orgDetails.appleCampaigns", this.campaigns);
                    set(client, "orgDetails.hasRegistered", true);

                    // set step 3 (4th total step) form controls
                    chain(this.campaigns)
                      .each((campaign) => {
                        const statusControl = `status|${campaign.campaignId}`;

                        this.step3Form.addControl(
                          statusControl,
                          new FormControl(
                            campaign.status === "ENABLED" ? true : false
                          )
                        );

                        const lifetimeBudgetControl = `lifetimeBudget|${campaign.campaignId}`;
                        this.step3Form.addControl(
                          lifetimeBudgetControl,
                          new FormControl(campaign.lifetimeBudget)
                        );

                        const dailyBudgetControl = `dailyBudget|${campaign.campaignId}`;
                        this.step3Form.addControl(
                          dailyBudgetControl,
                          new FormControl(campaign.dailyBudget)
                        );
                      })
                      .value();

                    // post the client changes
                    return this.clientService
                      .postClient(ClientPayload.buildFromClient(client), false)
                      .pipe(
                        take(1),
                        tap(() => {
                          this.stepper.steps.forEach((step, i) => {
                            if (i < 3) {
                              step.editable = false;
                            }
                          });
                          this.client = client;
                          this.isLoadingResults = false;
                          this.openSnackBar(
                            "we've completed importing your campaigns! please review details and complete registration to finalize",
                            ""
                          );
                          this.stepper.next();
                        })
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

  completeStep2() {
    this.dialog
      .open(DynamicModalComponent, {
        data: {
          title: ``,
          content: AppService.clickWrap,
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
            this.substep1import.disable();
            this.isLoadingResults = true;
            return this.clientService.getClient(this.clientKey).pipe(
              take(1),
              switchMap((val) => {
                // for adoya
                // const client = Client.buildFromGetClientResponse(
                //   val,
                //   this.clientKey
                // );

                // WRITE FINAL DB ENTRY TO APP KEY
                this.appKey = `${this.clientKey}__${this.applicationControl.value}`;

                // TODO handle this
                // this.clientService
                //   .getClient(this.appKey).pipe(
                //     take(1),
                //     tap((val) => {
                //         if(val){
                //           this.
                //         }
                //     }),
                //     catchError((err) => {

                //     })
                //   ).subscribe()

                const client = Client.buildFromGetClientResponse(
                  val,
                  this.appKey
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
                client.orgDetails.appID = get(this.app, "adamId");
                client.orgDetails.clientName = get(this.app, "developerName");

                client.orgDetails.currency =
                  this.substep1.get("currency").value;

                // for apple
                const campaignData = new CampaignData();
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

                // TODO remove get auth
                return this.appleService.getAppleAuth(this.clientKey).pipe(
                  take(1),
                  switchMap((val) => {
                    this.openIndefiniteSnackBar(
                      "creating apple search ads campaigns, this may take a few minutes. please don't refresh your browser during this time!",
                      ""
                    );
                    // set auth
                    set(campaignData, "authToken", val);

                    // run one api call for each of the campaign types
                    // competitor, category, brand, exact_discovery, broad_discovery, search_discovery
                    const competitorData = cloneDeep(campaignData);
                    set(competitorData, "campaignType", "competitor");

                    return this.appleService
                      .postAppleCampaign(this.appKey, competitorData)
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
                            .postAppleCampaign(this.appKey, categoryData)
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
                                  .postAppleCampaign(this.appKey, brandData)
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
                                          this.appKey,
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
                                                this.appKey,
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
                                                      this.appKey,
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
                                                        set(
                                                          client,
                                                          "orgDetails.hasRegistered",
                                                          true
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
                                                              this.stepper.steps.forEach(
                                                                (step, i) => {
                                                                  if (i < 3) {
                                                                    step.editable =
                                                                      false;
                                                                  }
                                                                }
                                                              );
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

                // NOTE has been broken into multiple calls to get around lambda timeout
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
    chain(this.substeps)
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

  navigateBack() {
    this.router.navigateByUrl("/portal");
  }
}
