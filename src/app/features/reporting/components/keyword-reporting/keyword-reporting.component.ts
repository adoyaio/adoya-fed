import { Component, OnInit, ViewChild } from "@angular/core";
import { ClientService } from "src/app/core/services/client.service";
import { FormBuilder, FormControl } from "@angular/forms";
import { UserAccountService } from "src/app/core/services/user-account.service";
import { AppService } from "src/app/core/services/app.service";
import { ReportingService } from "../../reporting.service";
import { map, catchError, delay, tap, switchMap, take } from "rxjs/operators";
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
  currentDate: Date = new Date();
  minDate: Date = new Date();

  // startPickerInputControl: FormControl = this.fb.control("");
  // endPickerInputControl: FormControl = this.fb.control("");
  // keywordStatusControl: FormControl = this.fb.control("");
  // matchTypeControl: FormControl = this.fb.control("");

  keywordFilterForm = this.fb.group({
    start: [new Date().toISOString()],
    end: [new Date().toISOString()],
    keywordStatus: ["all"],
    matchType: ["all"],
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
    // const currentDate = new Date();
    // const minDate = new Date();
    this.minDate.setDate(this.minDate.getDate() - 1);

    this.keywordFilterForm.get("start").setValue(this.minDate);
    this.keywordFilterForm.get("end").setValue(this.currentDate);

    this.orgId = this.userAccountService
      .getCurrentUser()
      .UserAttributes.find((val) => {
        return val.Name === "custom:org_id";
      }).Value;
  }

  ngAfterViewInit() {
    let start: Date = this.keywordFilterForm.get("start").value;
    let end: Date = this.keywordFilterForm.get("end").value;
    const startString = start.toISOString().split("T")[0];
    const endString = end.toISOString().split("T")[0];
    // console.log("ngAfterViewInit:::" + this.keywordsPaginator.pageIndex);

    this.clientService
      .getClientKeywordHistory(
        this.orgId,
        this.keywordsPaginator.pageSize,
        this.keywordOffsetKeys[this.keywordsPaginator.pageIndex],
        startString,
        endString,
        "all",
        "all"
      )
      .pipe(
        take(1),
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
          // console.log("keywordsPaginator.page::" + val.pageIndex);
          let keywordOffsetKey = this.keywordOffsetKeys[val.pageIndex];
          let start: Date = this.keywordFilterForm.get("start").value;
          let end: Date = this.keywordFilterForm.get("end").value;
          const startString = start.toISOString().split("T")[0];
          const endString = end.toISOString().split("T")[0];

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
              startString,
              endString,
              matchType,
              keywordStatus
            )
            .pipe(
              map((data) => {
                this.reportingService.isLoadingKeywords = false;
                this.keywordHistory = data["history"];

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
                  // console.log("found a items per page change");
                  this.keywordOffsetKeys = ["init|init|init"];
                  this.keywordOffsetKeys.push(
                    String(data["offset"]["org_id"]) +
                      "|" +
                      String(data["offset"]["keyword_id"]) +
                      "|" +
                      String(data["offset"]["date"])
                  );
                }

                // this.keywordOffsetKeys.forEach((val) => {
                //   console.log("value now " + val);
                // });

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

  applyFilter() {
    this.reportingService.isLoadingKeywords = true;
    this.keywordsPaginator.pageIndex = 0;
    this.keywordOffsetKeys = ["init|init|init"];

    // this.keywordOffsetKeys.forEach((val) => {
    //   console.log("value now " + val);
    // });

    let start: Date = this.keywordFilterForm.get("start").value;
    let end: Date = this.keywordFilterForm.get("end").value;

    const keywordStatus: string = this.keywordFilterForm.get("keywordStatus")
      .value;
    const matchType: string = this.keywordFilterForm.get("matchType").value;

    // console.log("applyFilter:::keywordStatus" + keywordStatus);
    // console.log("applyFilter:::matchType" + matchType);
    this.clientService
      .getClientKeywordHistory(
        this.orgId,
        this.keywordsPaginator.pageSize,
        this.keywordOffsetKeys[this.keywordsPaginator.pageIndex],
        start.toISOString().split("T")[0],
        end.toISOString().split("T")[0],
        matchType,
        keywordStatus
      )
      .pipe(
        // take(1),
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

          // this.keywordOffsetKeys.forEach((val) => {
          //   console.log("value now " + val);
          // });

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

  resetKeywordFilters() {
    this.reportingService.isLoadingKeywords = true;
    this.keywordsPaginator.pageIndex = 0;
    this.keywordsPaginator.pageSize = 100;
    this.keywordOffsetKeys = ["init|init|init"];
    this.keywordFilterForm.get("start").setValue(this.minDate);
    this.keywordFilterForm.get("end").setValue(this.currentDate);
    this.keywordFilterForm.get("keywordStatus").setValue("all");
    this.keywordFilterForm.get("matchType").setValue("all");

    let start: Date = this.keywordFilterForm.get("start").value;
    let end: Date = this.keywordFilterForm.get("end").value;

    const keywordStatus: string = this.keywordFilterForm.get("keywordStatus")
      .value;
    const matchType: string = this.keywordFilterForm.get("matchType").value;

    this.clientService
      .getClientKeywordHistory(
        this.orgId,
        this.keywordsPaginator.pageSize,
        this.keywordOffsetKeys[this.keywordsPaginator.pageIndex],
        start.toISOString().split("T")[0],
        end.toISOString().split("T")[0],
        matchType,
        keywordStatus
      )
      .pipe(
        // take(1),
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

          // this.keywordOffsetKeys.forEach((val) => {
          //   console.log("value now " + val);
          // });

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

  //   this.keywordsPaginator.page
  //     .pipe(
  //       delay(0),
  //       tap((val) => {
  //         this.reportingService.isLoadingKeywords = true;
  //       }),
  //       switchMap((val) => {
  //         let keywordOffsetKey = this.keywordOffsetKeys[val.pageIndex];
  //         return this.clientService
  //           .getClientKeywordHistory(
  //             this.orgId,
  //             this.keywordsPaginator.pageSize,
  //             keywordOffsetKey,
  //             "all",
  //             "all",
  //             "all",
  //             "all"
  //           )
  //           .pipe(
  //             map((data) => {
  //               this.reportingService.isLoadingKeywords = false;
  //               this.keywordHistory = data["history"];

  //               //
  //               if (val.pageIndex > val.previousPageIndex) {
  //                 this.keywordOffsetKeys.push(
  //                   String(data["offset"]["org_id"]) +
  //                     "|" +
  //                     String(data["offset"]["keyword_id"]) +
  //                     "|" +
  //                     String(data["offset"]["date"])
  //                 );
  //               } else if (val.pageIndex == val.previousPageIndex) {
  //                 this.keywordOffsetKeys = ["init|init|init"];
  //                 this.keywordOffsetKeys.push(
  //                   String(data["offset"]["org_id"]) +
  //                     "|" +
  //                     String(data["offset"]["keyword_id"]) +
  //                     "|" +
  //                     String(data["offset"]["date"])
  //                 );
  //               }
  //               this.keywordDataSource.data = this.keywordHistory;
  //               this.keywordsPaginator.length = data["count"];
  //               return data;
  //             }),
  //             catchError(() => {
  //               this.reportingService.isLoadingKeywords = false;
  //               return [];
  //             })
  //           );
  //       })
  //     )
  //     .subscribe();
  // }

  applyFilterDisabled() {
    return !this.keywordFilterForm.valid;
  }

  downloadKeywordsCsv() {
    this.appService.downloadKeywordFile(this.keywordDataSource.data, "keyword");
  }
}
