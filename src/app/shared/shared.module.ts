import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DynamicModalComponent } from "./dynamic-modal/dynamic-modal.component";
import { MaterialModule } from "./material-design/material.module";

@NgModule({
  declarations: [DynamicModalComponent],
  imports: [CommonModule, MaterialModule],
  exports: [MaterialModule],
})
export class SharedModule {}
