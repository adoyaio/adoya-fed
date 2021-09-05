import { Injectable } from "@angular/core";
import { chain } from "lodash";

@Injectable({
  providedIn: "root",
})
export class HomesiteFacade {
  constructor() {}

  get allSlides() {
    return chain([
      this.reportingSlides,
      this.visulizeSlides,
      this.testimonialSlides,
    ])
      .flatMap()
      .value();
  }

  reportingSlides = [
    { image: "../../../assets/images/reporting-1.png" },
    { image: "../../../assets/images/reporting-7.png" },
  ];

  optimizeSlides = [
    { image: "../../../assets/images/optimize-1.png" },
    { image: "../../../assets/images/optimize-4.png" },
    { image: "../../../assets/images/optimize-5.png" },
    { image: "../../../assets/images/optimize-6.png" },
  ];

  visulizeSlides = [
    { image: "../../../assets/images/reporting-2.png" },
    { image: "../../../assets/images/reporting-3.png" },
  ];

  integrationSlides = [
    { image: "../../../assets/images/integration-1.png" },
    { image: "../../../assets/images/integration-2.png" },
  ];

  testimonialSlides = [
    { image: "../../../assets/images/testimonial-1.png" },
    { image: "../../../assets/images/testimonial-2.png" },
    { image: "../../../assets/images/testimonial-3.png" },
  ];
}
