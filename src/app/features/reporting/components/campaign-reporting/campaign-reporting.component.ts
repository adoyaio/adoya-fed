import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormControl } from "@angular/forms";
import { MatPaginator, MatSort, MatTableDataSource } from "@angular/material";
import { chain, first, get } from "lodash";
import { EMPTY } from "rxjs";
import { catchError, delay, map, switchMap, take, tap } from "rxjs/operators";
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

  appleCampaigns = [];

  campaignFilterForm = this.fb.group({
    lookback: new FormControl(),
    start: new FormControl(),
    end: new FormControl(),
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
    "branch_revenue",
    "branch_commerce_event_count",
  ];

  // displayedAggregatedKeywordColumns: string[] = [
  //   "keyword",
  //   "installs",
  //   "avg_cpa",
  //   "local_spend",
  // ];

  @ViewChild("paginator", { static: false })
  paginator: MatPaginator;

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
        tap((data: Client) => {
          this.appleCampaigns = chain(data).get("appleCampaigns").value();
          const defaultCampaign = chain(this.appleCampaigns).first().value();
          const defaultCampaignId = get(defaultCampaign, "campaignId");
          this.campaignFilterForm.controls["campaign"].setValue(
            defaultCampaignId
          );
        }),
        take(1),
        catchError(() => {
          this.reportingService.isLoadingCampaigns = false;
          return EMPTY;
        })
      )
      .subscribe();

    this.campaignFilterForm.controls["campaign"].valueChanges
      .pipe(
        tap((val) => {
          this.reportingService.isLoadingCampaigns = true;
        }),
        switchMap((val) => {
          return this.clientService
            .getClientCampaignHistory(
              val,
              100,
              this.campaignOffsetKeys[0],
              "all",
              "all"
            )
            .pipe(
              take(1),
              map((data) => {
                this.reportingService.isLoadingCampaigns = false; // TODO

                // pagination
                this.campaignOffsetKeys = ["init|init"];
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
                this.paginator.length = data["count"];

                return data;
              }),
              catchError(() => {
                this.reportingService.isLoadingCampaigns = false;
                return [];
              })
            );
        }),

        catchError(() => {
          this.reportingService.isLoadingCampaigns = false;
          return EMPTY;
        })
      )
      .subscribe();

    this.paginator.page
      .pipe(
        delay(0),
        tap((val) => {
          this.reportingService.isLoadingCampaigns = true;
        }),
        switchMap((val) => {
          let campaign = this.campaignFilterForm.get("campaign").value;
          let offsetKey = this.campaignOffsetKeys[val.pageIndex];
          let start: Date = this.campaignFilterForm.get("start").value;
          let end: Date = this.campaignFilterForm.get("end").value;

          return this.clientService
            .getClientCampaignHistory(
              campaign,
              this.paginator.pageSize,
              offsetKey,
              "all",
              "all"
            )
            .pipe(
              map((data) => {
                this.reportingService.isLoadingCampaigns = false;

                // handle dynamo paging
                if (val.pageIndex > val.previousPageIndex) {
                  this.campaignOffsetKeys.push(
                    String(data["offset"]["campaign_id"]) +
                      "|" +
                      String(data["offset"]["timestamp"])
                  );

                  // items per page change
                } else if (val.pageIndex == val.previousPageIndex) {
                  this.campaignOffsetKeys = ["init|init"];
                  this.campaignOffsetKeys.push(
                    String(data["offset"]["campaign_id"]) +
                      "|" +
                      String(data["offset"]["timestamp"])
                  );
                }

                this.dataSource.data = data["history"];
                this.paginator.length = data["count"];
              }),
              catchError(() => {
                this.reportingService.isLoadingCampaigns = false;
                return [];
              })
            );
        })
      )
      .subscribe();

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

  applyFilterDisabled() {
    return !this.campaignFilterForm.valid;
  }

  applyFilter() {}

  resetCampaignFilters() {}

  downloadCampaignCsv() {}

  showDataView() {
    this.isDataVisMode = true;
    this.isAggDataVisMode = false;
  }

  showTableView() {
    this.isDataVisMode = false;
    this.isAggDataVisMode = false;
  }

  showAggregateDataView() {
    this.isAggDataVisMode = true;
    this.isDataVisMode = false;
    // this.keywordAggregatedDataSource.data = this.getAggregateDataForTable(
    //   this.reportingService.keywordDayObject$.getValue()
    // );
  }

  onChipClicked() {}
}
