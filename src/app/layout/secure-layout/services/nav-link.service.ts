import { Injectable, OnDestroy } from "@angular/core";
import { Subject } from "rxjs";
import { takeUntil, tap } from "rxjs/operators";
import { LayoutNavLinks } from "../models/layout-nav-links";

@Injectable({
  providedIn: "root"
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
      LayoutNavLinks.build(1, "button", "Dashboard", "/pc/main", "dashboard")
    );

    this.navLinks.push(
      LayoutNavLinks.build(1, "button", "Account", "/pc/main", "dashboard")
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
