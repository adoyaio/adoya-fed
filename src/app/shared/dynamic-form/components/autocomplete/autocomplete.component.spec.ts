import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, Validators } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { UppercaseDirective } from '../../directives/uppercase-directive';
import { DynamicFormModule } from '../../dynamic-form.module';
import { AutocompleteComponent } from './autocomplete.component';

describe('AutocompleteComponent', () => {
    let component: AutocompleteComponent;
    let fixture: ComponentFixture<AutocompleteComponent>;
    let formBuilder: FormBuilder;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AutocompleteComponent, UppercaseDirective],
            imports: [NoopAnimationsModule, DynamicFormModule]
        }).compileComponents();
    }));
    beforeEach(() => {
        fixture = TestBed.createComponent(AutocompleteComponent);
        component = fixture.componentInstance;
        formBuilder = new FormBuilder();
        component.group = formBuilder.group({
            test: {}
        });
        component.field = {
            type: 'autocomplete',
            name: 'test'
        };
        fixture.detectChanges();
    });

    it('should compile', () => {
        expect(component).toBeTruthy();
    });

    describe('#_filter', () => {
        it('should return empty [] if no field options', () => {
            const retVal = component._filter('');
            expect(retVal).toBeDefined();
            expect(retVal.length).toBe(0);
        });
        it('should return SelectOption where label includes the test value', () => {
            component.field.options = [
                {
                    label: 'testlabel',
                    value: 'testvalue'
                }
            ];
            const retVal = component._filter('te');
            expect(retVal).toBeDefined();
        });
    });

    describe('#fieldHasError', () => {
        it('should return true if error exists', () => {
            component.field.validations = [
                {
                    name: 'maxLength',
                    message: 'validator message',
                    validator: Validators.maxLength(2)
                }
            ];
            component.group.controls['test'].setValue('tes');
            const retVal = component.fieldHasError(
                component.group,
                component.field,
                component.field.validations[0]
            );
            expect(retVal).toBeFalsy();
        });
    });
});
