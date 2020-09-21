import { Component, OnInit, ViewChild } from "@angular/core";
import { ClientService } from "src/app/core/services/client.service";
import { FormBuilder, FormControl } from "@angular/forms";
import { UserAccountService } from "src/app/core/services/user-account.service";
import { AppService } from "src/app/core/services/app.service";
import { ReportingService } from "../../reporting.service";
import { map, catchError, delay, tap, switchMap, take } from "rxjs/operators";
import { MatTableDataSource, MatPaginator, MatSort } from "@angular/material";
import { KeywordDayObject } from "../../models/keyword-day-object";
import {
  get as _get,
  isEmpty as _isEmpty,
  cloneDeep as _cloneDeep,
  chain as _chain,
  each as _each,
  reduce as _reduce,
  filter as _filter,
  sortBy as _sortBy,
} from "lodash";
import { ChartMetricObject } from "../../models/chart-label-object";
import { KeywordAggregatedObject } from "../../models/keyword-aggregated-object";

@Component({
  selector: "app-keyword-reporting",
  templateUrl: "./keyword-reporting.component.html",
  styleUrls: ["./keyword-reporting.component.scss"],
})
export class KeywordReportingComponent implements OnInit {
  displayedKeywordColumns: string[] = [
    "date",
    "keyword_id",
    "keyword",
    "matchType",
    "keywordStatus",
    "keywordDisplayStatus",
    "local_spend",
    "installs",
    "avg_cpa",
  ];

  displayedAggregatedKeywordColumns: string[] = [
    "keyword",
    "installs",
    "avg_cpa",
    "local_spend",
  ];

  keywordDataSource = new MatTableDataSource<KeywordDayObject>([]);
  keywordAggregatedDataSource = new MatTableDataSource<KeywordAggregatedObject>(
    []
  );

  keywordOffsetKeys: string[] = ["init|init|init"]; // dynamo paging by key
  orgId: string;
  isKeywordDataVisMode = false;
  isKeywordAggDataVisMode = false;

  maxDate: Date;
  minDate: Date;

  keywordFilterForm = this.fb.group({
    start: [""],
    end: [""],
    keywordStatus: ["all"],
    matchType: ["all"],
  });

  @ViewChild("keywordsPaginator", { static: false })
  keywordsPaginator: MatPaginator;

  @ViewChild(MatSort, { static: false }) sort: MatSort;

  constructor(
    private clientService: ClientService,
    private fb: FormBuilder,
    private userAccountService: UserAccountService,
    private appService: AppService,
    public reportingService: ReportingService
  ) {}

  ngOnInit() {
    this.minDate = new Date();
    this.maxDate = new Date();
    this.minDate.setDate(this.minDate.getDate() - 2);
    this.maxDate.setDate(this.maxDate.getDate() - 1);

    this.keywordFilterForm.get("start").setValue(this.minDate);
    this.keywordFilterForm.get("end").setValue(this.maxDate);

    this.orgId = this.userAccountService
      .getCurrentUser()
      .UserAttributes.find((val) => {
        return val.Name === "custom:org_id";
      }).Value;
  }

