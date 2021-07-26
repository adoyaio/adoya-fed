import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { fromEvent } from "rxjs";
export interface DynamicModalDialogData {
  title?: string;
  subTitle?: string;
  content: string;
  actionYes?: string;
  actionNo?: string;
  btnTypes?: any;
  isCustom?: boolean;
  scrollToElementId?: string;
}

@Component({
  selector: "app-dynamic-modal",
  templateUrl: "./dynamic-modal.component.html",
  styleUrls: ["./dynamic-modal.component.scss"],
})
export class DynamicModalComponent implements OnInit {
  @ViewChild("modalTitle", { static: true })
  modalTitle: ElementRef;
  @ViewChild("modalSubTitle", { static: true })
  modalSubTitle: ElementRef;
  @ViewChild("modalTitleWrapper", { static: true })
  modalTitleWrapper: ElementRef;
  @ViewChild("content", { static: true }) content: ElementRef;

  @ViewChild("actionNoButton", { static: false }) actionNoButton: ElementRef;
  @ViewChild("actionYesButton", { static: false }) actionYesButton: ElementRef;
  @ViewChild("actionNo", { static: false }) actionNo: ElementRef;
  @ViewChild("actionYes", { static: false }) actionYes: ElementRef;

  hideTitle = true;
  hideSubTitle = true;
  showActionNo = false;
  showActionYes = false;
  constructor(
    public dialogRef: MatDialogRef<DynamicModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DynamicModalDialogData
  ) {}

  ngOnInit() {
    if (this.data.title) {
      this.hideTitle = false;
    } else {
      this.hideTitle = true;
    }

    if (this.data.subTitle) {
      this.hideSubTitle = false;
    } else {
      this.hideSubTitle = true;
    }

    if (this.data.actionNo) {
      this.showActionNo = true;
    } else {
      this.showActionNo = false;
    }

    if (this.data.actionYes) {
      this.showActionYes = true;
    } else {
      this.showActionYes = false;
    }
  }

  ngAfterViewInit() {
    if (this.hideTitle) {
      this.modalTitleWrapper.nativeElement.remove();
    } else {
      this.modalTitle.nativeElement.innerHTML = this.data.title;
      if (this.hideSubTitle) {
        this.modalSubTitle.nativeElement.remove();
      } else {
        this.modalSubTitle.nativeElement.innerHTML = this.data.subTitle;
      }
    }

    // fromEvent(this.actionNoButton.nativeElement, "click").subscribe(() =>
    //   this.onNoClick()
    // );

    if (this.showActionNo) {
      this.actionNo.nativeElement.innerHTML = this.data.actionNo;
    } else {
      this.actionNoButton.nativeElement.remove();
    }

    if (this.showActionYes) {
      this.actionYes.nativeElement.innerHTML = this.data.actionYes;
    } else {
      this.actionYesButton.nativeElement.remove();
    }

    this.content.nativeElement.innerHTML = this.data.content;
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onYesClick(): void {
    this.dialogRef.close(true);
  }
}
