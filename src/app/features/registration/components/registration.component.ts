import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-registration",
  templateUrl: "./registration.component.html",
  styleUrls: ["./registration.component.scss"],
})
export class RegistrationComponent implements OnInit {
  countries = ["United States", "Canada", "Japan"];
  apps = ["App ABC", "App ABC", "App ABC"];
  constructor() {}

  ngOnInit() {}
}
