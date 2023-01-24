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
        "Optimizations",
        "/workbench/optimizations",
        "dashboard",
        undefined,
        undefined
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
        undefined
      )
    );

    this.navLinks.push(
      LayoutNavLinks.build(
        3,
        "button",
        "Preferences",
        "/workbench/preferences",
        "build",
        undefined,
        undefined
      )
    );

    // this.navLinks.push(
    //   LayoutNavLinks.build(
    //     4,
    //     "button",
    //     "Marketing Newsfeed",
    //     "/workbench/newsfeed",
    //     "dynamic_feed",
    //     undefined,
    //     undefined
    //   )
    // );

    this.navLinks.push(
      LayoutNavLinks.build(
        5,
        "button",
        "Account",
        "/workbench/account",
        "account_box",
        undefined,
        undefined
      )
    );

    this.navLinks.push(
      LayoutNavLinks.build(
        6,
        "button",
        "FAQ",
        "/workbench/faq",
        "help_center",
        undefined,
        undefined
      )
    );

    this.navLinks.push(
      LayoutNavLinks.build(
        7,
        "button",
        "Legal",
        "/workbench/policy",
        "policy",
        undefined,
        undefined
      )
    );

    this.navLinks.push(
      LayoutNavLinks.build(
        8,
        "button",
        "Support",
        "/workbench/support",
        "feedback",
        undefined,
        undefined
      )
    );
  }

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
