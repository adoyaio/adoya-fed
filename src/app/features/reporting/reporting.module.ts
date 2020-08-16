import { DynamicFormModule } from "./../../shared/dynamic-form/dynamic-form.module";
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ReportingRoutingModule } from "./reporting-routing.module";
import { ReportingComponent } from "./components/reporting/reporting.component";

import { MatTabsModule } from "@angular/material/tabs";

import { AmplifyAngularModule } from "aws-amplify-angular";
import { MaterialModule } from "src/app/shared/material-design/material.module";
import { ChartsModule } from "ng2-charts";
import { LineChartComponent } from "./components/line-chart/line-chart.component";

@NgModule({
  declarations: [ReportingComponent, LineChartComponent],
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
