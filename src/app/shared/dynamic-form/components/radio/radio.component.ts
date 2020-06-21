import { Component, Inject, Injector, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { FIELD, FORM } from '../../models/injection-tokens';
import { SelectOption } from '../../models/select-option';

@Component({
    selector: 'app-radio',
    templateUrl: 'radio.component.html',
    styleUrls: ['radio.component.scss']
})
export class RadioComponent implements OnInit, OnDestroy {
    field: any;
    form: any;

    referenceFieldValues: Observable<string>;
    destroyed$: Subject<boolean> = new Subject<boolean>();

    constructor(
        @Inject(FIELD) private fieldInjected: Injector,
        @Inject(FORM) private formInjected: Injector
    ) {
        this.field = this.fieldInjected;
        this.form = this.formInjected;
    }

    ngOnInit(): void {}

    ngOnDestroy(): void {
        this.destroyed$.next(true);
    }

    handleTooltipClick() {
        if (this.field.tooltipClick) {
            this.field.tooltipClick(this.field.name);
        }
    }

    trackOption(index: any, option: SelectOption) {
        return `${index}-${option.value}`;
    }
}
