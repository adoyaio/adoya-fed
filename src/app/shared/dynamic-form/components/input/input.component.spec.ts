import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, Validators } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { IConfig, NgxMaskModule } from 'ngx-mask';
import { MessagesService } from 'src/app/modules/core/services/messages.service';
import { UppercaseDirective } from '../../directives/uppercase-directive';
import { DynamicFormModule } from '../../dynamic-form.module';
import { FieldConfig } from '../../interfaces/field.interface';
import { FIELD, FORM } from '../../models/injection-tokens';
import { FormUtils } from '../../utils/form-utils';
import { CustomFormValidators } from '../../validators/CustomFormValidators';
import { InputComponent } from './input.component';

export const options: Partial<IConfig> | (() => Partial<IConfig>) = {};

describe('InputComponent', () => {
    let component: InputComponent;
    let fixture: ComponentFixture<InputComponent>;
    let formBuilder: FormBuilder;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [InputComponent, UppercaseDirective],
            imports: [NoopAnimationsModule, NgxMaskModule.forRoot(options), DynamicFormModule],
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
        fixture = TestBed.createComponent(InputComponent);
        component = fixture.componentInstance;
        formBuilder = new FormBuilder();
        component.form = formBuilder.group({
            test: {}
        });
        component.field = {
            type: 'input',
            name: 'test',
            label: 'label'
        };
        fixture.detectChanges();
    });

    it('should compile', () => {
        expect(component).toBeTruthy();
    });

    describe('#implementBusinessLogic', () => {
        it('should show if reference has a value but the target does not', () => {
            const referenceValue = 'a';
            const targetValue = undefined;
            component.implementBusinessLogic(referenceValue, targetValue);
            expect(component.show).toBeTruthy();
        });
        it('should show if reference has a value and the target has a value', () => {
            const referenceValue = 'a';
            const targetValue = 'b';
            component.implementBusinessLogic(referenceValue, targetValue);
            expect(component.show).toBeTruthy();
        });
    });

    describe('#shouldHideRequiredMarker', () => {
        it('should return true when set', () => {
            component.field = {
                name: '',
                type: 'input',
                hideRequiredMarker: true
            };
            const retVal = component.shouldHideRequiredMarker();
            expect(retVal).toBeTruthy();
        });
    });
    describe('#getRequiredAsterisk', () => {
        it('should return true when set', () => {
            component.field = {
                name: '',
                type: 'input',
                requiredAsterisk: true
            };
            const retVal = component.getRequiredAsterisk();
            expect(retVal).toBeTruthy();
        });
    });
    describe('#handleReferencedFieldHasValue', () => {
        it('should hide input if reference field has no value && this field has no value (inclusive)', () => {
            const phoneSubNumField: FieldConfig = {
                type: 'input',
                label: 'Phone Number',
                name: 'primaryContact.phone.subscriberNumber',
                value: '',
                validations: [
                    {
                        name: 'invalidPhone',
                        validator: CustomFormValidators.phoneValidator,
                        message: MessagesService.getMessage(
                            'components.dynamicForms.valid.NADPcompliantPhone'
                        )
                    }
                ]
            };
            const phoneExtField: FieldConfig = {
                type: 'input',
                label: 'Phone Extension',
                name: 'primaryContact.phone.extension',
                referenceField: 'primaryContact.phone.subscriberNumber',
                value: '',
                validations: [
                    {
                        name: 'maxlength',
                        validator: Validators.maxLength(5),
                        message: MessagesService.getMessage('components.dynamicForms.maxchar.5')
                    },
                    {
                        name: 'invalidNumber',
                        validator: CustomFormValidators.numberValidator,
                        message: MessagesService.getMessage(
                            'components.dynamicForms.valid.numbersOnly'
                        )
                    }
                ]
            };
            component.form = undefined;
            component.field = undefined;
            component.form = formBuilder.group({});
            const phoneExtControl = formBuilder.control(
                phoneExtField.value,
                FormUtils.bindValidations(phoneExtField.validations || [])
            );
            component.form.addControl(phoneExtField.name, phoneExtControl);
            const phoneSubNumControl = formBuilder.control(
                phoneSubNumField.value,
                FormUtils.bindValidations(phoneSubNumField.validations || [])
            );
            component.form.addControl(phoneSubNumField.name, phoneSubNumControl);
            component.field = phoneExtField;
            component.handleReferencedFieldHasValue();
            expect(component.show).toBeFalsy();
        });
        it('should show input if reference field has no value but this field has a value', () => {
            const phoneSubNumField: FieldConfig = {
                type: 'input',
                label: 'Phone Number',
                name: 'primaryContact.phone.subscriberNumber',
                value: '',
                validations: [
                    {
                        name: 'invalidPhone',
                        validator: CustomFormValidators.phoneValidator,
                        message: MessagesService.getMessage(
                            'components.dynamicForms.valid.NADPcompliantPhone'
                        )
                    }
                ]
            };
            const phoneExtField: FieldConfig = {
                type: 'input',
                label: 'Phone Extension',
                name: 'primaryContact.phone.extension',
                referenceField: 'primaryContact.phone.subscriberNumber',
                value: '12345',
                validations: [
                    {
                        name: 'maxlength',
                        validator: Validators.maxLength(5),
                        message: MessagesService.getMessage('components.dynamicForms.maxchar.5')
                    },
                    {
                        name: 'invalidNumber',
                        validator: CustomFormValidators.numberValidator,
                        message: MessagesService.getMessage(
                            'components.dynamicForms.valid.numbersOnly'
                        )
                    }
                ]
            };
            component.form = formBuilder.group({});
            const phoneExtControl = formBuilder.control(
                phoneExtField.value,
                FormUtils.bindValidations(phoneExtField.validations || [])
            );
            component.form.addControl(phoneExtField.name, phoneExtControl);
            const phoneSubNumControl = formBuilder.control(
                phoneSubNumField.value,
                FormUtils.bindValidations(phoneSubNumField.validations || [])
            );
            component.form.addControl(phoneSubNumField.name, phoneSubNumControl);
            component.field = phoneExtField;
            component.handleReferencedFieldHasValue();
            expect(component.show).toBeTruthy();
        });
        it('should show input if reference field has no value && this field has a value, then the reference field changed to no value', () => {
            const phoneSubNumField: FieldConfig = {
                type: 'input',
                label: 'Phone Number',
                name: 'primaryContact.phone.subscriberNumber',
                value: '',
                validations: [
                    {
                        name: 'invalidPhone',
                        validator: CustomFormValidators.phoneValidator,
                        message: MessagesService.getMessage(
                            'components.dynamicForms.valid.NADPcompliantPhone'
                        )
                    }
                ]
            };
            const phoneExtField: FieldConfig = {
                type: 'input',
                label: 'Phone Extension',
                name: 'primaryContact.phone.extension',
                referenceField: 'primaryContact.phone.subscriberNumber',
                value: '12345',
                validations: [
                    {
                        name: 'maxlength',
                        validator: Validators.maxLength(5),
                        message: MessagesService.getMessage('components.dynamicForms.maxchar.5')
                    },
                    {
                        name: 'invalidNumber',
                        validator: CustomFormValidators.numberValidator,
                        message: MessagesService.getMessage(
                            'components.dynamicForms.valid.numbersOnly'
                        )
                    }
                ]
            };
            component.form = formBuilder.group({});
            const phoneExtControl = formBuilder.control(
                phoneExtField.value,
                FormUtils.bindValidations(phoneExtField.validations || [])
            );
            component.form.addControl(phoneExtField.name, phoneExtControl);
            const phoneSubNumControl = formBuilder.control(
                phoneSubNumField.value,
                FormUtils.bindValidations(phoneSubNumField.validations || [])
            );
            component.form.addControl(phoneSubNumField.name, phoneSubNumControl);
            component.field = phoneExtField;
            fixture.detectChanges();
            component.form.controls['primaryContact.phone.subscriberNumber'].setValue('');
            component.handleReferencedFieldHasValue();
            expect(component.show).toBeTruthy();
        });
    });
    describe('#shouldShowTooltip', () => {
        it('should return true when set', () => {
            component.field = {
                name: '',
                type: 'input',
                tooltipIcon: 'help'
            };
            fixture.detectChanges();
            expect(component.show).toBeTruthy();
        });
    });
    describe('#shouldShowTooltipWithClick', () => {
        it('should return true when set', () => {
            const tooltipClick = () => {};
            component.field = {
                name: '',
                type: 'input',
                tooltipIcon: 'help',
                tooltipClick
            };
            fixture.detectChanges();
            expect(component.show).toBeTruthy();
        });
    });
    describe('#getMessage', () => {
        it('should return a message', () => {
            component.field = {
                name: '',
                type: 'input'
            };
            const retVal = component.getMessage('');
            expect(retVal).toBe('Unknown Message');
        });
    });
});
