import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LayoutNavLinks } from '../../models/layout-nav-links';
import { NavLinkService } from '../../services/nav-link.service';

@Component({
    selector: 'app-nav-links',
    templateUrl: './nav-links.component.html',
    styleUrls: ['./nav-links.component.scss']
})
export class NavLinksComponent {
    @Input()
    sidenavCollapsed: boolean;
    @Input()
    isMobile: boolean;

    @Output()
    navButtonClicked = new EventEmitter();

    openPanel = 0;

    constructor(private navLinkService: NavLinkService) {}

    setOpenPanel(index: number) {
        this.openPanel = index;
    }

    getOpenPanel() {
        return this.openPanel;
    }

    closePanel(panel: any) {
        if (panel.expanded) {
            this.openPanel = 0;
        }
    }

    subLinkSlideToggle(link: LayoutNavLinks, index: number) {
        const isSame = this.navLinkService.isTheSameLink(link);
        this.setOpenPanel(index);
        if (link.isOpen && isSame) {
            link.isOpen = false;
            this.navLinkService.setActiveLink(undefined);
        } else if (!link.isOpen && isSame) {
            link.isOpen = true;
            this.navLinkService.setActiveLink(link);
        } else if (link.isOpen && !isSame) {
            this.navLinkService.setActiveLink(link);
        } else if (!link.isOpen && !isSame) {
            link.isOpen = true;
            this.navLinkService.setActiveLink(link);
        }
    }

    getTooltipForSublink(link: LayoutNavLinks) {
        if (this.navLinkService.isTheSameLink(link)) {
            return undefined;
        } else {
            return link.title;
        }
    }

    handleClick(link: LayoutNavLinks, index: number) {
        this.navButtonClicked.emit();
        this.setOpenPanel(index);
        if (link.onclick) {
            link.onclick();
        }
    }

    isSvg(icon: string) {
        return icon.includes('svg.');
    }

    handleSubLinkClicked(index: number, link: LayoutNavLinks) {
        this.navLinkService.setActiveLink(link);
        this.closePanel(index);
    }

    trackLink(index: any, link: LayoutNavLinks) {
        return `${index}-${link.type}-${link.index}`;
    }
}
