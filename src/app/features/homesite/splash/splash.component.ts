import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material";
import { take, tap } from "rxjs/operators";
import { PortalComponent } from "../../portal/components/portal.component";
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

  handleSignUpClick($event, signupType: string) {
    $event.preventDefault();
    $event.stopPropagation();
    this.dialog
      .open(PortalComponent, {
        data: {},
        maxWidth: "800px",
        width: "800px",
        panelClass: "tooltip-dialog-box",
        autoFocus: false,
      })
      .afterClosed()
      .pipe(
        take(1),
        tap((val) => {})
      )
      .subscribe();
  }
}
