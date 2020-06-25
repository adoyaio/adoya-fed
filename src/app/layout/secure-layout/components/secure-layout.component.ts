import { NavLinkService } from "./../services/nav-link.service";
import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { MatSidenav } from "@angular/material";

@Component({
  selector: "app-secure-layout",
  templateUrl: "./secure-layout.component.html",
  styleUrls: ["./secure-layout.component.scss"],
})
export class SecureLayoutComponent implements OnInit {
  @ViewChild("drawer", { static: true }) private drawer: MatSidenav;
  constructor(private router: Router, private navLinkService: NavLinkService) {}

  ngOnInit() {}

  toggleDrawer() {
    this.drawer.toggle();
  }
  handleLogoClick() {
    this.drawer.close();
  }
}
