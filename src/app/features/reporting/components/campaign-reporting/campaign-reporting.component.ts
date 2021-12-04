import { Component, OnInit, ViewChild } from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  Validators,
} from "@angular/forms";
import {
  MatChipList,
  MatPaginator,
  MatSort,
  MatTableDataSource,
} from "@angular/material";
import { chain, cloneDeep } from "lodash";
import { catchError, map, tap } from "rxjs/operators";
import { AppService } from "src/app/core/services/app.service";
import { ClientService } from "src/app/core/services/client.service";
import { UserAccountService } from "src/app/core/services/user-account.service";
import { CostPerInstallDayObject } from "../../models/cost-per-install-day-object";
import { ReportingService } from "../../reporting.service";

@Component({
  selector: "app-campaign-reporting",
  templateUrl: "./campaign-reporting.component.html",
  styleUrls: ["./campaign-reporting.component.scss"],
})
export class CampaignReportingComponent implements OnInit {
  cpiHistory: CostPerInstallDayObject[] = []; // TODO rm
  displayedColumns: string[] = [
    "timestamp",
    "spend",
    "installs",
    "cpi",
    "purchases",
    "revenue",
    "cpp",
    "revenueOverCost",
  ];

  dataSource = new MatTableDataSource<CostPerInstallDayObject>(this.cpiHistory);
  orgId: string;
  isAggregateDataVisMode = false;
  maxDate: Date = new Date();
  minDate: Date = new Date();

  campaignForm = this.fb.group({
    lookback: new FormControl(),
    startPickerInput: new FormControl(),
    endPickerInput: new FormControl(),
  });

  get startPickerControl(): AbstractControl {
    return this.campaignForm.get("startPickerInput");
  }

  get endPickerControl(): AbstractControl {
    return this.campaignForm.get("endPickerInput");
  }

