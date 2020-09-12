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
} from "lodash";

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
          this.lineChartLabels = [];

          //init cost data lines
          // const keywordIdDataLine = { data: [], label: "Keyword" };

          // build datalines for the active metric
          // data.forEach((val) => {
          //   console.log(val.date);
          // });

          _chain(data)
            .uniqBy("date")
            .each((keyword) => {
              this.lineChartLabels.push(keyword.date);
              // console.log("ADDING data" + keyword.date);
            })
            .value();

          _each(data, (keyword) => {
            const match = _find(this.lineChartData, (line) => {
              return line.label === keyword.keyword;
            });

            const dataPoint = _get(keyword, activeMetric.value, 0);

            // if (dataPoint > 0) {
            //   console.log("JAMES TEST:::" + dataPoint);
            // }

            if (_isNil(match)) {
              this.lineChartData.push({
                data: [dataPoint],
                label: keyword.keyword,
              });
            } else {
              match.data.push(dataPoint);
            }
          });

          this.chart.update();

          // _each(
          //   [
          //     cpiDataLine,
          //     installsDataLine,
          //     spendDataLine,
          //     purchasesDataLine,
          //     cppDataLine,
          //     revenueDataLine,
          //     revenueOverCostDataLine,
          //   ],
          //   (dataline) => {
          //     if (
          //       _chain(labels)
          //         .find((label) => {
          //           return label.name === dataline.label;
          //         })
          //         .get("state")
          //         .value() === true
          //     ) {
          //       this.lineChartData.push(dataline);
          //       this.lineChartLabels.push(dataline.label);
          //     }
          //   }
          // );
        })
      )
      .subscribe();
  }
}
