import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AuthGuard } from "src/app/core/guards/auth.guard";
import { SecureLayoutComponent } from "./components/secure-layout.component";

import { AccountComponent } from "src/app/features/account/components/account.component";
import { SupportComponent } from "src/app/features/support/components/support.component";

import { NewsfeedComponent } from "src/app/features/newsfeed/components/newsfeed.component";

import { OptimizationsComponent } from "src/app/features/optimizations/components/optimizations.component";
import { PreferencesComponent } from "src/app/features/preferences/components/preferences.component";
import { ReportingComponent } from "src/app/features/reporting/components/reporting.component";
import { FaqComponent } from "src/app/features/legal/components/faq/faq.component";
import { LegalSecureComponent } from "src/app/features/secure-legal/legal-secure.component";
import { AgentsComponent } from "src/app/features/agents/agents.component";

const routes: Routes = [
  {
    path: "",
    component: SecureLayoutComponent,
    children: [
      {
        path: "",
        redirectTo: "optimizations",
        pathMatch: "full",
      },
      {
        path: "optimizations",
        component: OptimizationsComponent,
        // loadChildren: () =>
        //   import("../../features/workbench/workbench.module").then(
        //     (m) => m.WorkbenchModule
        //   ),
        // canActivate: [AuthGuard],
        data: { title: "Settings" },
      },
      {
        path: "preferences",
        component: PreferencesComponent,
        // loadChildren: () =>
        //   import("../../features/workbench/workbench.module").then(
        //     (m) => m.WorkbenchModule
        //   ),
        // canActivate: [AuthGuard],
        data: { title: "Preferences" },
      },
      {
        path: "reporting",
        component: ReportingComponent,
        // loadChildren: () =>
        //   import("../../features/reporting/reporting.module").then(
        //     (m) => m.ReportingModule
        //   ),
        // canActivate: [AuthGuard],
        data: { title: "Reporting" },
      },
      {
        path: "account",
        component: AccountComponent,
        // loadChildren: () =>
        //   import("../../features/account/account.module").then(
        //     (m) => m.AccountModule
        //   ),
        // canActivate: [AuthGuard],
        data: { title: "Account" },
      },
      {
        path: "support",
        component: SupportComponent,
        // loadChildren: () =>
        //   import("../../features/support/support.module").then(
        //     (m) => m.SupportModule
        //   ),
        // canActivate: [AuthGuard],
        data: { title: "Support" },
      },
      {
        path: "newsfeed",
        component: NewsfeedComponent,
        // loadChildren: () =>
        //   import("../../features/support/support.module").then(
        //     (m) => m.SupportModule
        //   ),
        // canActivate: [AuthGuard],
        data: { title: "Marketing Newsfeed" },
      },
      {
        path: "faq",
        component: FaqComponent,
        data: { title: "FAQ" },
      },
      {
        path: "policy",
        component: LegalSecureComponent,
        data: { title: "Legal" },
      },
      {
        path: "applications",
        component: AgentsComponent,
        data: { title: "Applications" },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SecureLayoutRoutingModule {}
