import { Component, OnInit } from "@angular/core";
import { HomesiteFacade } from "../facades/homesite.facade";

@Component({
  selector: "app-optimizations-carousel",
  templateUrl: "./optimizations-carousel.component.html",
  styleUrls: ["./optimizations-carousel.component.scss"],
})
export class OptimizationsCarouselComponent implements OnInit {
  constructor(public homesiteFacade: HomesiteFacade) {}

  ngOnInit() {}
}
