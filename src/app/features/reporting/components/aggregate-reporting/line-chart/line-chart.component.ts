import { Component, OnInit, Input } from "@angular/core";
import { ChartDataSets, ChartOptions, ChartType } from "chart.js";
import { Color, Label } from "ng2-charts";
import { CostPerInstallDayObject } from "../../../models/cost-per-install-day-object";
import {
  chain as _chain,
  includes as _includes,
  each as _each,
  map as _map,
  sortBy,
} from "lodash";
import { ReportingService } from "../../../reporting.service";
import { tap } from "rxjs/internal/operators/tap";
import { combineLatest } from "rxjs";

@Component({
  selector: "app-line-chart",
  templateUrl: "./line-chart.component.html",
  styleUrls: ["./line-chart.component.css"],
})
export class LineChartComponent implements OnInit {
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
  public lineChartLegend = true;
  public lineChartType: ChartType = "line";
  public lineChartPlugins = [];

  constructor(private reportingService: ReportingService) {}

  ngOnInit() {
    combineLatest([
      this.reportingService.costPerInstallDayObject$,
      this.reportingService.activeLineChartLabel$,
    ])
      .pipe(
        tap(([data, labels]) => {
          const reversed = sortBy(data, (cpiLine) => {
            return cpiLine.timestamp;
          });
          // init chart
          this.lineChartData = [];
          this.lineChartLabels = [];

          //init data lines - build these dynamically
          const cpiDataLine = { data: [], label: "Cost Per Install" };
          const installsDataLine = { data: [], label: "Installs" };
          const spendDataLine = { data: [], label: "Cost" };
          const purchasesDataLine = { data: [], label: "Purchases" };
          const cppDataLine = { data: [], label: "Cost Per Purchase" };
          const revenueDataLine = { data: [], label: "Revenue" };
          const revenueOverCostDataLine = {
            data: [],
            label: "Return On Ad Spend",
          };

          // build datalines
          _each(reversed, (cpiObject) => {
            this.lineChartLabels.push(cpiObject.timestamp);
            cpiDataLine.data.push(cpiObject.cpi);
            installsDataLine.data.push(cpiObject.installs);
            spendDataLine.data.push(cpiObject.spend);
            purchasesDataLine.data.push(cpiObject.purchases);
            cppDataLine.data.push(cpiObject.cpp);
            revenueDataLine.data.push(cpiObject.revenue);
            revenueOverCostDataLine.data.push(cpiObject.revenueOverCost);
          });

          _each(
            [
              cpiDataLine,
              installsDataLine,
              spendDataLine,
              purchasesDataLine,
              cppDataLine,
              revenueDataLine,
              revenueOverCostDataLine,
            ],
            (dataline) => {
              if (
                _chain(labels)
                  .find((label) => {
                    return label.name === dataline.label;
                  })
                  .get("state")
                  .value() === true
              ) {
                this.lineChartData.push(dataline);
              }
            }
          );
        })
      )
      .subscribe();
  }
}
