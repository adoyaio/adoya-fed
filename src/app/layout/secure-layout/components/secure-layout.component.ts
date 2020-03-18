import { NavLinkService } from "./../services/nav-link.service";
import { MaterialModule } from "./../../../shared/material-design/material.module";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-secure-layout",
  templateUrl: "./secure-layout.component.html",
  styleUrls: ["./secure-layout.component.scss"]
})
export class SecureLayoutComponent implements OnInit {
  constructor(private router: Router, private navLinkService: NavLinkService) {}

  ngOnInit() {}

  toggleDrawer() {
    this.navLinkService.setActiveLink(undefined);
  }
}
