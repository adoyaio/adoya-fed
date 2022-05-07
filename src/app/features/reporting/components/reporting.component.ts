import { Component } from "@angular/core";

import {
  chain as _chain,
  includes as _includes,
  each as _each,
  map as _map,
  clone as _clone,
  cloneDeep as _cloneDeep,
} from "lodash";
import { ReportingService } from "../reporting.service";

@Component({
  selector: "app-reporting",
  templateUrl: "./reporting.component.html",
  styleUrls: ["./reporting.component.scss"],
})
export class ReportingComponent {
  constructor(public reportingService: ReportingService) {}
}
