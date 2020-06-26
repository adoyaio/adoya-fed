import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { AmplifyService } from "aws-amplify-angular";

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

  constructor(private titleService: Title) {}

  ngOnInit() {}

  toggleDrawer() {
    this.toggleDrawerCalled.emit();
  }

  getCollapseIcon() {
    return !this.sidenavCollapsed ? "navigate_before" : "navigate_next";
  }

  getPageTitle() {
    return this.titleService.getTitle();
  }
}
