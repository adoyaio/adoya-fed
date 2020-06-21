import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { CustomFormValidators } from './CustomFormValidators';

describe('CustomFormValidators', () => {
    describe('#checkboxMustBeSelected', () => {
        it('should validate that a formcontrol checkbox type has been selected', () => {
            let testFormControl;
            let retVal = CustomFormValidators.checkboxMustBeSelected(testFormControl);
            expect(retVal).toEqual({ checkboxMustBeSelected: true });
            testFormControl = new FormControl();
            retVal = CustomFormValidators.checkboxMustBeSelected(testFormControl);
            expect(retVal).toEqual({ checkboxMustBeSelected: true });
            testFormControl.setValue(true);
            retVal = CustomFormValidators.checkboxMustBeSelected(testFormControl);
            expect(retVal).toBeNull();
        });
    });
    describe('#urlValidator', () => {
        it('should validate input url ', () => {
            const testUrl = {
                pristine: true,
                value: '',
                markAsTouched: () => {}
            };
            let retVal = CustomFormValidators.urlValidator(testUrl);
            expect(retVal).toBeNull();
            testUrl.pristine = false;
            testUrl.value = 'http';
            retVal = CustomFormValidators.urlValidator(testUrl);
            expect(retVal.invalidUrl).toBeTruthy();
            testUrl.value = 'http://google.com/';
            retVal = CustomFormValidators.urlValidator(testUrl);
            expect(retVal).toBeNull();
        });
    });

    describe('#w8BENTINValidator', () => {
        it('should return null if no form passed', () => {
            const retVal = CustomFormValidators.w8BENTINValidator(undefined);
            expect(retVal).toBeNull();
        });
        it('should return null if the form is untouched', () => {
            const test: FormGroup = new FormBuilder().group({});
            test.markAsUntouched();
            const retVal = CustomFormValidators.w8BENTINValidator(test);
            expect(retVal).toBeNull();
        });
        it('should return null if the form does not contain a tin control', () => {
            const test: FormGroup = new FormBuilder().group({
                tin: new FormControl(),
                ftin: new FormControl(),
                tinType: new FormControl()
            });
            test.removeControl('tin');
            test.markAsTouched();
            const retVal = CustomFormValidators.w8BENTINValidator(test);
            expect(retVal).toBeNull();
        });
        it('should return null if the form does not contain a ftin control', () => {
            const test: FormGroup = new FormBuilder().group({
                tin: new FormControl(),
                ftin: new FormControl(),
                tinType: new FormControl()
            });
            test.removeControl('ftin');
            test.markAsTouched();
            const retVal = CustomFormValidators.w8BENTINValidator(test);
            expect(retVal).toBeNull();
        });
        it('should validate either ftin or tin are present', () => {
            const test: FormGroup = new FormBuilder().group({
                tin: new FormControl(),
                ftin: new FormControl(),
                tinType: new FormControl()
            });
            test.get('tin').setValue('');
            test.get('ftin').setValue('');
            test.markAsTouched();
            const retVal = CustomFormValidators.w8BENTINValidator(test);
            expect(retVal).not.toBeNull();
        });
        it('should validate either ftin or tin are present', () => {
            const test: FormGroup = new FormBuilder().group({
                tin: new FormControl(),
                ftin: new FormControl(),
                tinType: new FormControl()
            });
            test.get('tin').setValue('a');
            test.get('ftin').setValue('');
            test.get('tinType').setValue('a');
            test.markAsTouched();
            const retVal = CustomFormValidators.w8BENTINValidator(test);
            expect(retVal).toBeNull();
        });
        it('should validate either ftin or tin are present', () => {
            const test: FormGroup = new FormBuilder().group({
                tin: new FormControl(),
                ftin: new FormControl(),
                tinType: new FormControl()
            });
            test.get('tin').setValue('');
            test.get('ftin').setValue('b');
            test.markAsTouched();
            const retVal = CustomFormValidators.w8BENTINValidator(test);
            expect(retVal).toBeNull();
        });
        it('should validate either ftin or tin are present', () => {
            const test: FormGroup = new FormBuilder().group({
                tin: new FormControl(),
                ftin: new FormControl(),
                tinType: new FormControl()
            });
            test.get('tin').setValue('a');
            test.get('ftin').setValue('b');
            test.get('tinType').setValue('c');
            test.markAsTouched();
            const retVal = CustomFormValidators.w8BENTINValidator(test);
            expect(retVal).toBeNull();
        });
        it('should validate if tin is present so is a tinType', () => {
            const test: FormGroup = new FormBuilder().group({
                tin: new FormControl(),
                ftin: new FormControl(),
                tinType: new FormControl()
            });
            test.get('tin').setValue('b');
            test.get('ftin').setValue('');
            test.get('tinType').setValue('');
            test.markAsTouched();
            const retVal = CustomFormValidators.w8BENTINValidator(test);
            expect(retVal).not.toBeNull();
        });
    });

    describe('#countryCodeValidator', () => {
        it('should return null if the passed control was pristine', () => {
            const retVal = CustomFormValidators.countryCodeValidator({
                pristine: true
            });
            expect(retVal).toBeNull();
        });
        it('should return null if the passed control value is undefined', () => {
            const retVal = CustomFormValidators.countryCodeValidator({
                pristine: false,
                value: undefined
            });
            expect(retVal).toBeNull();
        });
        it('should validate the passed country code complies with /^[0-9]{0,3}$/', () => {
            const retVal = CustomFormValidators.countryCodeValidator({
                prisitine: false,
                value: '123',
                markAsTouched: () => {}
            });
            expect(retVal).toBeNull();
        });
        it('should validate the passed country code complies with /^[0-9]{0,3}$/', () => {
            const retVal = CustomFormValidators.countryCodeValidator({
                prisitine: false,
                value: 'USA',
                markAsTouched: () => {}
            });
            expect(retVal).not.toBeNull();
        });
    });

    describe('#noWhitespaceValidator', () => {
        it('should validate there is no whitespace', () => {
            const test = {
                pristine: false,
                value: '',
                markAsTouched: () => {}
            };
            let retVal = CustomFormValidators.noWhitespaceValidator(test);
            expect(retVal).toBeNull();
            test.pristine = false;
            test.value = undefined;
            retVal = CustomFormValidators.noWhitespaceValidator(test);
            expect(retVal).toBeNull();
            test.pristine = false;
            test.value = ' ';
            retVal = CustomFormValidators.noWhitespaceValidator(test);
            expect(retVal.whitespace).toBeTruthy();
        });
    });
    describe('#numberValidator', () => {
        it('should validate input number', () => {
            const test = {
                pristine: true,
                value: '',
                markAsTouched: () => {}
            };
            let retVal = CustomFormValidators.numberValidator(test);
            expect(retVal).toBeNull();
            test.pristine = false;
            test.value = 'http';
            retVal = CustomFormValidators.numberValidator(test);
            expect(retVal.invalidNumber).toBeTruthy();
            test.pristine = false;
            test.value = '123';
            retVal = CustomFormValidators.numberValidator(test);
            expect(retVal).toBeNull();
            test.pristine = false;
            test.value = '...';
            retVal = CustomFormValidators.numberValidator(test);
            expect(retVal.invalidNumber).toBeTruthy();
        });
        it('should allow blank so that the field clears validations on backspace ', () => {
            const test = {
                pristine: true,
                value: '',
                markAsTouched: () => {}
            };
            test.pristine = false;
            let retVal = CustomFormValidators.numberValidator(test);
            expect(retVal).toBeNull();
            test.pristine = false;
            test.value = null;
            retVal = CustomFormValidators.numberValidator(test);
            expect(retVal).toBeNull();
        });
    });
    describe('#ssnValidator', () => {
        it('should validate input ssn', () => {
            const test = {
                pristine: true,
                value: '',
                markAsTouched: () => {}
            };
            let retVal = CustomFormValidators.ssnValidator(test);
            expect(retVal).toBeNull();
            test.pristine = false;
            test.value = 'http';
            retVal = CustomFormValidators.ssnValidator(test);
            expect(retVal.invalidSsn).toBeTruthy();
            test.value = '408-23-7880';
            retVal = CustomFormValidators.ssnValidator(test);
            expect(retVal).toBeNull();
        });
    });
    describe('#phoneValidator', () => {
        it('should validate input phone', () => {
            const test = {
                pristine: true,
                value: '',
                markAsTouched: () => {}
            };
            let retVal = CustomFormValidators.phoneValidator(test);
            expect(retVal).toBeNull();
            test.pristine = false;
            test.value = 'http';
            retVal = CustomFormValidators.phoneValidator(test);
            expect(retVal.invalidPhone).toBeTruthy();
            test.value = '8652357880';
            retVal = CustomFormValidators.phoneValidator(test);
            expect(retVal).toBeNull();
        });
        it('should allow blank so that the field clears validations on backspace', () => {
            const test = {
                pristine: true,
                value: '',
                markAsTouched: () => {}
            };
            test.pristine = false;
            test.value = '';
            let retVal = CustomFormValidators.phoneValidator(test);
            expect(retVal).toBeNull();
            test.pristine = false;
            test.value = null;
            retVal = CustomFormValidators.phoneValidator(test);
            expect(retVal).toBeNull();
        });
    });
    describe('#zipCodeValidator', () => {
        it('should validate input zips', () => {
            const test = {
                pristine: true,
                value: '',
                markAsTouched: () => {}
            };
            let retVal = CustomFormValidators.zipCodeValidator(test);
            expect(retVal).toBeNull();
            test.pristine = false;
            test.value = 'http';
            retVal = CustomFormValidators.zipCodeValidator(test);
            expect(retVal.invalidZip).toBeTruthy();
            test.value = '37764-7880';
            retVal = CustomFormValidators.zipCodeValidator(test);
            expect(retVal).toBeNull();
        });
    });

    describe('#canValidator', () => {
        it('should return null if pristine', () => {
            const test = {
                pristine: true,
                value: '',
                markAsTouched: () => {}
            };
            const retVal = CustomFormValidators.canValidator(test);
            expect(retVal).toBeNull();
        });
        it('should return null if value is undefined', () => {
            const test = {
                pristine: false,
                value: undefined,
                markAsTouched: () => {}
            };
            const retVal = CustomFormValidators.canValidator(test);
            expect(retVal).toBeNull();
        });
        it('should validate', () => {
            const test = {
                pristine: false,
                value: '4111111111111111',
                markAsTouched: () => {}
            };
            const retVal = CustomFormValidators.canValidator(test);
            expect(retVal).toBeNull();
        });
    });

    describe('#cardTypeValidator', () => {
        it('should return null if pristine', () => {
            const test = {
                pristine: true,
                value: '',
                markAsTouched: () => {}
            };
            const retVal = CustomFormValidators.cardTypeValidator(test);
            expect(retVal).toBeNull();
        });
        it('should return null if value is undefined', () => {
            const test = {
                pristine: false,
                value: undefined,
                markAsTouched: () => {}
            };
            const retVal = CustomFormValidators.cardTypeValidator(test);
            expect(retVal).toBeNull();
        });
        it('should validate', () => {
            const test = {
                pristine: false,
                value: '1',
                markAsTouched: () => {}
            };
            const retVal = CustomFormValidators.cardTypeValidator(test);
            expect(retVal).not.toBeNull();
        });
    });

    describe('#cvvValidator', () => {
        it('should return null if pristine', () => {
            const test = {
                pristine: true,
                value: '',
                markAsTouched: () => {}
            };
            const retVal = CustomFormValidators.cvvValidator(test);
            expect(retVal).toBeNull();
        });
        it('should return null if value is undefined', () => {
            const test = {
                pristine: false,
                value: undefined,
                markAsTouched: () => {}
            };
            const retVal = CustomFormValidators.cvvValidator(test);
            expect(retVal).toBeNull();
        });
        it('should validate', () => {
            const test = {
                pristine: false,
                value: '123',
                markAsTouched: () => {}
            };
            const retVal = CustomFormValidators.cvvValidator(test);
            expect(retVal).toBeNull();
        });
    });

    describe('#expirationDateValidator', () => {
        it('should return null if pristine', () => {
            const test = {
                pristine: true,
                value: '',
                markAsTouched: () => {}
            };
            const retVal = CustomFormValidators.expirationDateValidator(test);
            expect(retVal).toBeNull();
        });
        it('should return null if value is undefined', () => {
            const test = {
                pristine: false,
                value: undefined,
                markAsTouched: () => {}
            };
            const retVal = CustomFormValidators.expirationDateValidator(test);
            expect(retVal).toBeNull();
        });
        it('should validate', () => {
            const date = new Date();
            const test = {
                pristine: false,
                value: '01/21',
                markAsTouched: () => {}
            };
            const retVal = CustomFormValidators.expirationDateValidator(test);
            expect(retVal).toBeNull();
        });
    });

    describe('#createOrderFormValidator', () => {
        it('should return null if no form passed', () => {
            const retVal = CustomFormValidators.createOrderFormValidator(undefined);
            expect(retVal).toBeNull();
        });
        it('should return null if the form is untouched', () => {
            const test: FormGroup = new FormBuilder().group({});
            test.markAsUntouched();
            const retVal = CustomFormValidators.createOrderFormValidator(test);
            expect(retVal).toBeNull();
        });
        it('should return error if shipmentControl is other and otherCarrierControl value is undefined', () => {
            const test: FormGroup = new FormBuilder().group({
                shipmentCarrierUuid: new FormControl(),
                otherCarrierName: new FormControl()
            });
            test.get('shipmentCarrierUuid').setValue('other');
            test.get('otherCarrierName').setValue(undefined);
            test.markAsTouched();
            const retVal = CustomFormValidators.createOrderFormValidator(test);
            expect(retVal).not.toBeNull();
        });
        it('should return null if shipmentControl is other and otherCarrierControl value has value', () => {
            const test: FormGroup = new FormBuilder().group({
                shipmentCarrierUuid: new FormControl(),
                otherCarrierName: new FormControl(),
                siteAddressUuid: new FormControl(),
                orderTitle: new FormControl(),
                orderType: new FormControl()
            });
            test.get('shipmentCarrierUuid').setValue('other');
            test.get('otherCarrierName').setValue('usps');
            test.get('siteAddressUuid').setValue('123');
            test.get('orderTitle').setValue('123');
            test.get('orderType').setValue('123');
            test.markAsTouched();
            const retVal = CustomFormValidators.createOrderFormValidator(test);
            expect(retVal).toBeNull();
        });
        it('should return null if shipmentControl is JTV_PARTNERED_CARRIER_UPS and otherCarrierControl value is undefined', () => {
            const test: FormGroup = new FormBuilder().group({
                shipmentCarrierUuid: new FormControl(),
                otherCarrierName: new FormControl(),
                siteAddressUuid: new FormControl(),
                orderTitle: new FormControl(),
                orderType: new FormControl()
            });
            test.get('shipmentCarrierUuid').setValue('JTV_PARTNERED_CARRIER_UPS');
            test.get('otherCarrierName').setValue(undefined);
            test.get('siteAddressUuid').setValue('123');
            test.get('orderTitle').setValue('123');
            test.get('orderType').setValue('123');
            test.markAsTouched();
            const retVal = CustomFormValidators.createOrderFormValidator(test);
            expect(retVal).toBeNull();
        });
        it('should return error if shipmentControl is not set', () => {
            const test: FormGroup = new FormBuilder().group({
                shipmentCarrierUuid: new FormControl(),
                otherCarrierName: new FormControl(),
                siteAddressUuid: new FormControl(),
                orderTitle: new FormControl(),
                orderType: new FormControl()
            });
            test.get('shipmentCarrierUuid').setValue(undefined);
            test.get('otherCarrierName').setValue(undefined);
            test.get('siteAddressUuid').setValue('123');
            test.get('orderTitle').setValue('123');
            test.get('orderType').setValue('123');
            test.markAsTouched();
            const retVal = CustomFormValidators.createOrderFormValidator(test);
            expect(retVal).not.toBeNull();
        });
    });

    describe('#quantityValidator', () => {
        it('should return null if number is passed', () => {
            const test = {
                pristine: false,
                value: 1,
                markAsTouched: () => {}
            };
            const retVal = CustomFormValidators.quantityValidator(test);
            expect(retVal).toBeNull();
        });
        it('should return error if number is not passed', () => {
            const test = {
                pristine: false,
                value: undefined,
                markAsTouched: () => {}
            };
            const retVal = CustomFormValidators.quantityValidator(test);
            expect(retVal).not.toBeNull();
        });
        it('should return error if empty string is passed', () => {
            const test = {
                pristine: true,
                value: ''
            };
            const retVal = CustomFormValidators.quantityValidator(test);
            expect(retVal).not.toBeNull();
        });
        it('should return error if NAN is passed', () => {
            const test = {
                pristine: true,
                value: 'X'
            };
            const retVal = CustomFormValidators.quantityValidator(test);
            expect(retVal).not.toBeNull();
        });
    });
});
