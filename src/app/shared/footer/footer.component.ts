import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { MatDialog } from "@angular/material";
import { take, tap } from "rxjs/operators";
import { AppService } from "src/app/core/services/app.service";
import { ContactUsComponent } from "src/app/features/homesite/contact-us/contact-us.component";
import { DynamicModalComponent } from "../dynamic-modal/dynamic-modal.component";

@Component({
  selector: "app-footer",
  templateUrl: "./footer.component.html",
  styleUrls: ["./footer.component.scss"],
})
export class FooterComponent implements OnInit {
  @Output() printCalled: EventEmitter<any> = new EventEmitter<any>();
  constructor(private dialog: MatDialog) {}

  ngOnInit() {}

  handleShowTermsClick($event) {
    $event.preventDefault();
    this.dialog
      .open(DynamicModalComponent, {
        data: {
          title: ``,
          content: AppService.termsOfService,
          actionYes: "Save",
          actionNo: "Close",
        },
        maxWidth: "500px",
        width: "500px",
        panelClass: "tooltip-dialog-box",
        autoFocus: false,
      })
      .afterClosed()
      .pipe(
        take(1),
        tap((val) => {
          if (val) {
            this.printCalled.emit({ text: AppService.termsOfService });
          }
        })
      )
      .subscribe();
  }

  handleShowPrivacyClick($event) {
    $event.preventDefault();

    this.dialog
      .open(DynamicModalComponent, {
        data: {
          title: ``,
          content: AppService.privacyPolicy,
          actionYes: "Save",
          actionNo: "Close",
        },
        maxWidth: "500px",
        width: "500px",
        panelClass: "tooltip-dialog-box",
        autoFocus: false,
      })
      .afterClosed()
      .pipe(
        take(1),
        tap((val) => {
          if (val) {
            this.printCalled.emit({ text: AppService.privacyPolicy });
          }
        })
      )
      .subscribe();
  }

  handleShowFAQClick($event) {
    $event.preventDefault();

    this.dialog
      .open(DynamicModalComponent, {
        data: {
          title: ``,
          content: AppService.faqs,
          actionYes: "Save",
          actionNo: "Close",
        },
        maxWidth: "500px",
        width: "500px",
        panelClass: "tooltip-dialog-box",
        autoFocus: false,
      })
      .afterClosed()
      .pipe(
        take(1),
        tap((val) => {
          if (val) {
            this.printCalled.emit({ text: AppService.faqs });
          }
        })
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
