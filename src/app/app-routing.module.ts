import { PortalComponent } from "./features/portal/components/portal.component";
import { NgModule } from "@angular/core";
import { Routes, RouterModule, PreloadAllModules } from "@angular/router";
import { AuthGuard } from "./core/guards/auth.guard";

const routes: Routes = [
  {
    path: "",
    redirectTo: "portal",
    pathMatch: "full",
  },
  {
    path: "portal",
    component: PortalComponent,
    data: { title: "Adoya portal" },
  },
  {
    path: "workbench",
    loadChildren: () =>
      import("./layout/secure-layout/secure-layout.module").then(
        (m) => m.SecureLayoutModule
      ),
    canActivate: [AuthGuard],
    data: { title: "Workbench" },
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      // enableTracing: true,
      preloadingStrategy: PreloadAllModules,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
