import { DynamicFormModule } from "./shared/dynamic-form/dynamic-form.module";
import { HttpClientModule } from "@angular/common/http";
import { PortalModule } from "./features/portal/portal.module";
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AmplifyAngularModule, AmplifyService } from "aws-amplify-angular";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { ChartsModule } from "ng2-charts";
import { SecureLayoutModule } from "./layout/secure-layout/secure-layout.module";
import { RegistrationModule } from "./features/registration/registration.module";
import { SharedModule } from "./shared/shared.module";
import { DynamicModalComponent } from "./shared/dynamic-modal/dynamic-modal.component";
import { NgxSkeletonLoaderModule } from "ngx-skeleton-loader";
import { SplashComponent } from "./features/splash/splash.component";
import { MatCarouselModule } from "@ngmodule/material-carousel";

@NgModule({
  declarations: [AppComponent, SplashComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    PortalModule,
    AmplifyAngularModule,
    MatProgressSpinnerModule,
    HttpClientModule,
    DynamicFormModule,
    ChartsModule,
    RegistrationModule,
    SharedModule,
    NgxSkeletonLoaderModule,
    MatCarouselModule.forRoot(),
  ],
  providers: [AmplifyService],
  bootstrap: [AppComponent],
  entryComponents: [DynamicModalComponent],
})
export class AppModule {}
