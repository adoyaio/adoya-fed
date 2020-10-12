import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { SupportRoutingModule } from "./support-routing.module";
import { SupportComponent } from "./components/support.component";
import { MaterialModule } from "src/app/shared/material-design/material.module";
import { DynamicFormModule } from "src/app/shared/dynamic-form/dynamic-form.module";

@NgModule({
  declarations: [SupportComponent],
  imports: [
    CommonModule,
    SupportRoutingModule,
    MaterialModule,
    DynamicFormModule,
  ],
})
export class SupportModule {}
