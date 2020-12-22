import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { AmplifyAngularModule, AmplifyService } from "aws-amplify-angular";
import { MaterialModule } from "src/app/shared/material-design/material.module";
import { DynamicFormModule } from "src/app/shared/dynamic-form/dynamic-form.module";
import { OptimizationsRoutingModule } from "./optimizations-routing.module";
import { OptimizationsComponent } from "./components/optimizations.component";

@NgModule({
  declarations: [OptimizationsComponent],
  imports: [
    CommonModule,
    OptimizationsRoutingModule,
    MaterialModule,
    DynamicFormModule,
  ],
})
export class OptimizationsModule {}
