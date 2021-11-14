import { Component, OnInit } from "@angular/core";
import { HomesiteFacade } from "../facades/homesite.facade";

@Component({
  selector: "app-testimonial-carousel",
  templateUrl: "./testimonial-carousel.component.html",
  styleUrls: ["./testimonial-carousel.component.scss"],
})
export class TestimonialCarouselComponent implements OnInit {
  constructor(public homesiteFacade: HomesiteFacade) {}

  ngOnInit() {}
}
