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
import { chain, cloneDeep, isNumber } from "lodash";
import { catchError, map, switchMap, take, tap } from "rxjs/operators";
import { AppService } from "src/app/core/services/app.service";
import { ClientService } from "src/app/core/services/client.service";
import { UserAccountService } from "src/app/core/services/user-account.service";
import { CostPerInstallDayObject } from "../../models/cost-per-install-day-object";
import { ReportingService } from "../../reporting.service";

@Component({
  selector: "app-aggregate-reporting",
  templateUrl: "./aggregate-reporting.component.html",
  styleUrls: ["./aggregate-reporting.component.scss"],
})
export class AggregateReportingComponent implements OnInit {
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
  maxEndDate: Date = new Date();
  maxStartDate: Date = new Date();
  offsetKeys: string[] = ["init|init"]; // dynamo paging by key

  campaignForm = this.fb.group({
    lookback: new FormControl(),
    start: new FormControl(),
    end: new FormControl(),
  });

  get startPickerControl(): AbstractControl {
    return this.campaignForm.get("start");
  }

  get endPickerControl(): AbstractControl {
    return this.campaignForm.get("end");
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
    this.maxStartDate.setDate(this.maxStartDate.getDate() - 2);
    this.maxEndDate.setDate(this.maxEndDate.getDate() - 1);

    this.orgId = this.userAccountService.orgId;

    // this.orgId = this.userAccountService
    //   .getCurrentUser()
    //   .UserAttributes.find((val) => {
    //     return val.Name === "custom:org_id";
    //   }).Value;
  }

  ngAfterViewInit() {
    //this.dataSource.paginator = this.aggregatePaginator;

    this.clientService
      .getClientCostHistoryByTime(
        this.orgId,
        this.aggregatePaginator.pageSize,
        this.offsetKeys[this.aggregatePaginator.pageIndex],
        undefined,
        undefined
      )
      .pipe(
        take(1),
        map((data) => {
          this.reportingService.isLoadingCPI = false;
          this.cpiHistory = CostPerInstallDayObject.buildFromGetHistoryResponse(
            data["history"]
          );
          this.dataSource.data = this.cpiHistory;
          this.reportingService.costPerInstallDayObject$.next({
            ...this.cpiHistory,
          });

          this.offsetKeys.push(
            String(data["offset"]["org_id"]) +
              "|" +
              String(data["offset"]["timestamp"])
          );

          this.aggregatePaginator.length = data["count"];

          this.isAggregateDataVisMode = true;

          return data;
        }),
        catchError(() => {
          this.reportingService.isLoadingCPI = false;
          return [];
        })
      )
      .subscribe();

    this.aggregatePaginator.page
      .pipe(
        tap((val) => {
          this.reportingService.isLoadingCPI = true;
        }),
        switchMap((val) => {
          let offsetKey = this.offsetKeys[val.pageIndex];
          let start: Date = this.startPickerControl.value
            ? this.startPickerControl.value
            : "all";
          let end: Date = this.endPickerControl.value
            ? this.endPickerControl.value
            : "all";

          return this.clientService
            .getClientCostHistoryByTime(
              this.orgId,
              this.aggregatePaginator.pageSize,
              this.offsetKeys[this.aggregatePaginator.pageIndex],
              this.formatDate(start),
              this.formatDate(end)
            )
            .pipe(
              map((data) => {
                this.reportingService.isLoadingCPI = false;
                this.cpiHistory =
                  CostPerInstallDayObject.buildFromGetHistoryResponse(
                    data["history"]
                  );
                this.dataSource.data = this.cpiHistory;
                this.reportingService.costPerInstallDayObject$.next({
                  ...this.cpiHistory,
                });

                if (val.pageIndex > val.previousPageIndex) {
                  this.offsetKeys.push(
                    String(data["offset"]["org_id"]) +
                      "|" +
                      String(data["offset"]["timestamp"])
                  );
                }

                this.aggregatePaginator.length = data["count"];

                return data;
              }),
              catchError(() => {
                this.reportingService.isLoadingCPI = false;
                return [];
              })
            );
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

  formatDate(date) {
    if (!isNumber(date) && date === "all") {
      return date;
    }
    let d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
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
    this.offsetKeys = ["init|init"];
    // this.sort.active = "timestamp";
    // this.sort.direction = "asc";
    // this.sort.sortChange.emit({ active: "timestamp", direction: "asc" });
    // this.sort._stateChanges.next();

    this.clientService
      .getClientCostHistoryByTime(
        this.orgId,
        this.aggregatePaginator.pageSize,
        this.offsetKeys[this.aggregatePaginator.pageIndex],
        undefined,
        undefined
      )
      .pipe(
        map((data) => {
          this.cpiHistory = CostPerInstallDayObject.buildFromGetHistoryResponse(
            data["history"]
          );
          this.dataSource.data = this.cpiHistory;
          this.aggregatePaginator.length = data["count"];
          this.reportingService.isLoadingCPI = false;

          this.reportingService.costPerInstallDayObject$.next({
            ...this.cpiHistory,
          });

          this.offsetKeys.push(
            String(data["offset"]["org_id"]) +
              "|" +
              String(data["offset"]["timestamp"])
          );

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
    // this.sort.active = "timestamp";
    // this.sort.direction = "asc";
    // this.sort.sortChange.emit({ active: "timestamp", direction: "asc" });
    // this.sort._stateChanges.next();
    const start: Date = this.startPickerControl.value;
    const end: Date = this.endPickerControl.value;
    this.aggregatePaginator.pageIndex = 0;
    this.offsetKeys = ["init|init"];
    this.clientService
      .getClientCostHistoryByTime(
        this.orgId,
        this.aggregatePaginator.pageSize,
        this.offsetKeys[this.aggregatePaginator.pageIndex],
        start.toISOString().split("T")[0],
        end.toISOString().split("T")[0]
      )
      .pipe(
        map((data) => {
          this.cpiHistory = CostPerInstallDayObject.buildFromGetHistoryResponse(
            data["history"]
          );

          // JF TODO combine these
          this.dataSource.data = this.cpiHistory;
          this.reportingService.costPerInstallDayObject$.next({
            ...this.cpiHistory,
          });
          this.aggregatePaginator.length = data["count"];
          // TODO

          this.offsetKeys.push(
            String(data["offset"]["org_id"]) +
              "|" +
              String(data["offset"]["timestamp"])
          );

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
