import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { AmplifyAngularModule, AmplifyService } from "aws-amplify-angular";
import { MaterialModule } from "src/app/shared/material-design/material.module";
import { DynamicFormModule } from "src/app/shared/dynamic-form/dynamic-form.module";
import { DashboardRoutingModule } from "./dashboard-routing.module";
import { DashboardComponent } from "./components/dashboard.component";

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    MaterialModule,
    DynamicFormModule,
  ],
})
export class DashboardModule {}
