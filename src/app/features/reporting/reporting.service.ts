import { Injectable } from "@angular/core";
import { CostPerInstallDayObject } from "./models/cost-per-install-day-object";
import { BehaviorSubject } from "rxjs";
import { ChartLabelObject } from "./models/chart-label-object";

@Injectable({
  providedIn: "root",
})
export class ReportingService {
  costPerInstallDayObject$ = new BehaviorSubject<CostPerInstallDayObject[]>([]);

  activeLineChartLabel$ = new BehaviorSubject<ChartLabelObject[]>([
    { name: "Installs", state: true },
    { name: "Cost Per Install", state: true },
    { name: "Spend", state: false },
    { name: "Purchases", state: false },
    { name: "Cost Per Purchase", state: false },
    { name: "Revenue", state: false },
    { name: "Return On Ad Spend", state: false },
  ]);

  constructor() {}
}
