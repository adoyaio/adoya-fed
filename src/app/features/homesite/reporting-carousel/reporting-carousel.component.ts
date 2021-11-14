import { Component, OnInit } from "@angular/core";
import { HomesiteFacade } from "../facades/homesite.facade";

@Component({
  selector: "app-reporting-carousel",
  templateUrl: "./reporting-carousel.component.html",
  styleUrls: ["./reporting-carousel.component.scss"],
})
export class ReportingCarouselComponent implements OnInit {
  constructor(public homesiteFacade: HomesiteFacade) {}

  ngOnInit() {}
}
