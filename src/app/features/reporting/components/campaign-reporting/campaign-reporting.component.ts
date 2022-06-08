import { Component, OnInit, ViewChild } from "@angular/core";
import { AbstractControl, FormBuilder, FormControl } from "@angular/forms";
import { MatPaginator, MatSort, MatTableDataSource } from "@angular/material";
import {
  chain,
  cloneDeep,
  each,
  filter,
  first,
  get,
  isNil,
  isNumber,
  reduce,
  map as _map,
} from "lodash";
import { EMPTY } from "rxjs";
import { catchError, delay, map, switchMap, take, tap } from "rxjs/operators";
import { Client, OrgDetails } from "src/app/core/models/client";
import { AppService } from "src/app/core/services/app.service";
import { ClientService } from "src/app/core/services/client.service";
import { UserAccountService } from "src/app/core/services/user-account.service";
import {
  CampaignAggregatedObject,
  CampaignDayObject,
} from "../../models/campaign-day";
import { ChartMetricObject } from "../../models/chart-label-object";
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

  maxEndDate: Date;
  maxStartDate: Date;

  appleCampaigns = [];

  campaignFilterForm = this.fb.group({
    lookback: new FormControl(),
    start: new FormControl(),
    end: new FormControl(),
    campaign: new FormControl(),
  });

  get startPickerControl(): AbstractControl {
    return this.campaignFilterForm.get("start");
  }

  get endPickerControl(): AbstractControl {
    return this.campaignFilterForm.get("end");
  }

  get campaignControl(): AbstractControl {
    return this.campaignFilterForm.get("campaign");
  }

  isAggDataVisMode;
  isDataVisMode;

  dataSource = new MatTableDataSource<CampaignDayObject>([]);
  aggregatedDataSource = new MatTableDataSource<CampaignAggregatedObject>([]);

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

  displayedAggregatedColumns: string[] = [
    "campaignName",
    "campaign_id",
    "installs",
    "avg_cpa",
    "local_spend",
    "branch_revenue",
    "branch_commerce_event_count",
  ];

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
    this.maxStartDate = new Date();
    this.maxEndDate = new Date();
    this.maxStartDate.setDate(this.maxStartDate.getDate() - 1);
    this.maxEndDate.setDate(this.maxEndDate.getDate() - 2);
    this.isAggDataVisMode = true;

    this.orgId = this.userAccountService
      .getCurrentUser()
      .UserAttributes.find((val) => {
        return val.Name === "custom:org_id";
      }).Value;

    // init date ranges
  }

  ngAfterViewInit() {
    // let start: Date = this.keywordFilterForm.get("start").value;
    // let end: Date = this.keywordFilterForm.get("end").value;

    this.clientService
      .getClient(this.orgId)
      .pipe(
        tap((data: OrgDetails) => {
          this.appleCampaigns = chain(data)
            .get("appleCampaigns")
            .filter((campaign) => campaign.status === "ENABLED")
            .value();

          this.campaignFilterForm.controls["campaign"].setValue(
            _map(this.appleCampaigns, (campaign) => campaign.campaignId)
          );
          this.reportingService.isLoadingCampaigns = false;
        }),
        take(1),
        catchError(() => {
          this.reportingService.isLoadingCampaigns = false;
          return EMPTY;
        })
      )
      .subscribe();

    // this.campaignFilterForm.controls["campaign"].valueChanges
    //   .pipe(
    //     tap((val) => {
    //       this.reportingService.isLoadingCampaigns = true;
    //     }),
    //     switchMap((val) => {
    //       debugger;
    //       return this.clientService
    //         .getClientCampaignHistory(
    //           this.orgId,
    //           val,
    //           100,
    //           this.campaignOffsetKeys[0],
    //           "all",
    //           "all"
    //         )
    //         .pipe(
    //           take(1),
    //           map((data) => {
    //             this.reportingService.isLoadingCampaigns = false;

    //             // pagination
    //             this.campaignOffsetKeys = ["init|init"];
    //             this.campaignOffsetKeys.push(
    //               String(data["offset"]["campaign_id"]) +
    //                 "|" +
    //                 String(data["offset"]["timestamp"])
    //             );

    //             // set line graph
    //             this.reportingService.campaignDayObject$.next(data["history"]);

    //             // set table
    //             //this.keywordAggregatedDataSource.data = this.getAggregateDataForTable(
    //             //  data["history"]
    //             //);

    //             this.dataSource.data = data["history"];
    //             this.paginator.length = data["count"];

    //             return data;
    //           }),
    //           catchError(() => {
    //             this.reportingService.isLoadingCampaigns = false;
    //             return [];
    //           })
    //         );
    //     }),

    //     catchError(() => {
    //       this.reportingService.isLoadingCampaigns = false;
    //       return EMPTY;
    //     })
    //   )
    //   .subscribe();

    this.paginator.page
      .pipe(
        delay(0),
        tap((val) => {
          this.reportingService.isLoadingCampaigns = true;
        }),
        switchMap((val) => {
          let campaign = this.campaignFilterForm.get("campaign").value;
          let offsetKey = this.campaignOffsetKeys[val.pageIndex];
          let start: Date = this.campaignFilterForm.get("start").value
            ? this.campaignFilterForm.get("start").value
            : "all";
          let end: Date = this.campaignFilterForm.get("end").value
            ? this.campaignFilterForm.get("end").value
            : "all";

          return this.clientService
            .getClientCampaignHistory(
              this.orgId,
              campaign,
              this.paginator.pageSize,
              offsetKey,
              this.formatDate(start),
              this.formatDate(end)
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

                this.reportingService.campaignDayObject$.next(data["history"]);
                this.aggregatedDataSource.data = this.getAggregateDataForTable(
                  data["history"]
                );
              }),
              catchError(() => {
                this.reportingService.isLoadingCampaigns = false;
                return [];
              })
            );
        })
      )
      .subscribe();

    this.aggregatedDataSource.sort = this.sort;
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

  applyFilterDisabled() {
    if (this.campaignControl.value) {
      return false;
    }
    // if (this.startPickerControl.value && this.endPickerControl.value) {
    //   return false;
    // }
    return true;
  }

  applyFilter() {
    let campaign = this.campaignFilterForm.get("campaign").value;
    this.reportingService.isLoadingCampaigns = true;
    this.paginator.pageIndex = 0;
    this.campaignOffsetKeys = ["init|init"];

    let start: Date = this.campaignFilterForm.get("start").value
      ? this.campaignFilterForm.get("start").value
      : "all";
    let end: Date = this.campaignFilterForm.get("end").value
      ? this.campaignFilterForm.get("end").value
      : "all";

    this.clientService
      .getClientCampaignHistory(
        this.orgId,
        campaign,
        this.paginator.pageSize,
        this.campaignOffsetKeys[0],
        this.formatDate(start),
        this.formatDate(end)
      )
      .pipe(
        take(1),
        map((data) => {
          this.reportingService.isLoadingCampaigns = false;

          // handle dynamo paging
          this.campaignOffsetKeys.push(
            String(data["offset"]["campaign_id"]) +
              "|" +
              String(data["offset"]["timestamp"])
          );

          this.dataSource.data = data["history"];
          this.paginator.length = data["count"];
          this.reportingService.campaignDayObject$.next(data["history"]);

          this.aggregatedDataSource.data = this.getAggregateDataForTable(
            data["history"]
          );
        }),
        catchError(() => {
          this.reportingService.isLoadingCampaigns = false;
          return [];
        })
      )
      .subscribe();
  }

  resetCampaignFilters() {
    this.reportingService.isLoadingCampaigns = true;
    this.startPickerControl.reset();
    this.endPickerControl.reset();
    this.paginator.pageIndex = 0;
    this.campaignOffsetKeys = ["init|init"];

    this.clientService
      .getClientCampaignHistory(
        this.orgId,
        this.campaignControl.value,
        this.paginator.pageSize,
        this.campaignOffsetKeys[0],
        "all",
        "all"
      )
      .pipe(
        take(1),
        map((data) => {
          this.reportingService.isLoadingCampaigns = false;

          // pagination
          this.campaignOffsetKeys.push(
            String(data["offset"]["campaign_id"]) +
              "|" +
              String(data["offset"]["timestamp"])
          );

          // set line graph
          this.reportingService.campaignDayObject$.next(data["history"]);

          // set table
          this.aggregatedDataSource.data = this.getAggregateDataForTable(
            data["history"]
          );

          this.dataSource.data = data["history"];
          this.paginator.length = data["count"];

          return data;
        }),
        catchError(() => {
          this.reportingService.isLoadingCampaigns = false;
          return [];
        })
      )
      .subscribe();
  }

  downloadCampaignCsv() {
    this.appService.downloadCampaignFile(this.dataSource.data, "campaign");
  }

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
    this.aggregatedDataSource.data = this.getAggregateDataForTable(
      this.reportingService.campaignDayObject$.getValue()
    );
  }

  onChipClicked(updated: ChartMetricObject) {
    const updatedLineChartMetric = cloneDeep(
      this.reportingService.activeKeywordLineChartMetric$.getValue()
    );

    chain(updatedLineChartMetric)
      .find((metric) => {
        return metric.state === true;
      })
      .set("state", false)
      .value();

    chain(updatedLineChartMetric)
      .find((metric) => {
        return metric.name === updated.name;
      })
      .set("state", !updated.state)
      .value();

    this.reportingService.activeKeywordLineChartMetric$.next(
      updatedLineChartMetric
    );
  }

  getAggregateDataForTable(
    currentData: CampaignDayObject[]
  ): CampaignAggregatedObject[] {
    // build list of keywords
    const history: CampaignAggregatedObject[] = [];
    let campaignIds = [];
    campaignIds = chain(currentData)
      .uniqBy("campaign_id")
      .map((campaign) => {
        return campaign.campaign_id;
      })
      .value();

    each(campaignIds, (campaignId) => {
      let campaignName = "";
      // pull all kw's for the date and summarize for the dataline
      const valuesForACampaign = filter(currentData, (line) => {
        if (line.campaign_id === campaignId) {
          campaignName = line.campaignName;
          return true;
        }
      });

      const local_spend = reduce(
        valuesForACampaign,
        (acc, day) => {
          const val = get(day, "local_spend");
          return +val + acc;
        },
        0.0
      );

      const installs = reduce(
        valuesForACampaign,
        (acc, day) => {
          const val = get(day, "installs");
          return +val + acc;
        },
        0
      );

      const branch_commerce_event_count = reduce(
        valuesForACampaign,
        (acc, day) => {
          const val = get(day, "branch_commerce_event_count");
          return +val + acc;
        },
        0
      );

      const branch_revenue = reduce(
        valuesForACampaign,
        (acc, day) => {
          const val = get(day, "branch_commerce_revenue");
          return +val + acc;
        },
        0
      );

      let cpi = 0.0;
      if (installs != 0) {
        cpi = +local_spend / +installs;
      }

      const campaign: CampaignAggregatedObject = {
        campaignName: campaignName,
        campaignId: campaignId,
        avg_cpa: cpi,
        local_spend: local_spend,
        installs: installs,
        branch_commerce_event_count,
        branch_revenue,
      };

      history.push(campaign);
    });
    return history;
  }
}
