import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { PreferencesRoutingModule } from "./preferences-routing.module";
import { PreferencesComponent } from "./components/preferences.component";
import { MaterialModule } from "src/app/shared/material-design/material.module";
import { DynamicFormModule } from "src/app/shared/dynamic-form/dynamic-form.module";

@NgModule({
  declarations: [PreferencesComponent],
  imports: [
    CommonModule,
    PreferencesRoutingModule,
    MaterialModule,
    DynamicFormModule,
  ],
  exports: [PreferencesComponent],
})
export class PreferencesModule {}
