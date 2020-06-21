import { ElementRef, Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { UppercaseDirective } from './uppercase-directive';

@Injectable()
export class MockElementRef {
    public nativeElement;

    constructor() {
        this.nativeElement = {
            value: ''
        };
    }
}

describe('#toUpperCase', () => {
    let elRef: ElementRef;
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [{ provide: ElementRef, useValue: new MockElementRef() }]
        });
        elRef = TestBed.inject(ElementRef);
    });
    it('should make the first character uppercase', () => {
        const testValue = 'chris';
        const expectedValue = 'Chris';
        elRef.nativeElement.value = testValue;
        const directive: UppercaseDirective = new UppercaseDirective(elRef);
        directive.allowUpperCase = true;
        directive.toUpperCase();
        expect(directive.ref.nativeElement.value).toEqual(expectedValue);
    });
});
