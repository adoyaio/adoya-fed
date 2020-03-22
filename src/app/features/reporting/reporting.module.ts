import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ReportingRoutingModule } from "./reporting-routing.module";
import { ReportingComponent } from "./components/reporting.component";

import { MatTabsModule } from "@angular/material/tabs";

import { AmplifyAngularModule } from "aws-amplify-angular";
import { MaterialModule } from "src/app/shared/material-design/material.module";

@NgModule({
  declarations: [ReportingComponent],
  imports: [
    CommonModule,
    ReportingRoutingModule,
    MatTabsModule,
    MaterialModule,
    AmplifyAngularModule
  ]
})
export class ReportingModule {}
