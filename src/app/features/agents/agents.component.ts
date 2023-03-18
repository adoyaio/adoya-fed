import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormControl } from "@angular/forms";
import { MatAccordion, MatSnackBar } from "@angular/material";
import { Router } from "@angular/router";
import { chain } from "lodash";

import { BehaviorSubject, forkJoin, Observable, of } from "rxjs";
import { filter, map, switchMap, take, tap } from "rxjs/operators";
import { Client } from "src/app/core/models/client";
import { ClientPayload } from "src/app/core/models/client-payload";
import { AppService } from "src/app/core/services/app.service";
import { ClientService } from "src/app/core/services/client.service";
import { UserAccountService } from "src/app/core/services/user-account.service";

@Component({
  selector: "app-agents",
  templateUrl: "./agents.component.html",
  styleUrls: ["./agents.component.scss"],
})
export class AgentsComponent implements OnInit {
  @ViewChild(MatAccordion, { static: false }) accordion: MatAccordion;
  constructor(
    private clientService: ClientService,
    public userAccountService: UserAccountService,
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    public appService: AppService
  ) {}

  // clients: BehaviorSubject<Array<Client>> = new BehaviorSubject([]);
  isLoadingResults;
  isSendingResults;
  orgId: string;

  clientForm = this.fb.group({});

  ngOnInit() {
    // reset context switching
    this.userAccountService.browsingAsString = undefined;
    this.userAccountService.orgId = this.userAccountService.agentId;

    if (!this.appService.isAgentsInitialized) {
      this.isLoadingResults = true;
      this.orgId = this.userAccountService.orgId;
      this.clientService
        .getClients(this.orgId)
        .pipe(
          take(1),

          tap((val: Client[]) => {
            const filteredValues = val.filter(
              (client) => client.orgDetails.hasRegistered
            );
            this.appService.apps$.next(
              Client.buildListFromResponse(filteredValues)
            );
            chain(val)
              .each((org) => {
                this.clientForm.addControl(
                  org.orgId,
                  new FormControl(org.orgDetails.isActiveClient)
                );
              })
              .value();
            this.isLoadingResults = false;
            this.appService.isAgentsInitialized = true;
          })
        )
        .subscribe();
    } else {
      this.appService.apps$
        .pipe(
          tap((val: Client[]) => {
            chain(val)
              .each((org) => {
                this.clientForm.addControl(
                  org.orgId,
                  new FormControl(org.orgDetails.isActiveClient)
                );
              })
              .value();
            this.isLoadingResults = false;
          })
        )
        .subscribe();
    }
  }

  public hasNoClients(): Observable<boolean> {
    return this.appService.apps$.pipe(
      map((val) => {
        return val.length === 0;
      })
    );
  }

  undoDisabled() {
    return (
      this.clientForm.pristine || this.isLoadingResults || this.isSendingResults
    );
  }

  submitDisabled() {
    return (
      this.clientForm.pristine || this.isLoadingResults || this.isSendingResults
    );
  }
  submit() {
    this.isSendingResults = true;
    this.appService.apps$
      .pipe(
        take(1),
        switchMap((clients) => {
          const clientCalls = chain(this.clientForm)
            .get("controls")
            .keys()
            .filter((control) => {
              return this.clientForm.get(control).dirty;
            })
            .map((changedClientId) => {
              const isActive = this.clientForm.get(changedClientId).value;

              const newClient = clients.find(
                (client) => client.orgId === changedClientId
              );

              newClient.orgDetails.isActiveClient = isActive;

              return this.clientService.postClient(
                ClientPayload.buildFromClient(newClient),
                false
              );
            })
            .value();

          return forkJoin(clientCalls).pipe(
            take(1),
            switchMap((val) => {
              return this.clientService.getClients(this.orgId).pipe(
                take(1),
                tap((val) => {
                  this.clientForm.markAsPristine();
                  this.accordion.closeAll();
                  this.isSendingResults = false;
                  this.openSnackBar(
                    "successfully updated your applications",
                    ""
                  );
                })
              );
            })
          );
        })
      )
      .subscribe();
  }

  onResetForm() {
    this.isLoadingResults = true;
    return this.clientService
      .getClients(this.orgId)
      .pipe(
        take(1),
        tap((val) => {
          chain(val)
            .filter((val) => val.orgDetails.hasRegistered)
            .each((org) => {
              this.clientForm
                .get(org.orgId)
                .setValue(org.orgDetails.isActiveClient);
            })
            .value();
          this.clientForm.markAsPristine();
          this.accordion.closeAll();
          this.isLoadingResults = false;
        })
      )
      .subscribe();
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 10000,
      panelClass: "standard",
    });
  }

  handleRegistration() {
    this.router.navigateByUrl("/registration");
  }

  isClientDirty(client) {
    return this.clientForm.get(client.orgId).dirty;
  }

  // contextSwitch(clientOrgId, appName) {
  //   this.userAccountService.orgId = clientOrgId;
  //   this.userAccountService.browsingAsString = appName;
  //   // TODO set local storate
  //   this.router.navigateByUrl("/workbench/optimizations");
  // }
}
