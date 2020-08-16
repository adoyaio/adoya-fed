import { UserAccount } from "../../../../shared/models/user-account";
import { FormBuilder, FormControl } from "@angular/forms";
import { ClientService } from "../../../../core/services/client.service";
import { CostPerInstallDayObject } from "../../models/cost-per-install-day-object";
import { Component, OnInit, ViewChild, AfterViewInit } from "@angular/core";
import {
  MatTableDataSource,
  MatPaginator,
  MatSort,
  MatDatepickerInputEvent,
  MatDatepickerInput,
  MatDatepicker,
  MatChipList,
  MatChipSelectionChange,
} from "@angular/material";
import { tap, switchMap, map, catchError, delay } from "rxjs/operators";
import { combineLatest, Observable, of } from "rxjs";
import { UserAccountService } from "src/app/core/services/user-account.service";
import { AppService } from "src/app/core/services/app.service";
import { KeywordDayObject } from "../../models/keyword-day-object";
import { LineChartComponent } from "../line-chart/line-chart.component";
import { ReportingService } from "../../reporting.service";
import {
  chain as _chain,
  includes as _includes,
  each as _each,
  map as _map,
  clone as _clone,
  cloneDeep as _cloneDeep,
} from "lodash";
import { state } from "@angular/animations";

@Component({
  selector: "app-reporting",
  templateUrl: "./reporting.component.html",
  styleUrls: ["./reporting.component.scss"],
})
export class ReportingComponent implements AfterViewInit, OnInit {
  cpiHistory: CostPerInstallDayObject[] = [];
  keywordHistory: KeywordDayObject[] = [];
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

  displayedKeywordColumns: string[] = [
    "date",
    "keyword_id",
    "keyword",
    "matchType",
    "keywordDisplayStatus",
    "local_spend",
    "installs",
    "avg_cpa",
  ];
  dataSource = new MatTableDataSource<CostPerInstallDayObject>(this.cpiHistory);
  resultsLength = 0;
  length = 365;

  keywordDataSource = new MatTableDataSource<KeywordDayObject>(
    this.keywordHistory
  );

  keywordOffsetKeys: string[] = ["init|init|init"]; // hack for dynamo paging by key
  isLoadingResults = true;
  orgId: string;
  isAggregateDataVisMode = false;
  isKeywordDataVisMode = false;

  @ViewChild("aggregatePaginator", { static: false })
  aggregatePaginator: MatPaginator;

  @ViewChild("keywordsPaginator", { static: false })
  keywordsPaginator: MatPaginator;

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  // @ViewChild(MatDatepicker, { static: false }) endpicker: MatDatepicker<number>;
  // @ViewChild(MatDatepicker, { static: false }) startpicker: MatDatepicker<
  //   number
  // >;
  @ViewChild(MatChipList, { static: false })
  lineChartLabelChipList: MatChipList;

  startPickerInputControl: FormControl = this.fb.control("");
  endPickerInputControl: FormControl = this.fb.control("");

  constructor(
    private clientService: ClientService,
    private fb: FormBuilder,
    private userAccountService: UserAccountService,
    private appService: AppService,
    public reportingService: ReportingService
  ) {}

