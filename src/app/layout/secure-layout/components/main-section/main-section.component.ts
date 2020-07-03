import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { AmplifyService } from "aws-amplify-angular";
import { Router } from "@angular/router";

@Component({
  selector: "app-main-section",
  templateUrl: "./main-section.component.html",
  styleUrls: ["./main-section.component.scss"],
})
export class MainSectionComponent implements OnInit {
  @Input()
  isMobile: boolean;

  @Input()
  sidenavCollapsed: boolean;

  @Output()
  toggleDrawerCalled = new EventEmitter();

  constructor(private titleService: Title, private router: Router) {}

  ngOnInit() {}

  toggleDrawer() {
    this.toggleDrawerCalled.emit();
  }

  getPageTitle() {
    return this.titleService.getTitle();
  }

  onProfileClicked() {
    this.router.navigateByUrl("/workbench/account");
  }
  onLogoutClicked() {
    this.router.navigateByUrl("/portal");
  }
}
