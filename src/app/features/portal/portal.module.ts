import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { PortalRoutingModule } from "./portal-routing.module";
import { PortalComponent } from "./components/portal.component";

import { AmplifyAngularModule, AmplifyService } from "aws-amplify-angular";

@NgModule({
  declarations: [PortalComponent],
  imports: [CommonModule, PortalRoutingModule, AmplifyAngularModule],
  providers: [AmplifyService]
})
export class PortalModule {}