  ngAfterViewInit() {
    let start: Date = this.keywordFilterForm.get("start").value;
    let end: Date = this.keywordFilterForm.get("end").value;
    this.clientService
      .getClientKeywordHistory(
        this.orgId,
        this.keywordsPaginator.pageSize,
        this.keywordOffsetKeys[this.keywordsPaginator.pageIndex],
        this.formatDate(start),
        this.formatDate(end),
        "all",
        "all"
      )
      .pipe(
        take(1),
        map((data) => {
          this.reportingService.isLoadingKeywords = false;

          this.keywordOffsetKeys.push(
            String(data["offset"]["org_id"]) +
              "|" +
              String(data["offset"]["keyword_id"]) +
              "|" +
              String(data["offset"]["date"])
          );
          this.keywordDataSource.data = data["history"];
          this.keywordsPaginator.length = data["count"];

          // set line graph
          this.reportingService.keywordDayObject$.next(data["history"]);

          // set table
          this.keywordAggregatedDataSource.data = this.getAggregateDataForTable(
            data["history"]
          );

          return data;
        }),
        catchError(() => {
          this.reportingService.isLoadingKeywords = false;
          return [];
        })
      )
      .subscribe();

    this.keywordsPaginator.page
      .pipe(
        delay(0),
        tap((val) => {
          this.reportingService.isLoadingKeywords = true;
        }),
        switchMap((val) => {
          let keywordOffsetKey = this.keywordOffsetKeys[val.pageIndex];
          let start: Date = this.keywordFilterForm.get("start").value;
          let end: Date = this.keywordFilterForm.get("end").value;
          const keywordStatus: string = this.keywordFilterForm.get(
            "keywordStatus"
          ).value;
          const matchType: string = this.keywordFilterForm.get("matchType")
            .value;

          return this.clientService
            .getClientKeywordHistory(
              this.orgId,
              this.keywordsPaginator.pageSize,
              keywordOffsetKey,
              this.formatDate(start),
              this.formatDate(end),
              matchType,
              keywordStatus
            )
            .pipe(
              map((data) => {
                this.reportingService.isLoadingKeywords = false;

                // handle dynamo paging
                if (val.pageIndex > val.previousPageIndex) {
                  this.keywordOffsetKeys.push(
                    String(data["offset"]["org_id"]) +
                      "|" +
                      String(data["offset"]["keyword_id"]) +
                      "|" +
                      String(data["offset"]["date"])
                  );

                  // items per page change
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
                this.keywordDataSource.data = data["history"];
                this.keywordsPaginator.length = data["count"];
              }),
              catchError(() => {
                this.reportingService.isLoadingKeywords = false;
                return [];
              })
            );
        })
      )
      .subscribe();

    this.keywordAggregatedDataSource.sort = this.sort;
  }

  formatDate(date) {
    let d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  }

  applyFilter() {
    this.reportingService.isLoadingKeywords = true;
    this.keywordsPaginator.pageIndex = 0;
    this.keywordOffsetKeys = ["init|init|init"];

    let start: Date = this.keywordFilterForm.get("start").value;
    let end: Date = this.keywordFilterForm.get("end").value;

    const keywordStatus: string = this.keywordFilterForm.get("keywordStatus")
      .value;
    const matchType: string = this.keywordFilterForm.get("matchType").value;

    // get table view data with page of records
    this.clientService
      .getClientKeywordHistory(
        this.orgId,
        this.keywordsPaginator.pageSize,
        this.keywordOffsetKeys[this.keywordsPaginator.pageIndex],
        this.formatDate(start),
        this.formatDate(end),
        matchType,
        keywordStatus
      )
      .pipe(
        switchMap((data) => {
          this.keywordOffsetKeys.push(
            String(data["offset"]["org_id"]) +
              "|" +
              String(data["offset"]["keyword_id"]) +
              "|" +
              String(data["offset"]["date"])
          );
          this.keywordDataSource.data = data["history"];
          this.keywordsPaginator.length = data["count"];

          return this.clientService
            .getClientKeywordHistory(
              this.orgId,
              1000000000,
              this.keywordOffsetKeys[0],
              this.formatDate(start),
              this.formatDate(end),
              matchType,
              keywordStatus
            )
            .pipe(
              map((data) => {
                this.reportingService.isLoadingKeywords = false;

                // set line graph
                const history: KeywordDayObject[] = data["history"];
                this.reportingService.keywordDayObject$.next(history);

                // set table
                this.keywordAggregatedDataSource.data = this.getAggregateDataForTable(
                  data["history"]
                );

                return data;
              })
            );
        }),
        take(1),
        catchError(() => {
          this.reportingService.isLoadingKeywords = false;
          return [];
        })
      )
      .subscribe();
  }

  resetKeywordFilters() {
    this.reportingService.isLoadingKeywords = true;
    this.keywordsPaginator.pageIndex = 0;
    this.keywordsPaginator.pageSize = 100;
    this.keywordOffsetKeys = ["init|init|init"];
    this.keywordFilterForm.get("start").setValue(this.minDate);
    this.keywordFilterForm.get("end").setValue(this.maxDate);
    this.keywordFilterForm.get("keywordStatus").setValue("all");
    this.keywordFilterForm.get("matchType").setValue("all");

    let start: Date = this.keywordFilterForm.get("start").value;
    let end: Date = this.keywordFilterForm.get("end").value;

    const keywordStatus: string = this.keywordFilterForm.get("keywordStatus")
      .value;
    const matchType: string = this.keywordFilterForm.get("matchType").value;

    // get table view data with page of records
    this.clientService
      .getClientKeywordHistory(
        this.orgId,
        this.keywordsPaginator.pageSize,
        this.keywordOffsetKeys[this.keywordsPaginator.pageIndex],
        this.formatDate(start),
        this.formatDate(end),
        matchType,
        keywordStatus
      )
      .pipe(
        switchMap((data) => {
          this.keywordOffsetKeys.push(
            String(data["offset"]["org_id"]) +
              "|" +
              String(data["offset"]["keyword_id"]) +
              "|" +
              String(data["offset"]["date"])
          );
          this.keywordDataSource.data = data["history"];
          this.keywordsPaginator.length = data["count"];

          return this.clientService
            .getClientKeywordHistory(
              this.orgId,
              1000000000,
              this.keywordOffsetKeys[0],
              this.formatDate(start),
              this.formatDate(end),
              matchType,
              keywordStatus
            )
            .pipe(
              map((data) => {
                this.reportingService.isLoadingKeywords = false;

                // set line graph
                const history: KeywordDayObject[] = data["history"];
                this.reportingService.keywordDayObject$.next(history);

                // set table
                this.keywordAggregatedDataSource.data = this.getAggregateDataForTable(
                  data["history"]
                );

                return data;
              })
            );
        }),
        take(1),
        catchError(() => {
          this.reportingService.isLoadingKeywords = false;
          return [];
        })
      )
      .subscribe();
  }

  applyFilterDisabled() {
    return !this.keywordFilterForm.valid;
  }

  downloadKeywordsCsv() {
    this.appService.downloadKeywordFile(this.keywordDataSource.data, "keyword");
  }

  getAggregateDataForTable(
    currentData: KeywordDayObject[]
  ): KeywordAggregatedObject[] {
    // build list of keywords
    const history: KeywordAggregatedObject[] = [];
    let kws = [];
    kws = _chain(currentData)
      .uniqBy("keyword")
      .map((keyword) => {
        return keyword.keyword;
      })
      .value();

    _each(kws, (keyword) => {
      // pull all kw's for the date and summarize for the dataline
      const valuesForADay = _filter(currentData, (line) => {
        if (line.keyword === keyword) {
          return true;
        }
      });

      const local_spend = _reduce(
        valuesForADay,
        (acc, day) => {
          const val = _get(day, "local_spend");
          return +val + acc;
        },
        0.0
      );

      const installs = _reduce(
        valuesForADay,
        (acc, day) => {
          const val = _get(day, "installs");
          return +val + acc;
        },
        0.0
      );

      const cpi = +local_spend / +installs;

      const kw: KeywordAggregatedObject = {
        keyword: keyword,
        avg_cpa: cpi,
        local_spend: local_spend,
        installs: installs,
      };

      history.push(kw);
    });
    return history;
  }

  showAggregateDataView() {
    this.isKeywordAggDataVisMode = true;
    this.isKeywordDataVisMode = false;
    this.keywordAggregatedDataSource.data = this.getAggregateDataForTable(
      this.reportingService.keywordDayObject$.getValue()
    );
  }

  showDataView() {
    this.isKeywordDataVisMode = true;
    this.isKeywordAggDataVisMode = false;
    this.reportingService.isLoadingKeywords = true;
    this.keywordsPaginator.pageIndex = 0;
    this.keywordOffsetKeys = ["init|init|init"];

    let start: Date = this.keywordFilterForm.get("start").value;
    let end: Date = this.keywordFilterForm.get("end").value;

    const keywordStatus: string = this.keywordFilterForm.get("keywordStatus")
      .value;
    const matchType: string = this.keywordFilterForm.get("matchType").value;

    this.clientService
      .getClientKeywordHistory(
        this.orgId,
        1000000,
        this.keywordOffsetKeys[this.keywordsPaginator.pageIndex],
        this.formatDate(start),
        this.formatDate(end),
        matchType,
        keywordStatus
      )
      .pipe(
        map((data) => {
          this.reportingService.isLoadingKeywords = false;
          // this.keywordHistory = data["history"];

          this.keywordOffsetKeys.push(
            String(data["offset"]["org_id"]) +
              "|" +
              String(data["offset"]["keyword_id"]) +
              "|" +
              String(data["offset"]["date"])
          );
          this.keywordDataSource.data = data["history"];
          this.keywordsPaginator.length = data["count"];
          // set line graph
          this.reportingService.keywordDayObject$.next(data["history"]);
          return data;
        }),
        catchError(() => {
          this.reportingService.isLoadingKeywords = false;
          return [];
        })
      )
      .subscribe();
  }

  showTableView() {
    this.isKeywordDataVisMode = false;
    this.isKeywordAggDataVisMode = false;
    this.reportingService.isLoadingKeywords = true;
    this.keywordsPaginator.pageIndex = 0;
    this.keywordsPaginator.pageSize = 100;
    this.keywordOffsetKeys = ["init|init|init"];

    let start: Date = this.keywordFilterForm.get("start").value;
    let end: Date = this.keywordFilterForm.get("end").value;
    let numRecs = 0;
    if (this.isKeywordDataVisMode) {
      numRecs = 10000000000000;
    } else {
      numRecs = this.keywordsPaginator.pageSize;
    }

    const keywordStatus: string = this.keywordFilterForm.get("keywordStatus")
      .value;
    const matchType: string = this.keywordFilterForm.get("matchType").value;

    this.clientService
      .getClientKeywordHistory(
        this.orgId,
        numRecs,
        this.keywordOffsetKeys[this.keywordsPaginator.pageIndex],
        this.formatDate(start),
        this.formatDate(end),
        matchType,
        keywordStatus
      )
      .pipe(
        map((data) => {
          this.reportingService.isLoadingKeywords = false;
          this.keywordOffsetKeys.push(
            String(data["offset"]["org_id"]) +
              "|" +
              String(data["offset"]["keyword_id"]) +
              "|" +
              String(data["offset"]["date"])
          );
          this.keywordDataSource.data = data["history"];
          this.keywordsPaginator.length = data["count"];
          // set line graph
          this.reportingService.keywordDayObject$.next(data["history"]);
          return data;
        }),
        catchError(() => {
          this.reportingService.isLoadingKeywords = false;
          return [];
        })
      )
      .subscribe();
  }

  onChipClicked(updated: ChartMetricObject) {
    const updatedLineChartMetric = _cloneDeep(
      this.reportingService.activeKeywordLineChartMetric$.getValue()
    );

    _chain(updatedLineChartMetric)
      .find((metric) => {
        return metric.state === true;
      })
      .set("state", false)
      .value();

    _chain(updatedLineChartMetric)
      .find((metric) => {
        return metric.name === updated.name;
      })
      .set("state", !updated.state)
      .value();

    this.reportingService.activeKeywordLineChartMetric$.next(
      updatedLineChartMetric
    );
  }

  hideLegend() {}
}
