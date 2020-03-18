import { MainSectionComponent } from "./components/main-section/main-section.component";
import { NavLinksComponent } from "./components/nav-links/nav-links.component";
import { FooterComponent } from "./components/footer/footer.component";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MaterialModule } from "../../shared/material-design/material.module";

import { SecureLayoutRoutingModule } from "./secure-layout-routing.module";
import { SecureLayoutComponent } from "./components/secure-layout.component";
import { AmplifyAngularModule } from "aws-amplify-angular";

@NgModule({
  declarations: [
    SecureLayoutComponent,
    MainSectionComponent,
    NavLinksComponent,
    FooterComponent
  ],
  imports: [
    CommonModule,
    SecureLayoutRoutingModule,
    MaterialModule,
    AmplifyAngularModule
  ]
})
export class SecureLayoutModule {}
