import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { PortalRoutingModule } from "./portal-routing.module";
import { PortalComponent } from "./components/portal.component";

import { AmplifyAngularModule, AmplifyService } from "aws-amplify-angular";
import { NavLinksComponent } from "src/app/layout/secure-layout/components/nav-links/nav-links.component";
import { MaterialModule } from "src/app/shared/material-design/material.module";

@NgModule({
  declarations: [PortalComponent],
  imports: [
    CommonModule,
    PortalRoutingModule,
    AmplifyAngularModule,
    MaterialModule,
  ],
  providers: [AmplifyService],
})
export class PortalModule {}
