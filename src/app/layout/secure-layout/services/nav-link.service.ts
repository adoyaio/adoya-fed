import { Injectable, OnDestroy } from "@angular/core";
import { Subject } from "rxjs";
import { takeUntil, tap } from "rxjs/operators";
import { LayoutNavLinks } from "../models/layout-nav-links";

@Injectable({
  providedIn: "root",
})
export class NavLinkService implements OnDestroy {
  navLinks: Array<LayoutNavLinks>;
  private activeLink;

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
        "Notifications",
        "/workbench/notifications",
        "dynamic_feed",
        undefined,
        () => {
          location.href = "/workbench/notifications";
        }
      )
    );

    this.navLinks.push(
      LayoutNavLinks.build(
        4,
        "button",
        "Account",
        "/workbench/account",
        "account_box",
        undefined,
        () => {
          location.href = "/workbench/account";
        }
      )
    );
    this.navLinks.push(
      LayoutNavLinks.build(
        5,
        "button",
        "Support",
        "/workbench/support",
        "feedback",
        undefined,
        () => {
          location.href = "/workbench/support";
        }
      )
    );
  }

  // setActiveLink(link: LayoutNavLinks) {
  //   if (this.activeLink && link) {
  //     this.activeLink.isOpen = false;
  //     link.setOpened();
  //     this.activeLink = link;
  //   } else if (!this.activeLink && link) {
  //     link.setOpened();
  //     this.activeLink = link;
  //   } else if (this.activeLink && !link) {
  //     this.activeLink.isOpen = false;
  //     this.activeLink = undefined;
  //   } else if (!this.activeLink && !link) {
  //     this.activeLink = undefined;
  //   }
  // }

  setActiveLink(index: number) {
    this.activeLink = index;
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
