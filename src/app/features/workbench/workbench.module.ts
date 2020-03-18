import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { WorkbenchRoutingModule } from "./workbench-routing.module";
import { WorkbenchComponent } from "./components/workbench.component";

import { AmplifyAngularModule, AmplifyService } from "aws-amplify-angular";

@NgModule({
  declarations: [WorkbenchComponent],
  imports: [CommonModule, WorkbenchRoutingModule]
})
export class WorkbenchModule {}
