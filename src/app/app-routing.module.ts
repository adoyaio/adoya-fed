import { PortalComponent } from "./features/portal/components/portal.component";
import { NgModule } from "@angular/core";
import { Routes, RouterModule, PreloadAllModules } from "@angular/router";
import { AuthGuard } from "./core/guards/auth.guard";
import { RegistrationComponent } from "./features/registration/components/registration.component";
import { HasRegisteredGuard } from "./core/guards/has-registered.guard";
import { SplashComponent } from "./features/homesite/splash/splash.component";
import { HomeComponent } from "./features/homesite/home/home.component";
import { OnboardingComponent } from "./features/onboarding/components/onboarding.component";

const routes: Routes = [
  {
    path: "",
    redirectTo: "portal",
    pathMatch: "full",
  },
  {
    path: "portal",
    component: PortalComponent,
    data: { title: "adoya" },
  },
  {
    path: "start",
    component: SplashComponent,
    data: { title: "Get Started with Adoya" },
  },
  {
    path: "home",
    component: HomeComponent,
    data: { title: "adoya" },
  },
  {
    path: "workbench",
    loadChildren: () =>
      import("./layout/secure-layout/secure-layout.module").then(
        (m) => m.SecureLayoutModule
      ),
    canActivate: [AuthGuard, HasRegisteredGuard],
    data: { title: "workbench" },
  },
  {
    path: "registration",
    component: RegistrationComponent,
    canActivate: [AuthGuard],
    data: { title: "Registration" },
  },
  {
    path: "onboarding",
    component: OnboardingComponent,
    canActivate: [AuthGuard],
    data: { title: "onboarding" },
  },
  {
    path: "legal",
    loadChildren: () =>
      import("./features/legal/legal.module").then((m) => m.LegalModule),

    data: { title: "legal" },
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
