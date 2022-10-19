import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { LegalRoutingModule } from "./legal-routing.module";
import { TermsComponent } from "./components/terms/terms.component";
import { PrivacyComponent } from "./components/privacy/privacy.component";
import { FaqComponent } from "./components/faq/faq.component";

@NgModule({
  declarations: [TermsComponent, PrivacyComponent, FaqComponent],
  imports: [CommonModule, LegalRoutingModule],
  exports: [TermsComponent, PrivacyComponent, FaqComponent],
})
export class LegalModule {}
