import { Component, OnInit } from "@angular/core";
import { chain, find, get, set } from "lodash";

@Component({
  selector: "app-registration",
  templateUrl: "./registration.component.html",
  styleUrls: ["./registration.component.scss"],
})
export class RegistrationComponent implements OnInit {
  countries = ["United States", "Canada", "Japan"];
  apps = ["App ABC", "App ABC", "App ABC"]; // TODO load from api
  step2: any[] = [
    { ordinal: 1, complete: false, active: true },
    { ordinal: 2, complete: false, active: false },
    { ordinal: 3, complete: false, active: false },
  ];
  constructor() {}

  ngOnInit() {}

  isOrdinalActive(ordinal: number): boolean {
    const step = find(this.step2, (step) => step.ordinal === ordinal);
    return get(step, "active", false);
  }

  submitStep(ordinal: number) {
    const step = find(this.step2, (step) => step.ordinal === ordinal);
    set(step, "complete", true);
    set(step, "active", false);

    const nextStep = find(this.step2, (step) => step.ordinal === ordinal + 1);
    set(nextStep, "complete", false);
    set(nextStep, "active", true);
  }

  goBack(ordinal: number) {
    const step = find(this.step2, (step) => step.ordinal === ordinal);
    set(step, "complete", true);
    set(step, "active", false);

    const prevStep = find(this.step2, (step) => step.ordinal === ordinal - 1);
    set(prevStep, "complete", false);
    set(prevStep, "active", true);
  }
}
