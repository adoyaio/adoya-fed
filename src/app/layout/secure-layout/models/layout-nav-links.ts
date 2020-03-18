export class LayoutNavLinks {
    index: number;
    type: string;
    title: string;
    isOpen: boolean;
    routerLink: string;
    icon: string;
    subLinks: Array<LayoutNavLinks>;
    onclick: Function;

    static build(
        index: number,
        type: string,
        title: string,
        routerLink?: string,
        icon?: string,
        subLinks?: Array<LayoutNavLinks>,
        onclick?: Function
    ) {
        const retVal = new LayoutNavLinks();
        retVal.index = index;
        retVal.type = type;
        retVal.title = title;
        retVal.isOpen = false;
        if (routerLink) {
            retVal.routerLink = routerLink;
        }
        if (icon) {
            retVal.icon = icon;
        }
        if (subLinks) {
            retVal.subLinks = subLinks;
        }
        if (onclick) {
            retVal.onclick = onclick;
        }
        return retVal;
    }

    setOpened() {
        this.isOpen = true;
    }
}
