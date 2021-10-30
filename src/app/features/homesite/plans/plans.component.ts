import { Component, OnInit } from "@angular/core";
import { HomesiteFacade } from "../facades/homesite.facade";

@Component({
  selector: "app-plans",
  templateUrl: "./plans.component.html",
  styleUrls: ["./plans.component.scss"],
})
export class PlansComponent implements OnInit {
  constructor(public homesiteFacade: HomesiteFacade) {}

  ngOnInit() {}
}
