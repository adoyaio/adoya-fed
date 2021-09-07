import { Component, Input, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material";
import { Router } from "@angular/router";
import { take, tap } from "rxjs/operators";
import { ContactUsComponent } from "../contact-us/contact-us.component";

@Component({
  selector: "app-home-site-menu",
  templateUrl: "./home-site-menu.component.html",
  styleUrls: ["./home-site-menu.component.scss"],
})
export class HomeSiteMenuComponent implements OnInit {
  @Input() activeButton: string;

  constructor(private router: Router, private dialog: MatDialog) {}

  ngOnInit() {}

  handleClick(path: string) {
    this.router.navigate([`${path.toLowerCase()}`]);
  }

  onProfileClicked() {
    this.router.navigate(["portal"]);
  }

  handleContactClick() {
    this.dialog
      .open(ContactUsComponent, {
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
