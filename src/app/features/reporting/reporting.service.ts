import { Injectable } from "@angular/core";
import { CostPerInstallDayObject } from "./models/cost-per-install-day-object";
import { BehaviorSubject } from "rxjs";
import {
  ChartLabelObject,
  ChartMetricObject,
} from "./models/chart-label-object";
import { AppService } from "src/app/core/services/app.service";
import { KeywordDayObject } from "./models/keyword-day-object";
import { CampaignDayObject } from "./models/campaign-day";

@Injectable({
  providedIn: "root",
})
export class ReportingService {
  isLoadingCPI = true;
  isLoadingAdgroups = true;
  isLoadingCampaigns = true;
  isLoadingKeywords = true;

  costPerInstallDayObject$ = new BehaviorSubject<CostPerInstallDayObject[]>([]);
  keywordDayObject$ = new BehaviorSubject<KeywordDayObject[]>([]);
  campaignDayObject$ = new BehaviorSubject<CampaignDayObject[]>([]);

  activeLineChartLabel$ = new BehaviorSubject<ChartLabelObject[]>([
    { name: "Installs", state: true },
    { name: "Cost Per Install", state: true },
    { name: "Spend", state: false },
    { name: "Purchases", state: false },
    { name: "Cost Per Purchase", state: false },
    { name: "Revenue", state: false },
    { name: "Return On Ad Spend", state: false },
  ]);

  // activeKeywordLineChartMetric$ = new BehaviorSubject<ChartMetricObject[]>([
  //   { name: "Installs", value: "installs", state: true },
  //   { name: "Cost Per Install", value: "avg_cpa", state: false },
  //   { name: "Cost", value: "local_spend", state: false },
  // ]);

  // activeKeywordLineChartMetric$ = new BehaviorSubject<ChartMetricObject[]>([
  //   { name: "Installs", value: "installs", state: true },
  //   { name: "Cost Per Install", value: "avg_cpa", state: false },
  //   { name: "Spend", value: "local_spend", state: false },
  //   { name: "Purchases", value: "branch_commerce_event_count", state: false },
  //   { name: "Cost Per Purchase", value: "cpp", state: false },
  //   { name: "Revenue", value: "branch_revenue", state: false },
  //   { name: "Return On Ad Spend", value: "roas", state: false },
  // ]);

  activeKeywordLineChartMetric$ = new BehaviorSubject<ChartMetricObject[]>([
    { name: "Installs", value: "installs", state: true },
    { name: "Cost Per Install", value: "avg_cpa", state: false },
    { name: "Spend", value: "local_spend", state: false },
    { name: "Purchases", value: "branch_commerce_event_count", state: false },
    { name: "Cost Per Purchase", value: "cpp", state: false },
    { name: "Revenue", value: "branch_revenue", state: false },
    { name: "Return On Ad Spend", value: "roas", state: false },
  ]);

  constructor(public appService: AppService) {}
}
