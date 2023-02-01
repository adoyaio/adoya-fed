import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material";
import { Router } from "@angular/router";
import { chain, get, isNil } from "lodash";
import { of } from "rxjs";
import { catchError, map, switchMap, take, tap } from "rxjs/operators";
import { Client, OrgDetails } from "src/app/core/models/client";
import { ClientPayload } from "src/app/core/models/client-payload";
import { AppleService } from "src/app/core/services/apple.service";
import { ClientService } from "src/app/core/services/client.service";
import { SupportService } from "src/app/core/services/support.service";
import { UserAccountService } from "src/app/core/services/user-account.service";
import { SupportItem } from "../../support/models/support-item";

@Component({
  selector: "app-onboarding",
  templateUrl: "./onboarding.component.html",
  styleUrls: ["./onboarding.component.scss"],
})
export class OnboardingComponent implements OnInit {
  constructor(
    private clientService: ClientService,
    private appleService: AppleService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private supportService: SupportService,
    private router: Router,
    private userAccountService: UserAccountService
  ) {}

  ngOnInit() {}

  isSendingResults = false;

  form1 = this.fb.group({
    appleOrgId: new FormControl("", Validators.required),
    publicKey: new FormControl(undefined),
  });

  form = this.fb.group({
    userId: new FormControl("", Validators.required),
    clientId: new FormControl("", Validators.required),
    teamId: new FormControl("", Validators.required),
    keyId: new FormControl("", Validators.required),
    email: new FormControl("", Validators.required),
  });

  handleSubmit1() {
    this.isSendingResults = true;
    // create the public and private key
    this.clientService
      .createPemKey(this.form1.get("appleOrgId").value)
      .pipe(
        take(1),
        tap((val) => {
          this.isSendingResults = false;
          this.form1.get("publicKey").setValue(get(val, "publicKey"));

          if (get(val, "keyCreated", false) === false) {
            this.openSnackBar(
              `found existing key in s3 for ${
                this.form1.get("appleOrgId").value
              } `,
              "dismiss"
            );

            return;
          }

          this.openSnackBar(
            "successfully created key and uploaded to s3",
            "dismiss"
          );
        })
      )
      .subscribe();
  }

  handleSubmit(forAgent = false) {
    this.isSendingResults = true;
    const newClient = new Client();

    if (forAgent) {
      newClient.orgId =
        this.form.get("userId").value + "||" + this.form1.get("appleOrgId");
    } else {
      newClient.orgId = this.form.get("userId").value;
    }

    // mapping of cognito user id to dynamo root org id

    // TODO pivot here if an agent is registering a new client
    // add the agents cognito id to the apple org

    newClient.orgId = this.form.get("userId").value;
    newClient.orgDetails = new OrgDetails();
    newClient.orgDetails.auth = {
      teamId: this.form.get("teamId").value,
      keyId: this.form.get("keyId").value,
      clientId: this.form.get("clientId").value,
    };
    // mapping of apple org id to dynamo orgdetails org id
    newClient.orgDetails.orgId = +this.form1.get("appleOrgId").value;
    newClient.orgDetails.emailAddresses = [this.form.get("email").value];
    newClient.orgDetails.hasInvitedApiUser = true;
    newClient.orgDetails.hasRegistered = false;
    newClient.orgDetails.isActiveClient = false;

    newClient.orgDetails.keywordAdderParameters = {
      targetedKeywordTapThreshold: 2,
      negativeKeywordConversionThreshold: 0,
      broadMatchDefaultBid: 1,
      exactMatchDefaultBid: 1,
      negativeKeywordTapThreshold: 10,
      targetedKeywordConversionThreshold: 2,
    };

    // set default AdgroupBidParameters
    newClient.orgDetails.adgroupBidParameters = {
      highCPABidDecrease: 0.85,
      tapThreshold: 7,
      objective: "conservative",
      lowCPIBidIncreaseThresh: 0.4,
      minBid: 0.1,
      noInstallBidDecreaseThresh: 0,
      highCPIBidDecreaseThresh: 0,
      lowCPABidBoost: 1.15,
      maxBid: 3,
      staleRaiseBidBoost: 1.025,
      staleRaiseImpresshionThresh: 0,
    };

    newClient.orgDetails.bidParameters = {
      highCPABidDecrease: 0.85,
      tapThreshold: 7,
      objective: "conservative",
      minBid: 0.1,
      noInstallBidDecreaseThresh: 0,
      highCPIBidDecreaseThresh: 0,
      lowCPABidBoost: 1.15,
      maxBid: 0.35,
      staleRaiseBidBoost: 1.025,
      staleRaiseImpresshionThresh: 0,
    };

    newClient.orgDetails.branchIntegrationParameters = {
      branchBidAdjusterEnabled: false,
      branchKey: "",
      branchSecret: "",
    };

    newClient.orgDetails.branchBidParameters = {
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

    newClient.orgDetails.disabled = false;
    newClient.orgDetails.appleCampaigns = [];

    this.clientService
      .postClient(ClientPayload.buildFromClient(newClient), false)
      .pipe(
        take(1),
        switchMap((val) => {
          this.openSnackBar("successfuly created a client", "dismiss");

          // run get apps as a test
          return this.appleService.getAppleApps(String(newClient.orgId)).pipe(
            take(1),
            switchMap((val) => {
              const test = chain(val).get("apps.data").value();
              if (test.length > 0) {
                this.openSnackBar("successfully pulled client apps", "dismiss");

                const supportItem = new SupportItem();
                supportItem.description = ``;
                supportItem.userId = newClient.orgId;
                supportItem.username = newClient.orgDetails.emailAddresses[0];
                supportItem.subject = `we have accepted an invitation to your apple search ads account (⌐■_■) `;
                supportItem.orgId = String(newClient.orgDetails.orgId);
                supportItem.type = "onboarding";

                return this.supportService.postSupportItem(supportItem).pipe(
                  map((data) => {
                    this.isSendingResults = false;
                    this.openSnackBar("successfully emailed client", "dismiss");
                    return data;
                  }),
                  catchError(() => {
                    this.isSendingResults = false;
                    this.openSnackBar("unable to process right now", "dismiss");
                    return [];
                  })
                );
              }

              return of(false);
            }),
            catchError((err) => {
              this.isSendingResults = false;
              this.openSnackBar(
                "failed to to pulled client apps, check ouath values:::" +
                  get(val, "error", "error"),
                "dismiss"
              );
              return err;
            })
          );
        }),
        catchError((err) => {
          this.isSendingResults = false;
          this.openSnackBar("failed to create client", "dismiss");
          return err;
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

  onProfileClicked() {
    this.router.navigateByUrl("/workbench/account");
  }
  onLogoutClicked() {
    this.userAccountService.logout();
    this.router.navigateByUrl("/portal");
  }

  isShowingFirstProgressBar(): boolean {
    return this.isSendingResults && isNil(this.form1.get("publicKey").value);
  }

  isShowingSecondProgressBar(): boolean {
    return this.isSendingResults && !isNil(this.form1.get("publicKey").value);
  }
}
