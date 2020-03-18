export class SideNavPositioning {
    constructor() {
        this.sidenavCollapsed = JSON.parse(
            sessionStorage.getItem(SideNavPositioning.USER_PREFERENCE)
        );
        if (this.sidenavCollapsed) {
            this.sidenavWidth = 5;
        } else {
            this.sidenavWidth = 16;
            this.sidenavCollapsed = false;
        }
    }

    private static USER_PREFERENCE = 'userCollapsePreference';
    private sidenavCollapsed: boolean;
    private sidenavWidth: number;

    static clearUserPreference() {
        sessionStorage.removeItem(SideNavPositioning.USER_PREFERENCE);
    }

    toggle() {
        if (this.sidenavCollapsed) {
            this.sidenavCollapsed = false;
            this.sidenavWidth = 16;
        } else {
            this.sidenavCollapsed = true;
            this.sidenavWidth = 5;
        }
        sessionStorage.setItem(
            SideNavPositioning.USER_PREFERENCE,
            JSON.stringify(this.isCollapsed())
        );
    }

    getWidth(): number {
        return this.sidenavWidth;
    }

    isCollapsed() {
        return this.sidenavCollapsed;
    }
}
