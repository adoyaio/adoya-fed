import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-splash",
  templateUrl: "./splash.component.html",
  styleUrls: ["./splash.component.scss"],
})
export class SplashComponent implements OnInit {
  constructor() {}

  ngOnInit() {}

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
}
