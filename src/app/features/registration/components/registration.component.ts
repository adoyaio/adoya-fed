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
import { chain, find, get, isNil, set } from "lodash";
import { EMPTY } from "rxjs";
import { catchError, finalize, take, tap } from "rxjs/operators";
import { Client } from "src/app/core/models/client";
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

  // get substep1(): any {
  //   return this.step2Form.get("substep1");
  // }
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
          if (val.selectedIndex === 1) {
            //  TODO build the client

            // set the dropdown values of apps
            this.isLoadingResults = true;
            this.clientService
              .getAppleCampaigns(this.orgId)
              .pipe(
                take(1),
                tap((val) => {
                  this.apps = val.data;
                }),
                finalize(() => {
                  this.isLoadingResults = false;
                })
              )
              .subscribe();
          }
          if (val.selectedIndex === 2) {
            // submit the client
            this.isLoadingResults = true;
            this.clientService
              .getAppleCampaigns(this.orgId)
              .pipe(
                take(1),
                tap((val) => {
                  this.apps = val.data;
                }),
                finalize(() => {
                  this.isLoadingResults = false;
                })
              )
              .subscribe();
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

  get substep1(): any {
    return this.step2Form.get("substep1");
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
}
