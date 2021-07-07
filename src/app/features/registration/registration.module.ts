import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { RegistrationRoutingModule } from "./registration-routing.module";
import { MaterialModule } from "src/app/shared/material-design/material.module";
import { DynamicFormModule } from "src/app/shared/dynamic-form/dynamic-form.module";
import { RegistrationComponent } from "./components/registration.component";
import { SharedModule } from "src/app/shared/shared.module";

import { DynamicModalComponent } from "src/app/shared/dynamic-modal/dynamic-modal.component";
import { NgxSkeletonLoaderModule } from "ngx-skeleton-loader";

@NgModule({
  declarations: [RegistrationComponent],
  imports: [
    CommonModule,
    RegistrationRoutingModule,
    MaterialModule,
    DynamicFormModule,
    SharedModule,
    NgxSkeletonLoaderModule
  ],
  providers: [],
})
export class RegistrationModule {}
