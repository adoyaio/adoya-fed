import { Component, OnInit } from "@angular/core";
import { HomesiteFacade } from "../facades/homesite.facade";

@Component({
  selector: "app-mmp-carousel",
  templateUrl: "./mmp-carousel.component.html",
  styleUrls: ["./mmp-carousel.component.scss"],
})
export class MmpCarouselComponent implements OnInit {
  constructor(public homesiteFacade: HomesiteFacade) {}

  ngOnInit() {}
}
