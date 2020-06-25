import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { AccountRoutingModule } from "./account-routing.module";
import { AccountComponent } from "./components/account.component";
import { MaterialModule } from "src/app/shared/material-design/material.module";

@NgModule({
  declarations: [AccountComponent],
  imports: [CommonModule, AccountRoutingModule, MaterialModule],
})
export class AccountModule {}
