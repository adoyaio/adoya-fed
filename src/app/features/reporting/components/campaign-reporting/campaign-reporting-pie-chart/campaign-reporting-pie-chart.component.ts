import { Component, OnInit, ViewChild } from "@angular/core";
import { ChartOptions, ChartType } from "chart.js";
import {
  chain,
  each,
  find,
  isNil,
  filter as _filter,
  reduce,
  get,
} from "lodash";
import { BaseChartDirective, Label, SingleDataSet } from "ng2-charts";
import { combineLatest } from "rxjs";
import { filter, tap } from "rxjs/operators";
import { ReportingService } from "../../../reporting.service";

@Component({
  selector: "app-campaign-reporting-pie-chart",
  templateUrl: "./campaign-reporting-pie-chart.component.html",
  styleUrls: ["./campaign-reporting-pie-chart.component.scss"],
})
export class CampaignReportingPieChartComponent implements OnInit {
  public pieChartOptions: ChartOptions = {
    responsive: true,
  };
  public pieChartLabels: Label[] = [];
  public pieChartData: SingleDataSet = [];
  public pieChartType: ChartType = "pie";
  public pieChartLegend = true;
  public pieChartPlugins = [];

  @ViewChild(BaseChartDirective, { static: true }) chart: BaseChartDirective;

  constructor(private reportingService: ReportingService) {}

  ngOnInit() {
    combineLatest([
      this.reportingService.campaignDayObject$,
      this.reportingService.activeKeywordLineChartMetric$,
    ])
      .pipe(
        filter(([data, metrics]) => !isNil(data)),
        tap(([data, metrics]) => {
          const activeMetric = find(metrics, (metric) => {
            return metric.state === true;
          });

          if (isNil(activeMetric)) {
            return;
          }

          // init chart
          this.pieChartData = [];
          this.pieChartLabels = [];

          // build list of campaigns
          this.pieChartLabels = chain(data)
            .uniqBy("campaignName")
            .map((campaign) => {
              return campaign.campaignName;
            })
            .value();

          each(this.pieChartLabels, (campaignName) => {
            // pull all kw's for the date and summarize for the dataline
            const valuesForADay = _filter(data, (line) => {
              if (line.campaignName === campaignName) {
                return true;
              }
            });

            let dataPoint = 0;
            if (activeMetric.value === "avg_cpa") {
              dataPoint =
                reduce(
                  valuesForADay,
                  (acc, day) => {
                    const val = get(day, activeMetric.value);
                    return +val + acc;
                  },
                  0
                ) / valuesForADay.length;
            } else {
              dataPoint = reduce(
                valuesForADay,
                (acc, day) => {
                  const val = get(day, activeMetric.value);
                  return +val + acc;
                },
                0
              );
            }

            this.pieChartData.push(dataPoint);
          });

          this.chart.update();
        })
      )
      .subscribe();
  }
}
