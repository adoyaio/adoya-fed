import { UserAccount } from "../../../shared/models/user-account";
import { FormBuilder, FormControl } from "@angular/forms";
import { ClientService } from "./../../../core/services/client.service";
import { CostPerInstallDayObject } from "./../models/cost-per-install-day-object";
import { Component, OnInit, ViewChild, AfterViewInit } from "@angular/core";
import {
  MatTableDataSource,
  MatPaginator,
  MatSort,
  MatDatepickerInputEvent,
  MatDatepickerInput,
  MatDatepicker,
} from "@angular/material";
import {
  tap,
  merge,
  startWith,
  switchMap,
  map,
  catchError,
  combineAll,
  delay,
} from "rxjs/operators";
import { combineLatest } from "rxjs";
import { UserAccountService } from "src/app/core/services/user-account.service";
import { AppService } from "src/app/core/services/app.service";
import { KeywordDayObject } from "../models/keyword-day-object";

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
    "bid",
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
  keywordResultsLength = 0;
  keywordLength = 1000;

  isLoadingResults = true;
  orgId: string;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatDatepicker, { static: false }) endpicker: MatDatepicker<number>;
  @ViewChild(MatDatepicker, { static: false }) startpicker: MatDatepicker<
    number
  >;

  startPickerInputControl: FormControl = this.fb.control("");
  endPickerInputControl: FormControl = this.fb.control("");

  constructor(
    private clientService: ClientService,
    private fb: FormBuilder,
    private userAccountService: UserAccountService,
    private appService: AppService
  ) {}

  ngOnInit() {
    this.orgId = this.userAccountService
      .getCurrentUser()
      .UserAttributes.find((val) => {
        return val.Name === "custom:org_id";
      }).Value;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    this.clientService
      .getClientCostHistory(this.orgId, 1000)
      .pipe(
        map((data) => {
          // this.isLoadingResults = false;
          this.cpiHistory = CostPerInstallDayObject.buildFromGetHistoryResponse(
            data
          );
          this.dataSource.data = this.cpiHistory;
          this.paginator.length = this.cpiHistory.length;
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
      .getClientKeywordHistory(this.orgId, 10000)
      .pipe(
        map((data) => {
          this.isLoadingResults = false;
          this.keywordHistory = data;
          this.keywordDataSource.data = this.keywordHistory;
          // this.paginator.length = this.cpiHistory.length;
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
  }

  resetDateForms() {
    this.isLoadingResults = true;
    this.endPickerInputControl.reset();
    this.startPickerInputControl.reset();
    this.paginator.pageIndex = 0;
    this.sort.active = "timestamp";
    this.sort.direction = "desc";
    this.sort.sortChange.emit({ active: "timestamp", direction: "desc" });
    this.sort._stateChanges.next();

    this.clientService
      .getClientCostHistory(this.orgId, 1000)
      .pipe(
        map((data) => {
          this.cpiHistory = CostPerInstallDayObject.buildFromGetHistoryResponse(
            data
          );
          this.dataSource.data = this.cpiHistory;
          this.paginator.length = this.cpiHistory.length;
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
    this.sort.direction = "desc";
    this.sort.sortChange.emit({ active: "timestamp", direction: "desc" });
    this.sort._stateChanges.next();
    const start: Date = this.startPickerInputControl.value;
    const end: Date = this.endPickerInputControl.value;

    this.clientService
      .getClientHistoryByTime(
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
          this.paginator.length = this.cpiHistory.length;
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

  download() {
    this.appService.downloadFile(this.dataSource.data, "data");
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
