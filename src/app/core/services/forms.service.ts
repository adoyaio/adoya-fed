import { Injectable, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { forEach as _forEach } from 'lodash';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { filter, map, takeUntil } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class FormsService implements OnDestroy {
    private formsMapSubject: BehaviorSubject<Map<string, FormGroup>> = new BehaviorSubject<
        Map<string, FormGroup>
    >(new Map());

    _destroyed$: Subject<boolean> = new Subject<boolean>();

    constructor() {}

    ngOnDestroy(): void {
        this._destroyed$.next(true);
    }

    getFirstInvalidForm$(keys: string[]): Observable<{ formId: string; form: FormGroup }> {
        return this.formsMapSubject.pipe(
            map(fm => {
                let retVal;
                _forEach(keys, function(val, key) {
                    const form = fm.get(val);
                    if (form && form.invalid) {
                        retVal = { formId: val, form: form };
                        return false;
                    }
                });
                return retVal;
            }),
            takeUntil(this._destroyed$)
        );
    }

    getForms$(keys: string[]): Observable<{ formId: string; form: FormGroup }[]> {
        return this.formsMapSubject.pipe(
            map(fm => {
                const retVal = [];
                _forEach(keys, function(val, key) {
                    const form = fm.get(val);
                    if (form) {
                        const f = { formId: val, form: form };
                        retVal.push(f);
                    }
                });
                return retVal;
            }),
            takeUntil(this._destroyed$)
        );
    }

    getForm(key: string): FormGroup {
        return this.formsMapSubject.getValue().get(key);
    }

    getForm$(key: string): Observable<FormGroup> {
        return this.formsMapSubject.pipe(
            filter(fm => fm !== undefined && fm.size > 0),
            map(fm => {
                return fm.get(key);
            }),
            filter(r => r !== undefined),
            takeUntil(this._destroyed$)
        );
    }

    putForm(key: string, form: FormGroup) {
        const fm = this.formsMapSubject.getValue();
        fm.set(key, form);
        this.formsMapSubject.next(fm);
    }

    hasForms(): Observable<boolean> {
        return this.formsMapSubject.pipe(
            map(fm => fm.size > 0),
            takeUntil(this._destroyed$)
        );
    }
}
