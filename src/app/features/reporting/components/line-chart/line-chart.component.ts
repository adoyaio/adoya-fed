import { Component, OnInit, Input } from "@angular/core";
import { ChartDataSets, ChartOptions, ChartType } from "chart.js";
import { Color, Label } from "ng2-charts";
import { CostPerInstallDayObject } from "../../models/cost-per-install-day-object";
import { chain as _chain, includes as _includes, each as _each } from "lodash";
import { ReportingService } from "../../reporting.service";
import { tap } from "rxjs/internal/operators/tap";

@Component({
  selector: "app-line-chart",
  templateUrl: "./line-chart.component.html",
  styleUrls: ["./line-chart.component.css"],
})
export class LineChartComponent implements OnInit {
  @Input() dataSource: CostPerInstallDayObject[];

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
    this.reportingService.costPerInstallDayObject$
      .pipe(
        tap((data) => {
          this.lineChartData = [];
          this.lineChartLabels = [];
          const cpiDataLine = { data: [], label: "Cost Per Install" };
          const installsDataLine = { data: [], label: "Installs" };
          const spendDataLine = { data: [], label: "Spend" };
          const purchasesDataLine = { data: [], label: "Purchases" };
          const cppDataLine = { data: [], label: "Cost Per Purchase" };
          const revenueDataLine = { data: [], label: "Revenue" };
          const revenueOverCostDataLine = {
            data: [],
            label: "Revenue Over Cost",
          };
          _each(data, (cpiObject) => {
            this.lineChartLabels.push(cpiObject.timestamp);
            cpiDataLine.data.push(cpiObject.cpi);
            installsDataLine.data.push(cpiObject.installs);
            spendDataLine.data.push(cpiObject.spend);
            purchasesDataLine.data.push(cpiObject.purchases);
            cppDataLine.data.push(cpiObject.cpp);
            revenueDataLine.data.push(cpiObject.revenue);
            revenueOverCostDataLine.data.push(cpiObject.revenueOverCost);
          });
          this.lineChartData.push(cpiDataLine);
          this.lineChartData.push(installsDataLine);
          this.lineChartData.push(spendDataLine);
          this.lineChartData.push(purchasesDataLine);
          this.lineChartData.push(cppDataLine);
          this.lineChartData.push(revenueDataLine);
          this.lineChartData.push(revenueOverCostDataLine);
        })
      )
      .subscribe();
  }
}
