import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl } from "@angular/forms";
import { MatTableDataSource } from "@angular/material";
import { chain, first, get } from "lodash";
import { EMPTY } from "rxjs";
import { catchError, map, switchMap, take, tap } from "rxjs/operators";
import { Client } from "src/app/core/models/client";
import { AppService } from "src/app/core/services/app.service";
import { ClientService } from "src/app/core/services/client.service";
import { UserAccountService } from "src/app/core/services/user-account.service";
import { CampaignDayObject } from "../../models/campaign-day";
import { KeywordDayObject } from "../../models/keyword-day-object";
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

  campaignIds = ["527588685"];
  appleCampaigns = [];

  campaignFilterForm = this.fb.group({
    lookback: new FormControl(),
    startPickerInput: new FormControl(),
    endPickerInput: new FormControl(),
    campaign: new FormControl(),
  });

  isAggDataVisMode;
  isDataVisMode;

  dataSource = new MatTableDataSource<CampaignDayObject>([]);
  // keywordAggregatedDataSource = new MatTableDataSource<KeywordAggregatedObject>(
  //   []
  // );

  displayedColumns: string[] = [
    "timestamp",
    "campaign_id",
    "campaignName",
    "local_spend",
    "installs",
    "avg_cpa",
  ];

  // displayedAggregatedKeywordColumns: string[] = [
  //   "keyword",
  //   "installs",
  //   "avg_cpa",
  //   "local_spend",
  // ];

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
    // this.campaignFilterForm.controls["campaign"].setValue(
    //   first(this.appleCampaigns)
    // );

    this.clientService
      .getClient(this.orgId)
      .pipe(
        switchMap((data: Client) => {
          this.appleCampaigns = chain(data).get("appleCampaigns").value();

          //this.isLoadingResults = false;
          const defaultCampaign = chain(this.appleCampaigns).first().value();
          const defaultCampaignId = get(defaultCampaign, "campaignId");

          this.campaignFilterForm.controls["campaign"].setValue(
            defaultCampaignId
          );

          return this.clientService
            .getClientCampaignHistory(
              defaultCampaignId,
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

                this.dataSource.data = data["history"];
                //this.paginator.length = data["count"];

                return data;
              }),
              catchError(() => {
                this.reportingService.isLoadingKeywords = false;
                return [];
              })
            );
        }),
        take(1),
        catchError(() => {
          // this.isLoadingResults = false;
          return EMPTY;
        })
      )
      .subscribe();

    // this.clientService
    //   .getClientCampaignHistory(
    //     "527588685",
    //     100,
    //     this.campaignOffsetKeys[0],
    //     "all",
    //     "all"
    //   )
    //   .pipe(
    //     take(1),
    //     map((data) => {
    //       this.reportingService.isLoadingKeywords = false; // TODO

    //       this.campaignOffsetKeys.push(
    //         String(data["offset"]["campaign_id"]) +
    //           "|" +
    //           String(data["offset"]["timestamp"])
    //       );
    //       //this.keywordDataSource.data = data["history"];
    //       // this.keywordsPaginator.length = data["count"];

    //       // set line graph
    //       // this.reportingService.keywordDayObject$.next(data["history"]);

    //       // set table
    //       //this.keywordAggregatedDataSource.data = this.getAggregateDataForTable(
    //       //  data["history"]
    //       //);

    //       return data;
    //     }),
    //     catchError(() => {
    //       this.reportingService.isLoadingKeywords = false;
    //       return [];
    //     })
    //   )
    //   .subscribe();

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

  applyFilterDisabled() {}

  applyFilter() {}

  resetCampaignFilters() {}

  downloadCampaignCsv() {}

  showDataView() {}

  showTableView() {}

  showAggregateDataView() {}

  onChipClicked() {}
}
