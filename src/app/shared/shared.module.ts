import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DynamicModalComponent } from "./dynamic-modal/dynamic-modal.component";
import { MaterialModule } from "./material-design/material.module";
import { FooterComponent } from "./footer/footer.component";

@NgModule({
  declarations: [DynamicModalComponent, FooterComponent],
  imports: [CommonModule, MaterialModule],
  exports: [MaterialModule, FooterComponent],
})
export class SharedModule {}
