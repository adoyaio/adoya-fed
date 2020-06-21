import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FieldConfig } from '../../interfaces/field.interface';
import { Validator } from '../../interfaces/validator.interface';
import { SelectOption } from '../../models/select-option';

@Component({
    selector: 'app-autocomplete',
    template: `
        <mat-form-field class="field-item" [formGroup]="group" [appearance]="field.appearance">
            <input
                matInput
                [readonly]="field.readonly"
                [formControlName]="field.name"
                [placeholder]="field.label"
                [type]="field.inputType"
                [appUpperCase]="field.uppercase"
                [matAutocomplete]="auto"
            />
            <mat-icon color="primary">search</mat-icon>
            <mat-autocomplete #auto="matAutocomplete">
                <mat-option
                    *ngFor="let option of this.filteredOptions | async; trackBy: trackOption"
                    [value]="option"
                >
                    {{ option.label }}
                </mat-option>
            </mat-autocomplete>
            <ng-container
                *ngFor="let validation of field.validations; trackBy: trackValidation"
                ngProjectAs="mat-error"
            >
                <mat-error *ngIf="fieldHasError(group, field, validation)">{{
                    validation.message
                }}</mat-error>
            </ng-container>
            <mat-hint *ngIf="field.hint">{{ field.hint }}</mat-hint>
        </mat-form-field>
    `,
    styles: []
})
export class AutocompleteComponent implements OnInit {
    field: FieldConfig;
    group: FormGroup;
    filteredOptions: Observable<SelectOption[]>;

    constructor() {}

    ngOnInit() {
        this.filteredOptions = this.group.controls[this.field.name].valueChanges.pipe(
            startWith(''),
            map(value => this._filter(value))
        );
    }

    _filter(value: string): SelectOption[] {
        if (!this.field.options) {
            return [];
        }
        const filterValue = value.toLowerCase();
        return this.field.options.filter(option =>
            option.label.toLowerCase().includes(filterValue)
        );
    }

    fieldHasError(group: FormGroup, field: FieldConfig, validation: Validator) {
        return group.controls[field.name].hasError(validation.name);
    }

    trackOption(index: any, option: SelectOption) {
        return `${index}-${option.value}`;
    }

    trackValidation(index: any, validation: Validator) {
        return `${index}-${validation.name}`;
    }
}