  @ViewChild("aggregatePaginator", { static: false })
  aggregatePaginator: MatPaginator;

  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatChipList, { static: false })
  lineChartLabelChipList: MatChipList;

  constructor(
    private clientService: ClientService,
    private fb: FormBuilder,
    private userAccountService: UserAccountService,
    private appService: AppService,
    public reportingService: ReportingService
  ) {}

  ngOnInit() {
    this.reportingService.isLoadingCPI = true;
    this.minDate.setDate(this.minDate.getDate() - 2);
    this.maxDate.setDate(this.maxDate.getDate() - 1);

    this.orgId = this.userAccountService
      .getCurrentUser()
      .UserAttributes.find((val) => {
        return val.Name === "custom:org_id";
      }).Value;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.aggregatePaginator;

    this.clientService
      .getClientCostHistory(this.orgId, 1000)
      .pipe(
        map((data) => {
          this.reportingService.isLoadingCPI = false;
          this.cpiHistory =
            CostPerInstallDayObject.buildFromGetHistoryResponse(data);
          this.dataSource.data = this.cpiHistory;
          this.reportingService.costPerInstallDayObject$.next({
            ...this.cpiHistory,
          });
          this.aggregatePaginator.length = this.cpiHistory.length;
          return data;
        }),
        catchError(() => {
          this.reportingService.isLoadingCPI = false;
          return [];
        })
      )
      .subscribe();

    this.sort.sortChange
      .pipe(
        tap((val) => {
          this.cpiHistory.sort((a, b) => {
            if (val.active === "timestamp") {
              if (val.direction === "asc") {
                return a.timestamp < b.timestamp ? -1 : 1;
              }
              return a.timestamp > b.timestamp ? -1 : 1;
            }

            if (val.active === "spend") {
              if (val.direction === "asc") {
                return +a.spend - +b.spend;
              }
              return +b.spend - +a.spend;
            }

            if (val.active === "installs") {
              if (val.direction === "asc") {
                return +a.installs - +b.installs;
              }
              return +b.installs - +a.installs;
            }

            if (val.active === "cpi") {
              if (val.direction === "asc") {
                return +a.cpi - +b.cpi;
              }
              return +b.cpi - +a.cpi;
            }

            if (val.active === "purchases") {
              if (val.direction === "asc") {
                return a.purchases < b.purchases ? -1 : 1;
              }
              return a.purchases > b.purchases ? -1 : 1;
            }

            if (val.active === "revenue") {
              if (val.direction === "asc") {
                return a.revenue < b.revenue ? -1 : 1;
              }
              return a.revenue > b.revenue ? -1 : 1;
            }

            if (val.active === "cpp") {
              if (val.direction === "asc") {
                return a.cpp < b.cpp ? -1 : 1;
              }
              return a.cpp > b.cpp ? -1 : 1;
            }

            if (val.active === "revenueOverCost") {
              if (val.direction === "asc") {
                return a.revenueOverCost < b.revenueOverCost ? -1 : 1;
              }
              return a.revenueOverCost > b.revenueOverCost ? -1 : 1;
            }
          });
          this.dataSource.data = this.cpiHistory;
        })
      )
      .subscribe();
  }

  onChipClicked(updated) {
    const updatedLineChartLabel = cloneDeep(
      this.reportingService.activeLineChartLabel$.getValue()
    );

    chain(updatedLineChartLabel)
      .find((label) => {
        return label.name === updated.name;
      })
      .set("state", !updated.state)
      .value();

    this.reportingService.activeLineChartLabel$.next(updatedLineChartLabel);
  }

  showAggregateDataView() {
    this.isAggregateDataVisMode = true;
  }

  showAggregateTableView() {
    this.isAggregateDataVisMode = false;
  }

  resetDateForms() {
    this.reportingService.isLoadingCPI = true;
    this.startPickerControl.reset();
    this.endPickerControl.reset();
    this.aggregatePaginator.pageIndex = 0;
    this.sort.active = "timestamp";
    this.sort.direction = "asc";
    this.sort.sortChange.emit({ active: "timestamp", direction: "asc" });
    this.sort._stateChanges.next();

    this.clientService
      .getClientCostHistory(this.orgId, 2000)
      .pipe(
        map((data) => {
          this.cpiHistory =
            CostPerInstallDayObject.buildFromGetHistoryResponse(data);
          this.dataSource.data = this.cpiHistory;
          this.aggregatePaginator.length = this.cpiHistory.length;

          this.reportingService.costPerInstallDayObject$.next({
            ...this.cpiHistory,
          });

          this.reportingService.isLoadingCPI = false;
          return data;
        }),
        catchError(() => {
          this.reportingService.isLoadingCPI = false;
          return [];
        })
      )
      .subscribe();
  }

  filterByDate() {
    this.reportingService.isLoadingCPI = true;
    this.sort.active = "timestamp";
    this.sort.direction = "asc";
    this.sort.sortChange.emit({ active: "timestamp", direction: "asc" });
    this.sort._stateChanges.next();
    const start: Date = this.startPickerControl.value;
    const end: Date = this.endPickerControl.value;

    this.clientService
      .getClientCostHistoryByTime(
        this.orgId,
        start.toISOString().split("T")[0],
        end.toISOString().split("T")[0]
      )
      .pipe(
        map((data) => {
          this.cpiHistory =
            CostPerInstallDayObject.buildFromGetHistoryResponse(data);

          // JF TODO combine these
          this.dataSource.data = this.cpiHistory;
          this.reportingService.costPerInstallDayObject$.next({
            ...this.cpiHistory,
          });

          this.aggregatePaginator.length = this.cpiHistory.length;
          return data;
        }),
        tap(() => {
          this.reportingService.isLoadingCPI = false;
        })
      )
      .subscribe();
  }

  filterByDateDisabled() {
    if (this.startPickerControl.value && this.endPickerControl.value) {
      return false;
    }
    return true;
  }

  downloadAggregateCsv() {
    this.appService.downloadAggregateFile(this.dataSource.data, "aggregate");
  }
}
