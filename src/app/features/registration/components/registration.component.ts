import { Component, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { MatSnackBar } from "@angular/material";
import { Router } from "@angular/router";
import { AmplifyService } from "aws-amplify-angular";
import { chain, find, get, set } from "lodash";
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
      complete: false,
      active: false,
      title: "Post Install Optimizations (Optional)",
    },
  ];
  constructor(
    private amplifyService: AmplifyService,
    private router: Router,
    private fb: FormBuilder,
    private userAccountService: UserAccountService,
    private clientService: ClientService,
    private snackBar: MatSnackBar
  ) {}

  // appleForm = this.fb.group({
  //   objective: [""],
  //   cpi: [""],
  // });
  // branchForm = this.fb.group({
  //   mmpObjective: [""],
  //   cpp: [""],
  //   roas: [""],
  //   branchBidAdjusterEnabled: false,
  //   branchKey: [""],
  //   branchSecret: [""],
  // });

  step1Form = this.fb.group({
    clientId: [""],
    clientSecret: [""],
    oauthUsername: [""],
    oauthPassword: [""],
    orgId: [""],
  });

  step2Form = this.fb.group({
    objective: [""],
    cpi: [""],
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
}
