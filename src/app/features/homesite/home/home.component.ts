import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material";
import { Router } from "@angular/router";
import { chain } from "lodash";
import { take, tap } from "rxjs/operators";
import { ContactUsComponent } from "../contact-us/contact-us.component";
import { HomesiteFacade } from "../facades/homesite.facade";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
  constructor(
    public homesiteFacade: HomesiteFacade,
    private dialog: MatDialog
  ) {}

  ngOnInit() {}

  handleClick(endpoint: string) {
    window.open(endpoint, "_blank");
  }

  scrollToSectionHook(elementId: string) {
    const yOffset = -185;
    const element = document.getElementById(elementId);
    const y =
      element.getBoundingClientRect().top + window.pageYOffset + yOffset;

    window.scrollTo({ top: y, behavior: "smooth" });
  }
}
