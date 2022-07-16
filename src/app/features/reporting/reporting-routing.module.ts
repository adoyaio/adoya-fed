import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ReportingComponent } from "./components/reporting.component";

const routes: Routes = [
  {
    path: "",
    component: ReportingComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportingRoutingModule {}
