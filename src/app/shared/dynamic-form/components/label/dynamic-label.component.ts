import { Component, Inject, Injector } from '@angular/core';
import { FIELD, FORM } from '../../models/injection-tokens';
import { FormUtils } from '../../utils/form-utils';

@Component({
    selector: 'app-label',
    template: `
        <div class="field-item-label my-2" *ngIf="form.controls[field.name].value">
            <div class="field-item-wrapper flex-column pb-3">
                <label *ngIf="field.label" class="labeled-describe">{{ getPlaceholder() }}</label
                ><label class="labeled-value">{{ getValue() }}</label>
                <mat-hint *ngIf="field.hint">{{ field.hint }}</mat-hint>
            </div>
        </div>
    `,
    styles: [
        `
            .labeled-describe {
                font-size: 12px;
            }
            .labeled-value {
                font-size: 12px;
            }
        `
    ]
})
export class DynamicLabelComponent {
    field: any;
    form: any;

    constructor(
        @Inject(FIELD) private fieldInjected: Injector,
        @Inject(FORM) private formInjected: Injector
    ) {
        this.field = this.fieldInjected;
        this.form = this.formInjected;
    }

    getValue() {
        if (this.field.type === 'select') {
            if (!this.field.options) {
                return '';
            }
            const found = this.field.options.find(
                o => o.value === this.form.controls[this.field.name].value
            );
            if (found) {
                return found.label;
            } else {
                return '';
            }
        }
        return this.form.controls[this.field.name].value;
    }

    getPlaceholder() {
        if (!FormUtils.fieldIsRequired(this.field)) {
            return this.field.label + ' (Optional)';
        }
        return this.field.label;
    }
}
