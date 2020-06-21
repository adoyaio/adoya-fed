import {
    Component,
    Injector,
    Input,
    OnChanges,
    OnInit,
    ReflectiveInjector,
    SimpleChange,
    SimpleChanges
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { isEqual as _isEqual, isNil as _isNil } from 'lodash';
import { AutocompleteComponent } from '../components/autocomplete/autocomplete.component';
import { ButtonComponent } from '../components/button/button.component';
import { CheckboxComponent } from '../components/checkbox/checkbox.component';
import { ContentSectionComponent } from '../components/content-section/content-section.component';
import { DateRangePickerComponent } from '../components/date-range-picker/date-range-picker.component';
import { DateComponent } from '../components/date/date.component';
import { InputComponent } from '../components/input/input.component';
import { DynamicLabelComponent } from '../components/label/dynamic-label.component';
import { ListComponent } from '../components/list/list.component';
import { RadioComponent } from '../components/radio/radio.component';
import { SelectComponent } from '../components/select/select.component';
import { FieldConfig } from '../interfaces/field.interface';
import { FIELD, FORM } from '../models/injection-tokens';

@Component({
    selector: 'app-dynamic-field',
    template: `
        <ng-container
            *ngComponentOutlet="componentMapper[field.type]; injector: myInjector"
        ></ng-container>
    `,
    styles: [``]
})
export class DynamicFieldComponent implements OnInit, OnChanges {
    @Input() field: FieldConfig;
    @Input() form: FormGroup;
    @Input() isLabels?: boolean;

    myInjector: Injector;

    componentMapper = {
        autocomplete: AutocompleteComponent,
        input: InputComponent,
        button: ButtonComponent,
        select: SelectComponent,
        date: DateComponent,
        radio: RadioComponent,
        list: ListComponent,
        checkbox: CheckboxComponent,
        label: DynamicLabelComponent,
        content: ContentSectionComponent,
        dateRangePicker: DateRangePickerComponent
    };
    constructor(private injector: Injector) {}

    ngOnChanges(changes: SimpleChanges): void {
        if (this.hasChanged(changes && changes['field'])) {
            // tslint:disable-next-line: deprecation
            this.myInjector = ReflectiveInjector.resolveAndCreate(
                [
                    { provide: FIELD, useValue: this.field },
                    { provide: FORM, useValue: this.form }
                ],
                this.injector
            );
        }
    }
    hasChanged(change: SimpleChange): boolean {
        if (_isNil(change)) {
            return false;
        }
        if (change.isFirstChange()) {
            return true;
        }
        return !_isEqual(change.previousValue, change.currentValue);
    }
    ngOnInit(): void {
        // tslint:disable-next-line: deprecation
        this.myInjector = ReflectiveInjector.resolveAndCreate(
            [
                { provide: FIELD, useValue: this.field },
                { provide: FORM, useValue: this.form }
            ],
            this.injector
        );
    }
}
