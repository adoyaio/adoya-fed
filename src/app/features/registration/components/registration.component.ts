import { Component, OnInit, ViewChild } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MatDialog, MatSnackBar, MatStepper } from "@angular/material";
import { Router } from "@angular/router";
import { AmplifyService } from "aws-amplify-angular";
import { chain, delay, find, get, has, isNil, set } from "lodash";
import { EMPTY } from "rxjs";
import { catchError, finalize, switchMap, take, tap } from "rxjs/operators";
import {
  BidParameters,
  BranchBidParameters,
  BranchIntegrationParameters,
  Client,
  KeywordAdderParameters,
  OrgDetails,
} from "src/app/core/models/client";
import { ClientPayload } from "src/app/core/models/client-payload";
import { ClientService } from "src/app/core/services/client.service";
import { UserAccountService } from "src/app/core/services/user-account.service";
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

  constructor(
    private amplifyService: AmplifyService,
    private router: Router,
    private fb: FormBuilder,
    private userAccountService: UserAccountService,
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
    }),
    substep2: this.fb.group({
      objective: new FormControl(undefined, Validators.required),
      cpi: new FormControl(undefined, Validators.required),
    }),
    substep3: this.fb.group({
      dailyBudget: new FormControl(undefined, Validators.required),
      lifetimeBudget: new FormControl(undefined, Validators.required),
    }),
    substep4: this.fb.group({
      competitors: new FormControl(undefined, Validators.required),
      phrases: new FormControl(undefined, Validators.required),
      brand: new FormControl(undefined, Validators.required),
    }),
    substep5: this.fb.group({
      genders: new FormControl(undefined, Validators.required),
      ages: new FormControl(undefined, Validators.required),
    }),
    substep6: this.fb.group({
      mmpObjective: new FormControl(undefined),
      cpp: new FormControl(undefined),
      roas: new FormControl(undefined),
      branchBidAdjusterEnabled: new FormControl(false),
      branchKey: new FormControl(false),
      branchSecret: new FormControl(false),
    }),
  });

  client: Client = new Client();
  isLoadingResults = true;
  isSendingResults;
  orgId: string;

  ngOnInit() {
    this.orgId = this.userAccountService
      .getCurrentUser()
      .UserAttributes.find((val) => {
        return val.Name === "custom:org_id";
      }).Value;

    this.clientService
      .getClient(this.orgId)
      .pipe(
        take(1),
        tap((data: Client) => {
          this.client = Client.buildFromGetClientResponse(data);

          // check if client exists and has auth fields
          if (!isNil(this.client.orgDetails.auth)) {
            this.setStep1FormValues();
          }
          this.isLoadingResults = false;
        }),
        catchError(() => {
          this.isLoadingResults = false;
          return EMPTY;
        })
      )
      .subscribe();
  }

  ngAfterViewInit() {
    this.stepper.selectionChange
      .pipe(
        tap((val) => {
          this.isLoadingResults = true;

          // STEP 1
          if (val.selectedIndex === 1) {
            //  build and submit a skeleton client
            if (has(this.client.orgDetails, "appleCampaigns")) {
              // TODO modal warning
            }

            const newClient = new Client();
            newClient.orgDetails = new OrgDetails();
            newClient.orgDetails.auth = {
              clientId: this.step1Form.get("clientId").value,
              teamId: this.step1Form.get("teamId").value,
              keyId: this.step1Form.get("keyId").value,
              privateKey: this.step1Form.get("privateKey").value,
            };

            // TODO set these in a step
            newClient.orgDetails.appID = "TODO";
            newClient.orgDetails.appName = "TODO";
            newClient.orgDetails.currency = "USD";
            newClient.orgDetails.emailAddresses = ["scott.kaplan@adoya.io"];

            newClient.orgDetails.appleCampaigns = [];
            newClient.orgDetails.bidParameters = new BidParameters();
            newClient.orgDetails.branchBidParameters = new BranchBidParameters();
            newClient.orgDetails.keywordAdderParameters = new KeywordAdderParameters();
            newClient.orgDetails.branchIntegrationParameters = new BranchIntegrationParameters();

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
                  }
                  return this.clientService.getAppleCampaigns(this.orgId).pipe(
                    take(1),
                    tap((val) => {
                      this.apps = val.data;
                    }),
                    finalize(() => {
                      this.isLoadingResults = false;
                    })
                  );
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
          }

          // STEP 2
          if (val.selectedIndex === 2) {
            // build the client from step 2 values
            if (this.step2Form.valid) {
              this.isSendingResults = true;

              this.client.orgDetails.bidParameters.objective = this.substep2.get(
                "objective"
              ).value;
              this.client.orgDetails.adgroupBidParameters.objective = this.substep2.get(
                "objective"
              ).value;

              this.client.orgDetails.bidParameters.highCPIBidDecreaseThresh = this.substep2.get(
                "cpi"
              ).value;

              this.client.orgDetails.adgroupBidParameters.highCPIBidDecreaseThresh = this.substep2.get(
                "cpi"
              ).value;

              // Branch fields
              this.client.orgDetails.branchBidParameters.branchOptimizationGoal = this.substep6.get(
                "mmpObjective"
              ).value;

              this.client.orgDetails.branchBidParameters.costPerPurchaseThreshold = this.substep6.get(
                "cpp"
              ).value;

              this.client.orgDetails.branchBidParameters.revenueOverAdSpendThreshold = this.substep6.get(
                "roas"
              ).value;

              this.client.orgDetails.branchIntegrationParameters.branchBidAdjusterEnabled = this.substep6.get(
                "branchBidAdjusterEnabled"
              ).value;

              this.client.orgDetails.branchIntegrationParameters.branchKey = this.substep6.get(
                "branchKey"
              ).value;
              this.client.orgDetails.branchIntegrationParameters.branchSecret = this.substep6.get(
                "branchSecret"
              ).value;

              // // build campaigns
              // chain(this.client)
              //   .get("orgDetails")
              //   .get("appleCampaigns")
              //   .each((campaign) => {
              //     // get the checkbox value to see if bid params overridden
              //     const hasOverrides = this.appleForm.get(
              //       "checkbox_" + campaign.campaignId
              //     ).value;

              //     if (hasOverrides) {
              //       const bidParameters = {};
              //       const cpi = this.appleForm.get("cpi_" + campaign.campaignId).value;

              //       const objective = this.appleForm.get(
              //         "objective_" + campaign.campaignId
              //       ).value;

              //       if (!isNil(cpi)) {
              //         set(bidParameters, "HIGH_CPI_BID_DECREASE_THRESH", cpi);
              //       }

              //       if (!isNil(objective)) {
              //         set(bidParameters, "OBJECTIVE", objective);
              //       }

              //       set(campaign, "bidParameters", bidParameters);
              //     } else {
              //       set(campaign, "bidParameters", {});
              //     }

              //     // check if there are branch bid params overrides
              //     const hasBranchOverrides = this.appleForm.get(
              //       "mmpCheckbox_" + campaign.campaignId
              //     ).value;

              //     if (hasBranchOverrides) {
              //       const branchBidParameters = {};

              //       const mmpObjective = this.appleForm.get(
              //         "mmpObjective_" + campaign.campaignId
              //       ).value;

              //       if (mmpObjective === "revenue_over_ad_spend") {
              //         const roas = this.appleForm.get("roas_" + campaign.campaignId)
              //           .value;

              //         set(branchBidParameters, "revenue_over_ad_spend_threshold", roas);
              //         set(
              //           branchBidParameters,
              //           "branch_optimization_goal",
              //           mmpObjective
              //         );
              //       } else {
              //         const cpp = this.appleForm.get("cpp_" + campaign.campaignId)
              //           .value;
              //         set(branchBidParameters, "cost_per_purchase_threshold", cpp);
              //         set(
              //           branchBidParameters,
              //           "branch_optimization_goal",
              //           mmpObjective
              //         );
              //       }
              //       set(campaign, "branchBidParameters", branchBidParameters);
              //     } else {
              //       set(campaign, "branchBidParameters", {});
              //     }
              //   })
              //   .value();

              this.clientService
                .postClient(ClientPayload.buildFromClient(this.client))
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
                )
                .subscribe();
            }
          }
        })
      )
      .subscribe();
  }

  setStep1FormValues() {
    this.step1Form.get("orgId").setValue(this.client.orgDetails.orgId);
    this.step1Form
      .get("clientId")
      .setValue(this.client.orgDetails.auth.clientId);
    this.step1Form.get("teamId").setValue(this.client.orgDetails.auth.teamId);
    this.step1Form.get("keyId").setValue(this.client.orgDetails.auth.keyId);
    this.step1Form
      .get("privateKey")
      .setValue(this.client.orgDetails.auth.privateKey);
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
    this.client.orgDetails.hasRegistered = true;
    this.clientService
      .postClient(ClientPayload.buildFromClient(this.client))
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

  handleBranchCheckboxChange() {}

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

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 10000,
      panelClass: "standard",
    });
  }
}
