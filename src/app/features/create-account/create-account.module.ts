import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CreateAccountComponent } from "./components/create-account.component";
import { FormsModule } from "@angular/forms";
import { MaterialModule } from "src/app/shared/material-design/material.module";
import { AmplifyAngularModule } from "aws-amplify-angular";
import { NgxSkeletonLoaderModule } from "ngx-skeleton-loader";
import { DynamicFormModule } from "src/app/shared/dynamic-form/dynamic-form.module";
import { SharedModule } from "src/app/shared/shared.module";

@NgModule({
  declarations: [CreateAccountComponent],
  imports: [
    CommonModule,
    MaterialModule,
    DynamicFormModule,
    SharedModule,
    NgxSkeletonLoaderModule,
    AmplifyAngularModule,
  ],
})
export class CreateAccountModule {}
