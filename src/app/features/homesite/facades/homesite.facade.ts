import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material";
import { chain } from "lodash";
import { take, tap } from "rxjs/operators";
import { PortalComponent } from "../../portal/components/portal.component";
import { ContactUsComponent } from "../contact-us/contact-us.component";

@Injectable({
  providedIn: "root",
})
export class HomesiteFacade {
  constructor(private dialog: MatDialog) {}

  get allSlides() {
    return chain([this.reportingSlides, this.optimizeSlides]).flatMap().value();
  }

  get allSlidesNumber() {
    return chain([this.reportingSlides, this.optimizeSlides])
      .toLength()
      .value();
  }

  reportingSlides = [
    { image: "../../../assets/images/reporting-1.png" },
    { image: "../../../assets/images/reporting-7.png" },
    { image: "../../../assets/images/reporting-2.png" },
    { image: "../../../assets/images/reporting-3.png" },
  ];

  optimizeSlides = [
    { image: "../../../assets/images/optimize-1.png" },
    { image: "../../../assets/images/optimize-4.png" },
    { image: "../../../assets/images/optimize-5.png" },
    { image: "../../../assets/images/optimize-6.png" },
  ];

  integrationSlides = [
    { image: "../../../assets/images/integration-1.png" },
    { image: "../../../assets/images/integration-2.png" },
  ];

  testimonialSlides = [
    { image: "../../../assets/images/testimonial-1.png" },
    { image: "../../../assets/images/testimonial-2.png" },
    { image: "../../../assets/images/testimonial-3.png" },
  ];

  handleSignUpClick($event, signupType: string) {
    $event.preventDefault();
    $event.stopPropagation();
    this.dialog
      .open(PortalComponent, {
        data: {},
        maxWidth: "800px",
        width: "800px",
        panelClass: "tooltip-dialog-box",
        autoFocus: false,
      })
      .afterClosed()
      .pipe(
        take(1),
        tap((val) => {})
      )
      .subscribe();
  }

  handleContactClick() {
    this.dialog
      .open(ContactUsComponent, {
        data: {},
        maxWidth: "800px",
        width: "800px",
        panelClass: "tooltip-dialog-box",
        autoFocus: false,
      })
      .afterClosed()
      .pipe(
        take(1),
        tap((val) => {})
      )
      .subscribe();
  }
}
