import { MainSectionComponent } from "./components/main-section/main-section.component";
import { NavLinksComponent } from "./components/nav-links/nav-links.component";
import { FooterComponent } from "./components/footer/footer.component";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MaterialModule } from "../../shared/material-design/material.module";

import { SecureLayoutRoutingModule } from "./secure-layout-routing.module";
import { SecureLayoutComponent } from "./components/secure-layout.component";
import { AmplifyAngularModule } from "aws-amplify-angular";
import { ReportingModule } from "src/app/features/reporting/reporting.module";
import { AccountModule } from "src/app/features/account/account.module";
import { SupportModule } from "src/app/features/support/support.module";
import { NewsfeedModule } from "src/app/features/newsfeed/newsfeed.module";
import { OptimizationsModule } from "src/app/features/optimizations/optimizations.module";
import { PreferencesModule } from "src/app/features/preferences/preferences.module";

@NgModule({
  declarations: [
    SecureLayoutComponent,
    MainSectionComponent,
    NavLinksComponent,
    FooterComponent,
  ],
  imports: [
    CommonModule,
    SecureLayoutRoutingModule,
    MaterialModule,
    AmplifyAngularModule,
    OptimizationsModule,
    ReportingModule,
    AccountModule,
    SupportModule,
    NewsfeedModule,
    PreferencesModule,
  ],
})
export class SecureLayoutModule {}