  ngOnInit() {
    this.orgId = this.userAccountService
      .getCurrentUser()
      .UserAttributes.find((val) => {
        return val.Name === "custom:org_id";
      }).Value;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.aggregatePaginator;

    // aggregate history load
    this.clientService
      .getClientCostHistory(this.orgId, 1000)
      .pipe(
        map((data) => {
          // this.isLoadingResults = false;
          this.cpiHistory = CostPerInstallDayObject.buildFromGetHistoryResponse(
            data
          );
          this.dataSource.data = this.cpiHistory;
          this.reportingService.costPerInstallDayObject$.next({
            ...this.cpiHistory,
          });
          this.aggregatePaginator.length = this.cpiHistory.length;
          return data;
        }),
        catchError(() => {
          this.isLoadingResults = false;
          return [];
        })
      )
      .subscribe();

    // keyword history load
    this.clientService
      .getClientKeywordHistory(
        this.orgId,
        this.keywordsPaginator.pageSize,
        this.keywordOffsetKeys[this.keywordsPaginator.pageIndex]
      )
      .pipe(
        map((data) => {
          this.isLoadingResults = false;
          this.keywordHistory = data["history"];
          this.keywordOffsetKeys.push(
            String(data["offset"]["org_id"]) +
              "|" +
              String(data["offset"]["keyword_id"]) +
              "|" +
              String(data["offset"]["date"])
          );
          this.keywordDataSource.data = this.keywordHistory;
          this.keywordsPaginator.length = data["count"];
          return data;
        }),
        catchError(() => {
          this.isLoadingResults = false;
          return [];
        })
      )
      .subscribe();

    this.sort.sortChange
      .pipe(
        delay(0),
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

    this.keywordsPaginator.page
      .pipe(
        delay(0),
        tap((val) => {
          this.isLoadingResults = true;
        }),
        switchMap((val) => {
          let keywordOffsetKey = this.keywordOffsetKeys[val.pageIndex];
          return this.clientService
            .getClientKeywordHistory(
              this.orgId,
              this.keywordsPaginator.pageSize,
              keywordOffsetKey
            )
            .pipe(
              map((data) => {
                this.isLoadingResults = false;
                this.keywordHistory = data["history"];

                //
                if (val.pageIndex > val.previousPageIndex) {
                  this.keywordOffsetKeys.push(
                    String(data["offset"]["org_id"]) +
                      "|" +
                      String(data["offset"]["keyword_id"]) +
                      "|" +
                      String(data["offset"]["date"])
                  );
                } else if (val.pageIndex == val.previousPageIndex) {
                  this.keywordOffsetKeys = ["init|init|init"];
                  this.keywordOffsetKeys.push(
                    String(data["offset"]["org_id"]) +
                      "|" +
                      String(data["offset"]["keyword_id"]) +
                      "|" +
                      String(data["offset"]["date"])
                  );
                }
                this.keywordDataSource.data = this.keywordHistory;
                this.keywordsPaginator.length = data["count"];
                return data;
              }),
              catchError(() => {
                this.isLoadingResults = false;
                return [];
              })
            );
        })
      )
      .subscribe();
  }

  onChipClicked(updated) {
    const updatedLineChartLabel = _cloneDeep(
      this.reportingService.activeLineChartLabel$.getValue()
    );

    _chain(updatedLineChartLabel)
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

  resetKeywordFilters() {
    // this.keywordsPaginator.pageIndex = 0;
    // this.keywordsPaginator.pageSize = 100;
    // this.keywordOffsetKeys = ["init|init|init"];
    // this.clientService
    //   .getClientKeywordHistory(
    //     this.orgId,
    //     this.keywordsPaginator.pageSize,
    //     this.keywordOffsetKeys[this.keywordsPaginator.pageIndex]
    //   )
    //   .pipe(
    //     map((data) => {
    //       this.isLoadingResults = false;
    //       this.keywordHistory = data["history"];
    //       this.keywordOffsetKeys.push(
    //         String(data["offset"]["org_id"]) +
    //           "|" +
    //           String(data["offset"]["keyword_id"]) +
    //           "|" +
    //           String(data["offset"]["date"])
    //       );
    //       this.keywordDataSource.data = this.keywordHistory;
    //       this.keywordsPaginator.length = data["count"];
    //       return data;
    //     }),
    //     catchError(() => {
    //       this.isLoadingResults = false;
    //       return [];
    //     })
    //   )
    //   .subscribe();
  }

  resetDateForms() {
    this.isLoadingResults = true;
    this.endPickerInputControl.reset();
    this.startPickerInputControl.reset();
    this.aggregatePaginator.pageIndex = 0;
    this.sort.active = "timestamp";
    this.sort.direction = "asc";
    this.sort.sortChange.emit({ active: "timestamp", direction: "asc" });
    this.sort._stateChanges.next();

    this.clientService
      .getClientCostHistory(this.orgId, 2000)
      .pipe(
        map((data) => {
          this.cpiHistory = CostPerInstallDayObject.buildFromGetHistoryResponse(
            data
          );
          this.dataSource.data = this.cpiHistory;
          this.aggregatePaginator.length = this.cpiHistory.length;

          this.reportingService.costPerInstallDayObject$.next({
            ...this.cpiHistory,
          });

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

  filterByDate() {
    this.isLoadingResults = true;
    this.sort.active = "timestamp";
    this.sort.direction = "asc";
    this.sort.sortChange.emit({ active: "timestamp", direction: "asc" });
    this.sort._stateChanges.next();
    const start: Date = this.startPickerInputControl.value;
    const end: Date = this.endPickerInputControl.value;

    this.clientService
      .getClientCostHistoryByTime(
        this.orgId,
        start.toISOString().split("T")[0],
        end.toISOString().split("T")[0]
      )
      .pipe(
        map((data) => {
          this.cpiHistory = CostPerInstallDayObject.buildFromGetHistoryResponse(
            data
          );

          this.dataSource.data = this.cpiHistory;
          this.reportingService.costPerInstallDayObject$.next({
            ...this.cpiHistory,
          });

          this.aggregatePaginator.length = this.cpiHistory.length;
          return data;
        }),
        tap((data) => {
          this.isLoadingResults = false;
        })
      )
      .subscribe();
  }

  filterByDateDisabled() {
    if (
      this.endPickerInputControl.value &&
      this.startPickerInputControl.value
    ) {
      return false;
    }
    return true;
  }

  downloadAggregateCsv() {
    this.appService.downloadAggregateFile(this.dataSource.data, "aggregate");
  }

  downloadKeywordsCsv() {
    this.appService.downloadKeywordFile(this.keywordDataSource.data, "keyword");
  }

  // addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
  //   const date: Date = event.value;
  //   date.setSeconds(0);
  //   date.setMilliseconds(0);
  //   date.setHours(0);
  //   console.log(date.toISOString().split("T")[0]);
  // }

  // ngAfterViewInit() {
  //   //this.setupDataModel();
  //   this.clientService
  //     .getClientHistory("1056410")
  //     .pipe(
  //       tap((response) => {
  //         console.log("ngOnInit" + response);
  //         this.cpiHistory = CostPerInstallDayObject.buildFromGetHistoryResponse(
  //           response
  //         );
  //       })
  //     )
  //     .subscribe();
  //   this.dataSource.paginator = this.paginator;

  // this.dataSource
  //   .connect()
  //   .pipe(
  //     map((data) => {
  //       console.log("found data of length" + data.length);
  //     })
  //   )
  //   .subscribe();
  // }

  // setupDataModel() {
  //   for (let i = 0; i < 365; i++) {
  //     const cpiObject = new CostPerInstallDayObject();
  //     cpiObject.cpi = 0.35;
  //     cpiObject.installs = 6;
  //     cpiObject.org_id = "1105630";
  //     cpiObject.spend = 2.1;
  //     cpiObject.timestamp = new Date(Date.now()).toDateString();
  //     this.cpiHistory.push(cpiObject);
  //   }
  // }
}