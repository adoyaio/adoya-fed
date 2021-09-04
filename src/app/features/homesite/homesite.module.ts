import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { SharedModule } from "src/app/shared/shared.module";
import { MatCarouselModule } from "@ngmodule/material-carousel";
import { SplashComponent } from "./splash/splash.component";
import { HomeComponent } from "./home/home.component";
import { MaterialModule } from "src/app/shared/material-design/material.module";
import { HomeSiteMenuComponent } from "./home-site-menu/home-site-menu.component";

@NgModule({
  declarations: [SplashComponent, HomeComponent, HomeSiteMenuComponent],
  imports: [
    CommonModule,
    SharedModule,
    MatCarouselModule.forRoot(),
    MaterialModule,
  ],
  exports: [HomeComponent, SplashComponent, HomeSiteMenuComponent],
})
export class HomesiteModule {}
