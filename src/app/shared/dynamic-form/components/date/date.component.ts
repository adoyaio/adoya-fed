import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FieldConfig } from '../../interfaces/field.interface';
import { Validator } from '../../interfaces/validator.interface';

@Component({
    selector: 'app-date',
    template: `
        <mat-form-field class="field-item" [formGroup]="group">
            <input
                matInput
                [matDatepicker]="picker"
                [formControlName]="field.name"
                [placeholder]="field.label"
            />
            <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
            <mat-datepicker #picker></mat-datepicker>
            <mat-hint></mat-hint>
            <ng-container
                *ngFor="let validation of field.validations; trackBy: trackValidation"
                ngProjectAs="mat-error"
            >
                <mat-error *ngIf="group.get(field.name).hasError(validation.name)">{{
                    validation.message
                }}</mat-error>
            </ng-container>
            <mat-hint *ngIf="field.hint">{{ field.hint }}</mat-hint>
        </mat-form-field>
    `,
    styles: []
})
export class DateComponent {
    field: FieldConfig;
    group: FormGroup;

    trackValidation(index: any, validation: Validator) {
        return `${index}-${validation.name}`;
    }
}
