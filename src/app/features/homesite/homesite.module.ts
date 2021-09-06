import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { SharedModule } from "src/app/shared/shared.module";
import { MatCarouselModule } from "@ngmodule/material-carousel";
import { SplashComponent } from "./splash/splash.component";
import { HomeComponent } from "./home/home.component";
import { MaterialModule } from "src/app/shared/material-design/material.module";
import { HomeSiteMenuComponent } from "./home-site-menu/home-site-menu.component";
import { ProductsComponent } from "./products/products.component";
import { PortalModule } from "@angular/cdk/portal";

@NgModule({
  declarations: [
    SplashComponent,
    HomeComponent,
    HomeSiteMenuComponent,
    ProductsComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    MatCarouselModule.forRoot(),
    MaterialModule,
    PortalModule,
  ],
  exports: [HomeComponent, SplashComponent, HomeSiteMenuComponent],
})
export class HomesiteModule {}