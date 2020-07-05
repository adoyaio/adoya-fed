import { Component, EventEmitter, Input, Output } from "@angular/core";
import { LayoutNavLinks } from "../../models/layout-nav-links";
import { NavLinkService } from "../../services/nav-link.service";
import { AmplifyService } from "aws-amplify-angular";
import { Router } from "@angular/router";

@Component({
  selector: "app-nav-links",
  templateUrl: "./nav-links.component.html",
  styleUrls: ["./nav-links.component.scss"],
})
export class NavLinksComponent {
  @Input()
  sidenavCollapsed: boolean;
  @Input()
  isMobile: boolean;

  @Output()
  navButtonClicked = new EventEmitter();

  constructor(
    public navLinkService: NavLinkService,
    public amplifyService: AmplifyService,
    public router: Router
  ) {
    // this.amplifyService.authStateChange$.subscribe((authState) => {
    //   if (authState.state === "signedIn") {
    //     this.router.navigateByUrl("/workbench/reporting");
    //   } else {
    //     this.router.navigateByUrl("/portal");
    //   }
    // });
  }

  usernameAttributes = "email";

  getTooltipForSublink(link: LayoutNavLinks) {
    if (this.navLinkService.isTheSameLink(link)) {
      return undefined;
    } else {
      return link.title;
    }
  }

  handleClick(link: LayoutNavLinks, index: number) {
    this.navButtonClicked.emit();
    this.navLinkService.setActiveLink(index);
    if (link.onclick) {
      link.onclick();
    }
  }

  isSvg(icon: string) {
    return icon.includes("svg.");
  }

  trackLink(index: any, link: LayoutNavLinks) {
    return `${index}-${link.type}-${link.index}`;
  }
}
