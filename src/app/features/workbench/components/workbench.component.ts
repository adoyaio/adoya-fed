import { Validator } from "./../../../shared/dynamic-form/interfaces/validator.interface";
import { Router } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { AmplifyService } from "aws-amplify-angular";
import { map, tap, catchError } from "rxjs/operators";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from "@angular/forms";
import { UserAccountService } from "src/app/shared/services/user-account.service";
import { ClientService } from "src/app/core/services/client.service";
import { Client } from "../../reporting/models/client";
import { CustomFormValidators } from "src/app/shared/dynamic-form/validators/CustomFormValidators";
import { EMPTY } from "rxjs";
import { ClientPayload } from "../../reporting/models/client-payload";

@Component({
  selector: "app-workbench",
  templateUrl: "./workbench.component.html",
  styleUrls: ["./workbench.component.scss"],
})
export class WorkbenchComponent implements OnInit {
  constructor(
    private amplifyService: AmplifyService,
    private router: Router,
    private fb: FormBuilder,
    private userAccountService: UserAccountService,
    private clientService: ClientService
  ) {}

  appleForm = this.fb.group({
    objective: [""],
    highCPI: [""],
  });
  branchForm = this.fb.group({
    branchObjective: [""],
    cppThreshold: [""],
    revenueOverSpend: [""],
  });

  preferencesForm = this.fb.group({
    emailAddresses: [""],
  });

  client: Client = new Client();
  isLoadingResults = true;
  orgId: string;

  ngOnInit() {
    this.appleForm
      .get("highCPI")
      .setValidators([Validators.min(0.1), Validators.max(1000)]);

    this.branchForm
      .get("branchObjective")
      .setValidators([Validators.min(0.1), Validators.max(1000)]);

    this.branchForm
      .get("revenueOverSpend")
      .setValidators([Validators.min(0.1), Validators.max(1000)]);

    this.preferencesForm
      .get("emailAddresses")
      .setValidators([CustomFormValidators.emailListValidator]);

    // this.appleForm.get("objective").setValidators([Validators.required]);

    this.amplifyService
      .authState()
      .pipe(
        tap((authState) => {
          if (!(authState.state === "signedIn")) {
            this.router.navigateByUrl("/portal");
          }
        })
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
        tap((_) => {
          this.isLoadingResults = true;
        }),
        map((data) => {
          this.client = Client.buildFromGetClientResponse(data);

          this.appleForm
            .get("objective")
            .setValue(this.client.orgDetails.bidParameters.objective);

          this.appleForm
            .get("highCPI")
            .setValue(
              this.client.orgDetails.bidParameters.highCPIBidDecreaseThresh
            );

          this.branchForm
            .get("branchObjective")
            .setValue(
              this.client.orgDetails.branchBidParameters.branchOptimizationGoal
            );

          this.branchForm
            .get("cppThreshold")
            .setValue(
              this.client.orgDetails.branchBidParameters
                .costPerPurchaseThreshold
            );

          this.branchForm
            .get("revenueOverSpend")
            .setValue(
              this.client.orgDetails.branchBidParameters
                .revenueOverAdSpendThreshold
            );

          this.preferencesForm
            .get("emailAddresses")
            .setValue(this.client.orgDetails.emailAddresses);

          this.isLoadingResults = false;
          return data;
        }),
        catchError(() => {
          this.isLoadingResults = false;
          return [];
        })
      )
      .subscribe();
  }

  onResetForm() {
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
    this.preferencesForm
      .get("emailAddresses")
      .setValue(this.client.orgDetails.emailAddresses);
  }

  onAppleSubmit() {
    if (this.appleForm.valid) {
      this.isLoadingResults = true;

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

      this.client.orgDetails.branchBidParameters.branchOptimizationGoal = this.branchForm.get(
        "branchObjective"
      ).value;
      this.client.orgDetails.branchBidParameters.costPerPurchaseThreshold = this.branchForm.get(
        "cppThreshold"
      ).value;
      this.client.orgDetails.branchBidParameters.revenueOverAdSpendThreshold = this.branchForm.get(
        "revenueOverSpend"
      ).value;

      this.clientService
        .postClient(ClientPayload.buildFromClient(this.client))
        .pipe(
          tap((_) => {
            this.isLoadingResults = true;
          }),
          map((data) => {
            this.isLoadingResults = false;
            return data;
          }),
          catchError(() => {
            this.isLoadingResults = false;
            return [];
          })
        )
        .subscribe();
    } else {
      // snackbar
    }
  }

  onPreferencesSubmit() {
    if (this.preferencesForm.valid) {
      this.isLoadingResults = true;

      this.client.orgDetails.emailAddresses = this.preferencesForm
        .get("emailAddresses")
        .value.split(",");

      this.clientService
        .postClient(ClientPayload.buildFromClient(this.client))
        .pipe(
          tap((_) => {
            this.isLoadingResults = true;
          }),
          map((data) => {
            this.isLoadingResults = false;
            return data;
          }),
          catchError(() => {
            this.isLoadingResults = false;
            return [];
          })
        )
        .subscribe();
    } else {
      // snackbar
    }
  }
}
