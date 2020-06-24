import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { WorkbenchRoutingModule } from "./workbench-routing.module";
import { WorkbenchComponent } from "./components/workbench.component";

import { AmplifyAngularModule, AmplifyService } from "aws-amplify-angular";
import { MaterialModule } from "src/app/shared/material-design/material.module";

@NgModule({
  declarations: [WorkbenchComponent],
  imports: [CommonModule, WorkbenchRoutingModule, MaterialModule],
})
export class WorkbenchModule {}
