import { FormBuilder, FormControl } from "@angular/forms";
import { ClientService } from "../../../../core/services/client.service";
import { CostPerInstallDayObject } from "../../models/cost-per-install-day-object";
import { Component, OnInit, ViewChild, AfterViewInit } from "@angular/core";
import {
  MatTableDataSource,
  MatPaginator,
  MatSort,
  MatChipList,
} from "@angular/material";
import { tap, map, catchError } from "rxjs/operators";
import { UserAccountService } from "src/app/core/services/user-account.service";
import { AppService } from "src/app/core/services/app.service";
import { ReportingService } from "../../reporting.service";
import {
  chain as _chain,
  includes as _includes,
  each as _each,
  map as _map,
  clone as _clone,
  cloneDeep as _cloneDeep,
} from "lodash";

@Component({
  selector: "app-reporting",
  templateUrl: "./reporting.component.html",
  styleUrls: ["./reporting.component.scss"],
})
export class ReportingComponent {
  constructor(
    private clientService: ClientService,
    private fb: FormBuilder,
    private userAccountService: UserAccountService,
    private appService: AppService,
    public reportingService: ReportingService
  ) {}
}
