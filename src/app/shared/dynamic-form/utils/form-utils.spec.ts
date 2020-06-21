import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MessagesService } from 'src/app/modules/core/services/messages.service';
import { FieldConfig } from '../interfaces/field.interface';
import { FormFields } from '../models/form-fields';
import { FormUtils } from './form-utils';

describe('FormUtils', () => {
    describe('#setFormToDisabled', () => {
        it('should disable if shouldDisable == true', () => {
            const shouldDisable = true;
            const testFormGroup = new FormBuilder().group({
                targetControlKey: new FormControl()
            });
            FormUtils.setFormToDisabled(testFormGroup, shouldDisable);
            expect(testFormGroup.controls['targetControlKey'].disabled).toBeTruthy();
        });
        it('should enable if shouldDisable == false', () => {
            const shouldDisable = false;
            const testFormGroup = new FormBuilder().group({
                targetControlKey: new FormControl()
            });
            FormUtils.setFormToDisabled(testFormGroup, shouldDisable);
            expect(testFormGroup.controls['targetControlKey'].enabled).toBeTruthy();
        });
    });

    describe('#sanitizePhone', () => {
        it('should remove inappropriate values from the input', () => {
            const testInput = '(865)210-5724';
            const result = FormUtils.sanitizePhone(testInput);
            expect(result).toEqual('8652105724');
        });
    });

    describe('#setControlValidity', () => {
        it('should the validity to { invalid: true}', () => {
            const testControl: any = {
                setErrors: function () {}
            };
            spyOn(testControl, 'setErrors');
            FormUtils.setControlValidity(testControl, false);
            expect(testControl.setErrors).toHaveBeenCalledWith({ invalid: true });
        });
        it('should set the validity to null if valid', () => {
            const testControl: any = {
                setErrors: function () {}
            };
            spyOn(testControl, 'setErrors');
            FormUtils.setControlValidity(testControl, true);
            expect(testControl.setErrors).toHaveBeenCalledWith(null);
        });
    });

    describe('#stateArray', () => {
        it('should contain 50 state and 9 commonwealth/territory abbreviations.', () => {
            expect(FormUtils.stateArray.length + 1).toEqual(60);
        });
    });

    describe('#recursiveNullAndTrimObject', () => {
        it('should trim whitespace from the beginning and end of the value', () => {
            const raw = {
                test: ' Test '
            };
            FormUtils.recursiveNullAndTrimObject(raw);
            const expected = 'Test';
            expect(raw.test).toEqual(expected);
        });
    });

    describe('#createControls', () => {
        it('should skip button types', () => {
            const formBuilder: FormBuilder = new FormBuilder();
            const fieldConfigs: FieldConfig[] = [
                {
                    type: 'input',
                    label: 'First Name',
                    inputType: 'text',
                    name: 'primaryContact.firstName',
                    readonly: true,
                    validations: [
                        {
                            name: 'pattern',
                            validator: Validators.pattern('^[a-zA-Z]+$'),
                            message: MessagesService.getMessage(
                                'components.dynamicForms.valid.textOnly'
                            )
                        }
                    ]
                },
                {
                    type: 'button',
                    label: 'testbutton',
                    name: 'testbutton'
                }
            ];
            const arrFormFields: Array<FormFields> = [];
            arrFormFields.push(FormFields.build('test', fieldConfigs));
            const form = FormUtils.createControls(formBuilder, arrFormFields, undefined);
            expect(Object.keys(form.controls).length).toEqual(1);
        });

        it('should set the default selection on select types', () => {
            const formBuilder: FormBuilder = new FormBuilder();
            const fieldConfigs: FieldConfig[] = [
                {
                    type: 'select',
                    label: 'Select example',
                    name: 'selectExample',
                    options: [{ value: 'US', label: 'United States of America' }],
                    defaultSelection: 'US'
                }
            ];
            const arrFormFields: Array<FormFields> = [];
            arrFormFields.push(FormFields.build('test', fieldConfigs));
            const form = FormUtils.createControls(formBuilder, arrFormFields, undefined);
            expect(Object.keys(form.controls).length).toEqual(1);
        });
    });

    describe('#fieldIsRequired', () => {
        it('should return true if field has a required validator', () => {
            const testField = {
                name: '',
                type: 'text',
                validations: [
                    {
                        name: 'required',
                        validator: Validators.required,
                        message: ''
                    }
                ]
            };
            const retVal = FormUtils.fieldIsRequired(testField);
            expect(retVal).toBeTruthy();
        });
    });

    describe('#applyObjectValuesToExistingFormGroup', () => {
        it('should set the value to the form group from a passed object', () => {
            const expectedValue = 'foo';
            const testFormGroup = new FormBuilder().group({
                testKey: new FormControl()
            });
            const testObject = {
                testKey: expectedValue
            };
            FormUtils.applyObjectValuesToExistingFormGroup(testObject, testFormGroup);
            expect(testFormGroup.controls['testKey'].value).toEqual(expectedValue);
        });
        it('should handle 2 deep objects', () => {
            const expectedValue = 'foo';
            const testFormGroup = new FormBuilder().group({
                'test.key': new FormControl()
            });
            const testObject = {
                test: {
                    key: expectedValue
                }
            };
            FormUtils.applyObjectValuesToExistingFormGroup(testObject, testFormGroup);
            expect(testFormGroup.controls['test.key'].value).toEqual(expectedValue);
        });
        it('should handle 3 deep objects', () => {
            const expectedValue = 'foo';
            const testFormGroup = new FormBuilder().group({
                'test.key.bar': new FormControl()
            });
            const testObject = {
                test: {
                    key: {
                        bar: expectedValue
                    }
                }
            };
            FormUtils.applyObjectValuesToExistingFormGroup(testObject, testFormGroup);
            expect(testFormGroup.controls['test.key.bar'].value).toEqual(expectedValue);
        });
    });
});
