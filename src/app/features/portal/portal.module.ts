import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { PortalRoutingModule } from "./portal-routing.module";
import { PortalComponent } from "./components/portal.component";

import { AmplifyAngularModule, AmplifyService } from "aws-amplify-angular";

import { MaterialModule } from "src/app/shared/material-design/material.module";
import { SharedModule } from "src/app/shared/shared.module";
import { PortalInternalComponent } from "./components/portal-internal/portal-internal.component";

@NgModule({
  declarations: [PortalComponent, PortalInternalComponent],
  imports: [PortalRoutingModule, AmplifyAngularModule, SharedModule],
  providers: [AmplifyService],
  exports: [PortalComponent],
})
export class PortalModule {}
