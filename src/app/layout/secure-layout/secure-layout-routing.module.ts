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
        redirectTo: "main",
        pathMatch: "full"
      },
      {
        path: "main",
        loadChildren: () =>
          import("../../features/workbench/workbench.module").then(
            m => m.WorkbenchModule
          ),
        // canActivate: [AuthGuard],
        data: { title: "Dashboard" }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SecureLayoutRoutingModule {}
