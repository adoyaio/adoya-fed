import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { chain } from "lodash";
import { HomesiteFacade } from "../facades/homesite.facade";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
  constructor(public homesiteFacade: HomesiteFacade) {}

  ngOnInit() {}

  handleClick(endpoint: string) {
    window.open(endpoint, "_blank");
  }
}
