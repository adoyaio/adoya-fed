import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl } from "@angular/forms";
import { Router } from "@angular/router";
import { chain } from "lodash";

import { BehaviorSubject, Observable, of } from "rxjs";
import { map, take, tap } from "rxjs/operators";
import { Client } from "src/app/core/models/client";
import { ClientService } from "src/app/core/services/client.service";
import { UserAccountService } from "src/app/core/services/user-account.service";

@Component({
  selector: "app-agents",
  templateUrl: "./agents.component.html",
  styleUrls: ["./agents.component.scss"],
})
export class AgentsComponent implements OnInit {
  constructor(
    private clientService: ClientService,
    public userAccountService: UserAccountService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  clients: BehaviorSubject<Array<Client>> = new BehaviorSubject([]);
  isLoadingResults = true;
  isSendingResults;
  orgId: string;

  clientForm = this.fb.group({});

  ngOnInit() {
    // reset context switching
    this.userAccountService.browsingAsString = undefined;
    this.userAccountService.orgId = this.userAccountService.agentId;

    this.orgId = this.userAccountService.orgId;
    this.clientService
      .getClients(this.orgId)
      .pipe(
        take(1),
        tap((val) => {
          this.clients.next(Client.buildListFromResponse(val));
          chain(val)
            .each((org) => {
              this.clientForm.addControl(
                "status" + org.orgId,
                new FormControl(org.orgDetails.isActiveClient)
              );
            })
            .value();
          this.isLoadingResults = false;
        })
      )
      .subscribe();
  }

  public hasNoClients(): Observable<boolean> {
    return this.clients.pipe(
      map((val) => {
        return val.length === 0;
      })
    );
  }

  undoDisabled() {}

  submitDisabled() {}
  submit() {}

  handleRegistration() {
    this.router.navigateByUrl("/registration");
  }

  contextSwitch(clientOrgId, appName) {
    this.userAccountService.orgId = clientOrgId;
    this.userAccountService.browsingAsString = appName;
    this.router.navigateByUrl("/workbench/optimizations");
  }
}
