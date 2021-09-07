import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { SharedModule } from "src/app/shared/shared.module";
import { MatCarouselModule } from "@ngmodule/material-carousel";
import { SplashComponent } from "./splash/splash.component";
import { HomeComponent } from "./home/home.component";
import { MaterialModule } from "src/app/shared/material-design/material.module";
import { HomeSiteMenuComponent } from "./home-site-menu/home-site-menu.component";

import { PortalModule } from "@angular/cdk/portal";
import { ContactUsComponent } from "./contact-us/contact-us.component";
import { DynamicFormModule } from "src/app/shared/dynamic-form/dynamic-form.module";

@NgModule({
  declarations: [
    SplashComponent,
    HomeComponent,
    HomeSiteMenuComponent,
    ContactUsComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    MatCarouselModule.forRoot(),
    MaterialModule,
    PortalModule,
    DynamicFormModule,
  ],
  exports: [
    HomeComponent,
    SplashComponent,
    HomeSiteMenuComponent,
    ContactUsComponent,
  ],
})
export class HomesiteModule {}
