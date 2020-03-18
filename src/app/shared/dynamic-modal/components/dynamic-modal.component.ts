import {
  Component,
  Inject,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnInit
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DynamicModalDialogData } from '../interfaces/DynamicModalDialogData';
import { fromEvent } from 'rxjs';

@Component({
  template: `
    <div #modalTitleWrapper class="dynamic-modal__title">
      <span #modalTitle class="dynamic-modal__title-text"></span>
    </div>
    <div class="dynamic-modal__content" #content></div>
    <div class="dynamic-modal__actions float-right" mat-dialog-actions>
      <button #actionNoButton color="primary" mat-stroked-button>
        <span #actionNo></span>
      </button>
      <button #actionYesButton color="primary" mat-stroked-button>
        <span #actionYes></span>
      </button>
    </div>
  `,
  styleUrls: ['./dynamic-modal.component.scss']
})
export class DynamicModalComponent implements OnInit, AfterViewInit {
  @ViewChild('modalTitle', { static: true }) modalTitle;
  @ViewChild('modalTitleWrapper', { static: true }) modalTitleWrapper;
  @ViewChild('content', { static: true }) content;
  @ViewChild('actionNoButton', { read: ElementRef, static: true })
  actionNoButton: ElementRef;
  @ViewChild('actionYesButton', { read: ElementRef, static: true })
  actionYesButton: ElementRef;
  @ViewChild('actionNo', { static: true }) actionNo;
  @ViewChild('actionYes', { static: true }) actionYes;
  hideTitle = true;
  showActionNo = false;
  showActionYes = false;

  constructor(
    public dialogRef: MatDialogRef<DynamicModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DynamicModalDialogData
  ) {}

  ngOnInit() {
    // set values on dynamic modal based on params coming in from DynamicModalDialogData
    if (this.data.title) {
      this.hideTitle = false;
    } else {
      this.hideTitle = true;
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
    }

    if (this.showActionNo) {
      this.actionNo.nativeElement.innerHTML = this.data.actionNo;
      fromEvent(this.actionNoButton.nativeElement, 'click').subscribe(() =>
        this.onNoClick()
      );
    } else {
      this.actionNoButton.nativeElement.remove();
    }

    if (this.showActionYes) {
      this.actionYes.nativeElement.innerHTML = this.data.actionYes;
      fromEvent(this.actionYesButton.nativeElement, 'click').subscribe(() =>
        this.onYesClick()
      );
    } else {
      this.actionYesButton.nativeElement.remove();
    }

    this.content.nativeElement.innerHTML = this.data.content;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onYesClick(): void {
    this.dialogRef.close(true);
  }
}
