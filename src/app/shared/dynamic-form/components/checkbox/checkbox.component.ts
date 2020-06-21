import { Component, Inject, Injector, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { FieldConfig } from '../../interfaces/field.interface';
import { Validator } from '../../interfaces/validator.interface';
import { FIELD, FORM } from '../../models/injection-tokens';
@Component({
    selector: 'app-checkbox',
    template: `
        <div class="field-item" [formGroup]="form">
            <mat-checkbox [formControlName]="field.name">{{ field.label }}</mat-checkbox>
        </div>
    `,
    styles: []
})
export class CheckboxComponent implements OnDestroy {
    field: any;
    form: any;

    _destroyed$: Subject<boolean> = new Subject<boolean>();
    constructor(
        @Inject(FIELD) private fieldInjected: Injector,
        @Inject(FORM) private formInjected: Injector
    ) {
        this.field = this.fieldInjected;
        this.form = this.formInjected;
    }

    ngOnDestroy(): void {
        this._destroyed$.next(true);
    }

    fieldHasError(form: FormGroup, field: FieldConfig, validation: Validator) {
        return form.controls[field.name].hasError(validation.name);
    }

    trackValidation(index: any, validation: Validator) {
        return `${index}-${validation.name}`;
    }
}
