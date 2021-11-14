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
import { MmpCarouselComponent } from './mmp-carousel/mmp-carousel.component';
import { TestimonialCarouselComponent } from './testimonial-carousel/testimonial-carousel.component';
import { ReportingCarouselComponent } from './reporting-carousel/reporting-carousel.component';
import { OptimizationsCarouselComponent } from './optimizations-carousel/optimizations-carousel.component';
import { HomesitePartnersComponent } from './homesite-partners/homesite-partners.component';
import { PlansComponent } from './plans/plans.component';

@NgModule({
  declarations: [
    SplashComponent,
    HomeComponent,
    HomeSiteMenuComponent,
    ContactUsComponent,
    MmpCarouselComponent,
    TestimonialCarouselComponent,
    ReportingCarouselComponent,
    OptimizationsCarouselComponent,
    HomesitePartnersComponent,
    PlansComponent,
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
