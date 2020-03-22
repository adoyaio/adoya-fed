import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AuthGuard } from "src/app/core/guards/auth.guard";
import { SecureLayoutComponent } from "./components/secure-layout.component";

const routes: Routes = [
  {
    path: "",
    component: SecureLayoutComponent,
    children: [
      {
        path: "",
        redirectTo: "dashboard",
        pathMatch: "full"
      },
      {
        path: "dashboard",
        loadChildren: () =>
          import("../../features/workbench/workbench.module").then(
            m => m.WorkbenchModule
          ),
        // canActivate: [AuthGuard],
        data: { title: "Dashboard" }
      },
      {
        path: "reporting",
        loadChildren: () =>
          import("../../features/reporting/reporting.module").then(
            m => m.ReportingModule
          ),
        // canActivate: [AuthGuard],
        data: { title: "Reporting" }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SecureLayoutRoutingModule {}
