import { Component, OnInit } from "@angular/core";
import { ChartOptions, ChartType } from "chart.js";
import { Label, SingleDataSet } from "ng2-charts";
import { ReportingService } from "../../reporting.service";
import { combineLatest } from "rxjs";
import { filter, tap } from "rxjs/operators";
import {
  chain as _chain,
  includes as _includes,
  each as _each,
  map as _map,
  find as _find,
  isNil as _isNil,
  get as _get,
  filter as _filter,
  reduce as _reduce,
} from "lodash";

// import * as pluginDataLabels from 'chartjs-plugin-datalabels';

@Component({
  selector: "app-keyword-reporting-pie-chart",
  templateUrl: "./keyword-reporting-pie-chart.component.html",
  styleUrls: ["./keyword-reporting-pie-chart.component.css"],
})
export class KeywordReportingPieChartComponent implements OnInit {
  public pieChartOptions: ChartOptions = {
    responsive: true,
  };
  public pieChartLabels: Label[] = [];
  public pieChartData: SingleDataSet = [];
  public pieChartType: ChartType = "pie";
  public pieChartLegend = true;
  public pieChartPlugins = [];

  constructor(private reportingService: ReportingService) {}

  ngOnInit() {
    combineLatest([
      this.reportingService.keywordDayObject$,
      this.reportingService.activeKeywordLineChartMetric$,
    ])
      .pipe(
        filter(([data, metrics]) => !_isNil(data)),
        tap(([data, metrics]) => {
          const activeMetric = _find(metrics, (metric) => {
            return metric.state === true;
          });

          if (_isNil(activeMetric)) {
            return;
          }
          // init chart
          this.pieChartData = [];
          this.pieChartLabels = [];

          // build list of keywords
          this.pieChartLabels = _chain(data)
            .uniqBy("keyword")
            .map((keyword) => {
              return keyword.keyword;
            })
            .value();

          _each(this.pieChartLabels, (keyword) => {
            // pull all kw's for the date and summarize for the dataline
            const valuesForADay = _filter(data, (line) => {
              if (line.keyword === keyword) {
                return true;
              }
            });

            const dataPoint = _reduce(
              valuesForADay,
              (acc, day) => {
                const val = _get(day, activeMetric.value);
                return +val + acc;
              },
              0
            );

            this.pieChartData.push(dataPoint);
          });

          // this.chart.update();
        })
      )
      .subscribe();
  }
}
