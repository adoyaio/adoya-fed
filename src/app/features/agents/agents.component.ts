import { Component, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { Router } from "@angular/router";

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

  clientForm = this.fb.group({
    objective: [""],
    cpi: [""],
  });

  ngOnInit() {
    this.userAccountService.browsingAsString = undefined;
    this.userAccountService.orgId = this.userAccountService.agentId;
    this.orgId = this.userAccountService.orgId;
    this.clientService
      .getClients(this.orgId)
      .pipe(
        take(1),
        tap((val) => {
          this.clients.next(Client.buildListFromResponse(val));
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
