//import { Component } from "@angular/core";

// @Component({
//   selector: 'app-root',
//   templateUrl: './app.component.html',
//   styleUrls: ['./app.component.scss']
// })
// export class AppComponent {
//   title = 'adoya-fed';
// }

import { AfterViewInit, Component, OnDestroy } from "@angular/core";
import { Title } from "@angular/platform-browser";
import {
  ActivatedRoute,
  NavigationCancel,
  NavigationEnd,
  NavigationStart,
  Router,
} from "@angular/router";
import { Subject } from "rxjs";
import { filter, map, mergeMap, takeUntil } from "rxjs/operators";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements AfterViewInit, OnDestroy {
  isAppLoading = true;
  destroyed$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private titleService: Title,
    private activatedRoute: ActivatedRoute
  ) {
    this.titleService.setTitle("adoya client portal");
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationStart),
        takeUntil(this.destroyed$)
      )
      .subscribe();

    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationCancel),
        takeUntil(this.destroyed$)
      )
      .subscribe();

    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => {
          return this.activatedRoute;
        }),
        map((r) => {
          while (r.firstChild) {
            r = r.firstChild;
          }
          return r;
        }),
        filter((r) => r.outlet === "primary"),
        mergeMap((r) => r.data),
        map((event) => this.titleService.setTitle(event["title"])),
        takeUntil(this.destroyed$)
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.isAppLoading = false;
    }, 0);
  }
}
