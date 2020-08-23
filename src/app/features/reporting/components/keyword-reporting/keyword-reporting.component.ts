import { Component, OnInit, ViewChild } from "@angular/core";
import { ClientService } from "src/app/core/services/client.service";
import { FormBuilder, FormControl } from "@angular/forms";
import { UserAccountService } from "src/app/core/services/user-account.service";
import { AppService } from "src/app/core/services/app.service";
import { ReportingService } from "../../reporting.service";
import { map, catchError, delay, tap, switchMap } from "rxjs/operators";
import { MatTableDataSource, MatPaginator } from "@angular/material";
import { KeywordDayObject } from "../../models/keyword-day-object";
import { isNil, isEmpty } from "lodash";

@Component({
  selector: "app-keyword-reporting",
  templateUrl: "./keyword-reporting.component.html",
  styleUrls: ["./keyword-reporting.component.scss"],
})
export class KeywordReportingComponent implements OnInit {
  keywordHistory: KeywordDayObject[] = [];

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

  keywordDataSource = new MatTableDataSource<KeywordDayObject>(
    this.keywordHistory
  );

  keywordOffsetKeys: string[] = ["init|init|init"]; // hack for dynamo paging by key
  orgId: string;
  isKeywordDataVisMode = false;

  // startPickerInputControl: FormControl = this.fb.control("");
  // endPickerInputControl: FormControl = this.fb.control("");
  // keywordStatusControl: FormControl = this.fb.control("");
  // matchTypeControl: FormControl = this.fb.control("");
  keywordFilterForm = this.fb.group({
    start: [""],
    end: [""],
    keywordStatus: [""],
    matchType: [""],
  });

  @ViewChild("keywordsPaginator", { static: false })
  keywordsPaginator: MatPaginator;

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
    this.clientService
      .getClientKeywordHistory(
        this.orgId,
        this.keywordsPaginator.pageSize,
        this.keywordOffsetKeys[this.keywordsPaginator.pageIndex],
        "all",
        "all",
        "all",
        "all"
      )
      .pipe(
        map((data) => {
          this.reportingService.isLoadingKeywords = false;
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
          return this.clientService
            .getClientKeywordHistory(
              this.orgId,
              this.keywordsPaginator.pageSize,
              keywordOffsetKey,
              "all",
              "all",
              "all",
              "all"
            )
            .pipe(
              map((data) => {
                this.reportingService.isLoadingKeywords = false;
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
                this.reportingService.isLoadingKeywords = false;
                return [];
              })
            );
        })
      )
      .subscribe();
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

  applyFilter() {
    this.reportingService.isLoadingKeywords = true;
    let start: Date = this.keywordFilterForm.get("start").value;
    let end: Date = this.keywordFilterForm.get("end").value;

    console.log("contro" + start.toISOString());

    let startString = "all";

    if (!isNil(start.toISOString())) {
      console.log("found date" + startString);
      startString = start.toISOString().split("T")[0];
      console.log("setting to" + startString);
    }

    let endString = "all";
    if (!isNil(end.toISOString())) {
      endString = end.toISOString().split("T")[0];
    }

    const keywordStatus: string = this.keywordFilterForm.get("keywordStatus")
      .value;
    const matchType: string = this.keywordFilterForm.get("matchType").value;
    console.log("matchType" + matchType);
    console.log("keywordStatus" + keywordStatus);
    this.clientService
      .getClientKeywordHistory(
        this.orgId,
        this.keywordsPaginator.pageSize,
        this.keywordOffsetKeys[this.keywordsPaginator.pageIndex],
        startString,
        endString,
        matchType,
        keywordStatus
      )
      .pipe(
        map((data) => {
          this.reportingService.isLoadingKeywords = false;
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
          this.reportingService.isLoadingKeywords = false;
          return [];
        })
      )
      .subscribe();
  }

  applyFilterDisabled() {
    return false;
  }

  downloadKeywordsCsv() {
    this.appService.downloadKeywordFile(this.keywordDataSource.data, "keyword");
  }
}
