import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ClickwrapComponent } from "./components/clickwrap/clickwrap.component";
import { FaqComponent } from "./components/faq/faq.component";
import { PrivacyComponent } from "./components/privacy/privacy.component";
import { TermsComponent } from "./components/terms/terms.component";

const routes: Routes = [
  {
    path: "",
    component: TermsComponent,
  },
  {
    path: "terms",
    component: TermsComponent,
  },
  {
    path: "privacy",
    component: PrivacyComponent,
  },
  {
    path: "faq",
    component: FaqComponent,
  },
  {
    path: "clickwrap",
    component: ClickwrapComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LegalRoutingModule {}
