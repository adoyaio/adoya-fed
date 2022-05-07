import { Component, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { catchError, map, take } from "rxjs/operators";
import { AppService } from "src/app/core/services/app.service";
import { ClientService } from "src/app/core/services/client.service";
import { UserAccountService } from "src/app/core/services/user-account.service";
import { ReportingService } from "../../reporting.service";

@Component({
  selector: "app-campaign-reporting",
  templateUrl: "./campaign-reporting.component.html",
  styleUrls: ["./campaign-reporting.component.scss"],
})
export class CampaignReportingComponent implements OnInit {
  campaignOffsetKeys: string[] = ["init|init"]; // dynamo paging by key
  orgId: string;

  maxDate: Date;
  minDate: Date;

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

    this.orgId = this.userAccountService
      .getCurrentUser()
      .UserAttributes.find((val) => {
        return val.Name === "custom:org_id";
      }).Value;
  }

  ngAfterViewInit() {
    // let start: Date = this.keywordFilterForm.get("start").value;
    // let end: Date = this.keywordFilterForm.get("end").value;
    this.clientService
      .getClientCampaignHistory(
        "527588685",
        100,
        this.campaignOffsetKeys[0],
        "all",
        "all"
      )
      .pipe(
        take(1),
        map((data) => {
          this.reportingService.isLoadingKeywords = false; // TODO

          this.campaignOffsetKeys.push(
            String(data["offset"]["campaign_id"]) +
              "|" +
              String(data["offset"]["timestamp"])
          );
          //this.keywordDataSource.data = data["history"];
          // this.keywordsPaginator.length = data["count"];

          // set line graph
          // this.reportingService.keywordDayObject$.next(data["history"]);

          // set table
          //this.keywordAggregatedDataSource.data = this.getAggregateDataForTable(
          //  data["history"]
          //);

          return data;
        }),
        catchError(() => {
          this.reportingService.isLoadingKeywords = false;
          return [];
        })
      )
      .subscribe();

    // this.keywordsPaginator.page
    //   .pipe(
    //     delay(0),
    //     tap((val) => {
    //       this.reportingService.isLoadingKeywords = true;
    //     }),
    //     switchMap((val) => {
    //       let keywordOffsetKey = this.keywordOffsetKeys[val.pageIndex];
    //       let start: Date = this.keywordFilterForm.get("start").value;
    //       let end: Date = this.keywordFilterForm.get("end").value;
    //       const keywordStatus: string =
    //         this.keywordFilterForm.get("keywordStatus").value;
    //       const matchType: string =
    //         this.keywordFilterForm.get("matchType").value;

    //       return this.clientService
    //         .getClientKeywordHistory(
    //           this.orgId,
    //           this.keywordsPaginator.pageSize,
    //           keywordOffsetKey,
    //           this.formatDate(start),
    //           this.formatDate(end),
    //           matchType,
    //           keywordStatus
    //         )
    //         .pipe(
    //           map((data) => {
    //             this.reportingService.isLoadingKeywords = false;

    //             // handle dynamo paging
    //             if (val.pageIndex > val.previousPageIndex) {
    //               this.keywordOffsetKeys.push(
    //                 String(data["offset"]["org_id"]) +
    //                   "|" +
    //                   String(data["offset"]["keyword_id"]) +
    //                   "|" +
    //                   String(data["offset"]["date"])
    //               );

    //               // items per page change
    //             } else if (val.pageIndex == val.previousPageIndex) {
    //               this.keywordOffsetKeys = ["init|init|init"];
    //               this.keywordOffsetKeys.push(
    //                 String(data["offset"]["org_id"]) +
    //                   "|" +
    //                   String(data["offset"]["keyword_id"]) +
    //                   "|" +
    //                   String(data["offset"]["date"])
    //               );
    //             }
    //             this.keywordDataSource.data = data["history"];
    //             this.keywordsPaginator.length = data["count"];
    //           }),
    //           catchError(() => {
    //             this.reportingService.isLoadingKeywords = false;
    //             return [];
    //           })
    //         );
    //     })
    //   )
    //   .subscribe();

    // this.keywordAggregatedDataSource.sort = this.sort;
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
}
