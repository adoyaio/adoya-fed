import { Injectable, OnDestroy } from "@angular/core";
import { Subject } from "rxjs";
import { takeUntil, tap } from "rxjs/operators";
import { LayoutNavLinks } from "../models/layout-nav-links";

@Injectable({
  providedIn: "root",
})
export class NavLinkService implements OnDestroy {
  navLinks: Array<LayoutNavLinks>;
  private activeLink: LayoutNavLinks;

  destroyed$: Subject<boolean> = new Subject<boolean>();

  constructor() {
    this.buildNavLinks();
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
  }

  buildNavLinks() {
    this.navLinks = new Array<LayoutNavLinks>();

    this.navLinks.push(
      LayoutNavLinks.build(
        1,
        "button",
        "Dashboard",
        "/workbench/dashboard",
        "dashboard",
        undefined,
        () => {
          location.href = "/workbench/dashboard";
        }
      )
    );

    this.navLinks.push(
      LayoutNavLinks.build(
        2,
        "button",
        "Reporting",
        "/workbench/reporting",
        "assessment",
        undefined,
        () => {
          location.href = "/workbench/reporting";
        }
      )
    );

    this.navLinks.push(
      LayoutNavLinks.build(
        3,
        "button",
        "Account",
        "/portal",
        "account_box",
        undefined,
        () => {
          location.href = "/portal";
        }
      )
    );
    this.navLinks.push(
      LayoutNavLinks.build(
        4,
        "button",
        "Feedback",
        "/workbench/feedback",
        "feedback",
        undefined,
        () => {
          location.href = "/workbench/feedback";
        }
      )
    );
  }

  setActiveLink(link: LayoutNavLinks) {
    if (this.activeLink && link) {
      this.activeLink.isOpen = false;
      link.setOpened();
      this.activeLink = link;
    } else if (!this.activeLink && link) {
      link.setOpened();
      this.activeLink = link;
    } else if (this.activeLink && !link) {
      this.activeLink.isOpen = false;
      this.activeLink = undefined;
    } else if (!this.activeLink && !link) {
      this.activeLink = undefined;
    }
  }

  isTheSameLink(link: LayoutNavLinks) {
    if (!link) {
      return false;
    }
    if (!this.activeLink) {
      return false;
    }
    return link.title === this.activeLink.title;
  }

  getActiveLink() {
    return this.activeLink;
  }
}
