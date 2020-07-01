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

  client: Client = new Client();
  isLoadingResults = true;
  orgId: string;

  ngOnInit() {
    // this.branchForm.setValidators(CustomFormValidators.noWhitespaceValidator)
    // this.appleForm.setValidators(CustomFormValidators.noWhitespaceValidator)
    this.appleForm.controls["highCPI"].setValidators(Validators.minLength(1));
    this.appleForm.controls["highCPI"].setValidators([
      Validators.min(0.1),
      Validators.max(1000),
    ]);

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

  ngAfterViewInit() {
    // this.clientService
    //   .getClient(this.orgId)
    //   .pipe(
    //     map((data) => {
    //       this.isLoadingResults = false;
    //       this.client = Client.buildFromGetClientResponse(data);
    //       console.log(this.client.orgDetails);
    //       return data;
    //     }),
    //     catchError(() => {
    //       this.isLoadingResults = false;
    //       return [];
    //     })
    //   )
    //   .subscribe();
  }

  onAppleSubmit() {
    console.log(this.appleForm.get("objective").value);
    console.log(this.appleForm.get("highCPI").value);
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

    this.clientService
      .postClient(this.client)
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
  }
}
