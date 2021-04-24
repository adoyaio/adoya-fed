import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MatSnackBar } from "@angular/material";
import { Router } from "@angular/router";
import { AmplifyService } from "aws-amplify-angular";
import { chain, find, get, isNil, set } from "lodash";
import { Client } from "src/app/core/models/client";
import { ClientService } from "src/app/core/services/client.service";
import { UserAccountService } from "src/app/core/services/user-account.service";

@Component({
  selector: "app-registration",
  templateUrl: "./registration.component.html",
  styleUrls: ["./registration.component.scss"],
})
export class RegistrationComponent implements OnInit {
  countries = ["United States", "Canada", "Japan"];
  apps = ["Acme", "Beta", "Delta"]; // TODO load from api
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
    private snackBar: MatSnackBar
  ) {}

  step1Form = this.fb.group({
    clientId: [""],
    clientSecret: [""],
    oauthUsername: [""],
    oauthPassword: [""],
    orgId: [""],
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

  ngOnInit() {}

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

  // stepDisabled(formName: string): boolean {
  //   const formGroup: FormGroup = get(this, formName);
  //   // console.log(JSON.stringify(formGroup));
  //   return formGroup.invalid;
  //   // return false;
  // }

  get substep1(): any {
    return this.step2Form.get("substep1");
  }
}
