import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AgentsComponent } from "./agents.component";
import { SharedModule } from "src/app/shared/shared.module";
import { DynamicFormModule } from "src/app/shared/dynamic-form/dynamic-form.module";

@NgModule({
  declarations: [AgentsComponent],
  imports: [CommonModule, SharedModule, DynamicFormModule],
  exports: [AgentsComponent],
})
export class AgentsModule {}
