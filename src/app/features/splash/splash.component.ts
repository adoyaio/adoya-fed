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
}
