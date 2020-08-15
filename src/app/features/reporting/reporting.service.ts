import { Injectable } from "@angular/core";
import { CostPerInstallDayObject } from "./models/cost-per-install-day-object";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ReportingService {
  costPerInstallDayObject$: BehaviorSubject<
    CostPerInstallDayObject[]
  > = new BehaviorSubject<CostPerInstallDayObject[]>([]);
  constructor() {}
}
