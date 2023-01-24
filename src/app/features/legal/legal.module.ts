import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { LegalRoutingModule } from "./legal-routing.module";
import { TermsComponent } from "./components/terms/terms.component";
import { PrivacyComponent } from "./components/privacy/privacy.component";
import { FaqComponent } from "./components/faq/faq.component";
import { ClickwrapComponent } from "./components/clickwrap/clickwrap.component";

@NgModule({
  declarations: [
    TermsComponent,
    PrivacyComponent,
    FaqComponent,
    ClickwrapComponent,
  ],
  imports: [CommonModule, LegalRoutingModule],
  exports: [TermsComponent, PrivacyComponent, FaqComponent, ClickwrapComponent],
})
export class LegalModule {}
