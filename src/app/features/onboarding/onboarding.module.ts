import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { OnboardingRoutingModule } from "./onboarding-routing.module";
import { OnboardingComponent } from "./components/onboarding.component";
import { MaterialModule } from "src/app/shared/material-design/material.module";
import { DynamicFormModule } from "src/app/shared/dynamic-form/dynamic-form.module";
import { SharedModule } from "src/app/shared/shared.module";
import { NgxSkeletonLoaderModule } from "ngx-skeleton-loader";
import { AmplifyAngularModule, AmplifyService } from "aws-amplify-angular";

@NgModule({
  declarations: [OnboardingComponent],
  imports: [
    CommonModule,
    OnboardingRoutingModule,
    MaterialModule,
    DynamicFormModule,
    SharedModule,
    NgxSkeletonLoaderModule,
    AmplifyAngularModule,
  ],
  providers: [AmplifyService],
})
export class OnboardingModule {}
