import { DynamicFormModule } from "./../../shared/dynamic-form/dynamic-form.module";
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ReportingRoutingModule } from "./reporting-routing.module";

import { MatTabsModule } from "@angular/material/tabs";

import { AmplifyAngularModule } from "aws-amplify-angular";
import { MaterialModule } from "src/app/shared/material-design/material.module";
import { ChartsModule } from "ng2-charts";
import { LineChartComponent } from "./components/aggregate-reporting/line-chart/line-chart.component";
import { KeywordReportingComponent } from "./components/keyword-reporting/keyword-reporting.component";
import { KeywordReportingLineChartComponent } from "./components/keyword-reporting/keyword-reporting-line-chart/keyword-reporting-line-chart.component";
import { KeywordReportingPieChartComponent } from "./components/keyword-reporting/keyword-reporting-pie-chart/keyword-reporting-pie-chart.component";
import { AdgroupReportingComponent } from "./components/adgroup-reporting/adgroup-reporting.component";
import { AggregateReportingComponent } from "./components/aggregate-reporting/aggregate-reporting.component";
import { CampaignReportingComponent } from "./components/campaign-reporting/campaign-reporting.component";
import { ReportingComponent } from "./components/reporting.component";
import { CampaignReportingLineChartComponent } from './components/campaign-reporting/campaign-reporting-line-chart/campaign-reporting-line-chart.component';

@NgModule({
  declarations: [
    ReportingComponent,
    LineChartComponent,
    KeywordReportingComponent,
    KeywordReportingLineChartComponent,
    KeywordReportingPieChartComponent,
    AggregateReportingComponent,
    AdgroupReportingComponent,
    CampaignReportingComponent,
    CampaignReportingLineChartComponent,
  ],
  imports: [
    CommonModule,
    ReportingRoutingModule,
    MatTabsModule,
    MaterialModule,
    AmplifyAngularModule,
    DynamicFormModule,
    ChartsModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ReportingModule {}
