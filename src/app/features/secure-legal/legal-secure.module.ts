import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LegalSecureComponent } from "./legal-secure.component";
import { MaterialModule } from "src/app/shared/material-design/material.module";
import { LegalModule } from "../legal/legal.module";

@NgModule({
  declarations: [LegalSecureComponent],
  imports: [CommonModule, MaterialModule, LegalModule],
})
export class LegalSecureModule {}
