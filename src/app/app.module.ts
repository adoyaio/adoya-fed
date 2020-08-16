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

@NgModule({
  declarations: [AppComponent],
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
  ],
  providers: [AmplifyService],
  bootstrap: [AppComponent],
})
export class AppModule {}
