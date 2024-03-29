import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material";
import { take, tap } from "rxjs/operators";
import { PortalComponent } from "../../portal/components/portal.component";
import { ContactUsComponent } from "../contact-us/contact-us.component";
import { HomesiteFacade } from "../facades/homesite.facade";

@Component({
  selector: "app-splash",
  templateUrl: "./splash.component.html",
  styleUrls: ["./splash.component.scss"],
})
export class SplashComponent implements OnInit {
  constructor(
    private dialog: MatDialog,
    public homesiteFacade: HomesiteFacade
  ) {}

  ngOnInit() {}
}
