import { Component, OnInit, ViewChild } from "@angular/core";
import { ChartDataSets, ChartOptions, ChartType } from "chart.js";
import { Color, Label, BaseChartDirective } from "ng2-charts";
import { ReportingService } from "../../reporting.service";
import { combineLatest } from "rxjs";
import { tap, filter } from "rxjs/operators";
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
import { KeywordDayObject } from "../../models/keyword-day-object";
import { Z_FILTERED } from "zlib";

@Component({
  selector: "app-keyword-reporting-line-chart",
  templateUrl: "./keyword-reporting-line-chart.component.html",
  styleUrls: ["./keyword-reporting-line-chart.component.css"],
})
export class KeywordReportingLineChartComponent implements OnInit {
  public lineChartData: ChartDataSets[] = [];
  public lineChartLabels: Label[] = [];
  public lineChartOptions: ChartOptions = {
    responsive: true,
  };
  public lineChartColors: Color[] = [
    {
      borderColor: "black",
      backgroundColor: "rgba(255,0,0,0.3)",
    },
  ];
  // public lineChartColors: Color[] = [
  //   {
  //     borderColor: "#7a975d",
  //     backgroundColor: "rgba(255,0,0,0.3)",
  //   },
  // ];
  public lineChartLegend = true;
  public lineChartType: ChartType = "line";
  public lineChartPlugins = [];

  @ViewChild(BaseChartDirective, { static: true }) chart: BaseChartDirective;

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
          this.lineChartData = [];
          // { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' },
          // { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' },

          this.lineChartLabels = [];
          // ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

          this.lineChartLabels = _chain(data)
            .uniqBy("date")
            .map((keyword) => {
              return keyword.date;
            })
            .value();

          // build list of keywords
          const kwList = _chain(data)
            .uniqBy("keyword")
            .map((keyword) => {
              return keyword.keyword;
            })
            .value();

          _each(kwList, (keyword) => {
            _each(this.lineChartLabels, (date) => {
              // pul all kw's for the date and summarize for the dataline
              const valuesForADay = _filter(data, (line) => {
                if (line.date === date && line.keyword === keyword) {
                  return true;
                }
              });

              // const dataPoint = 0
              const dataPoint = _reduce(
                valuesForADay,
                (acc, day) => {
                  const val = _get(day, activeMetric.value);
                  return val + acc;
                },
                0
              );

              //write the dataline
              const match = _find(this.lineChartData, (line) => {
                return line.label === keyword;
              });

              if (_isNil(match)) {
                this.lineChartData.push({
                  data: [dataPoint],
                  label: keyword,
                });
              } else {
                match.data.push(dataPoint);
              }
            });
          });

          this.chart.update();
        })
      )
      .subscribe();
  }
}
