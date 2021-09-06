import { Component, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-home-site-menu",
  templateUrl: "./home-site-menu.component.html",
  styleUrls: ["./home-site-menu.component.scss"],
})
export class HomeSiteMenuComponent implements OnInit {
  @Input() activeButton: string;

  constructor(private router: Router) {}

  ngOnInit() {}

  handleClick(path: string) {
    this.router.navigate([`${path.toLowerCase()}`]);
  }

  onProfileClicked() {
    this.router.navigate(["portal"]);
  }
}
