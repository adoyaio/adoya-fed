import {Component, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {FieldConfig} from '../../interfaces/field.interface';

@Component({
  selector: 'app-button',
  template: `
    <div class="field-item" [formGroup]="group">
      <button type="submit" mat-raised-button color="primary" *ngIf="this.group.dirty && field.displayOnFormChange">{{field.label}}</button>
    </div>
  `,
  styles: []
})
export class ButtonComponent implements OnInit {
  field: FieldConfig;
  group: FormGroup;
  constructor() {}
  ngOnInit() {}
}
