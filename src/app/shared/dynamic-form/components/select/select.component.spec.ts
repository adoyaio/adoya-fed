import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, Validators } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MessagesService } from 'src/app/modules/core/services/messages.service';
import { DynamicFormModule } from '../../dynamic-form.module';
import { FIELD, FORM } from '../../models/injection-tokens';
import { FormUtils } from '../../utils/form-utils';
import { SelectComponent } from './select.component';

describe('SelectComponent', () => {
    let component: SelectComponent;
    let fixture: ComponentFixture<SelectComponent>;
    const fb = new FormBuilder();

    const validatorToTest = {
        name: 'required',
        validator: Validators.required,
        message: MessagesService.getMessage('components.fallback.failure')
    };

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [],
            imports: [NoopAnimationsModule, DynamicFormModule],
            providers: [
                {
                    provide: FIELD,
                    useValue: ''
                },
                { provide: FORM, useValue: '' }
            ]
        }).compileComponents();
    }));
    beforeEach(() => {
        fixture = TestBed.createComponent(SelectComponent);
        component = fixture.componentInstance;
        component.field = {
            type: 'select',
            name: 'testformcontrol',
            defaultSelection: 'test',
            options: [
                {
                    label: 'test',
                    value: 'test'
                }
            ],
            validations: [validatorToTest]
        };
        component.form = fb.group({});
        const tfc = fb.control(
            component.field.value,
            FormUtils.bindValidations(component.field.validations || [])
        );
        component.form.addControl(component.field.name, tfc);
        fixture.detectChanges();
    });

    it('should compile', () => {
        expect(component).toBeTruthy();
    });

    describe('#fieldHasError', () => {
        it('should return false if the field passes a validation check', () => {
            component.form.controls[component.field.name].setValue('test');
            const result = component.fieldHasError(
                component.form,
                component.field,
                validatorToTest
            );
            expect(result).toBeFalsy();
        });
        it('should return true if the field fails a validation check', () => {
            component.form.controls[component.field.name].setValue('');
            const result = component.fieldHasError(
                component.form,
                component.field,
                validatorToTest
            );
            expect(result).toBeTruthy();
        });
    });

    describe('#getMessage', () => {
        it('should return a message', () => {
            component.field = {
                name: '',
                type: 'select'
            };
            const retVal = component.getMessage('');
            expect(retVal).toBe('Unknown Message');
        });
    });
});
