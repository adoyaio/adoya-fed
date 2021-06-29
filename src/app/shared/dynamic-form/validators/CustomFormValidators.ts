import { FormControl, FormGroup } from "@angular/forms";
import { isNil as _isNil, toInteger } from "lodash";
import { FormUtils } from "../utils/form-utils";

export class CustomFormValidators {
  static checkboxMustBeSelected(formControl: FormControl): any {
    if (!formControl) {
      return {
        checkboxMustBeSelected: true,
      };
    }
    const REGEXP = /^true*$/;
    formControl.markAsTouched();
    if (REGEXP.test(formControl.value)) {
      return null;
    }
    return {
      checkboxMustBeSelected: true,
    };
  }

  // Validates URL
  static urlValidator(url): any {
    if (url.pristine) {
      return null;
    }
    const URL_REGEXP =
      /^(http?|https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
    url.markAsTouched();
    if (URL_REGEXP.test(url.value)) {
      return null;
    }
    return {
      invalidUrl: true,
    };
  }

  // Validates the create-order-form in create-order module
  static createOrderFormValidator(form: FormGroup): any {
    if (!form) {
      return null;
    }
    if (form.untouched) {
      return null;
    }
    const error = { mustHaveOne: true };
    const shipmentControl = form.get("shipmentCarrierUuid");
    const otherCarrierControl = form.get("otherCarrierName");
    const orderTypeControl = form.get("orderType");
    const siteAddressControl = form.get("siteAddressUuid");

    if (shipmentControl.value === "other" && !otherCarrierControl.value) {
      return error;
    }

    if (
      shipmentControl.value === "other" &&
      otherCarrierControl.value &&
      orderTypeControl.value &&
      siteAddressControl.value
    ) {
      return null;
    }

    if (
      shipmentControl.value === "JTV_PARTNERED_CARRIER_UPS" &&
      orderTypeControl.value &&
      siteAddressControl.value
    ) {
      return null;
    }

    return error;
  }

  static w8BENTINValidator(form: FormGroup): any {
    if (!form) {
      return null;
    }
    if (form.untouched) {
      return null;
    }
    const tinControl = form.get("tin");
    if (!tinControl) {
      return null;
    }
    const ftinControl = form.get("ftin");
    if (!ftinControl) {
      return null;
    }

    const tinControlIsBlank =
      _isNil(tinControl.value) || tinControl.value.trim().length < 1;
    const ftinControlIsBlank =
      _isNil(ftinControl.value) || ftinControl.value.trim().length < 1;
    if (tinControlIsBlank && ftinControlIsBlank) {
      const error = { mustHaveOne: true };
      tinControl.setErrors(error);
      tinControl.markAsTouched();
      ftinControl.setErrors(error);
      ftinControl.markAsTouched();
      return error;
    } else if (tinControlIsBlank && !ftinControlIsBlank) {
      const tinTypeControl = form.get("tinType");
      tinTypeControl.setErrors(null);
      tinTypeControl.markAsTouched();
      tinControl.setErrors(null);
      tinControl.markAsTouched();
      ftinControl.setErrors(null);
      ftinControl.markAsTouched();
      return null;
    } else if (!tinControlIsBlank && ftinControlIsBlank) {
      let error = null;
      const tinTypeControl = form.get("tinType");
      if (tinTypeControl) {
        const tinTypeControlIsBlank =
          _isNil(tinTypeControl.value) ||
          tinTypeControl.value.trim().length < 1;
        if (tinTypeControlIsBlank) {
          error = { required: true };
          tinTypeControl.setErrors(error);
          tinTypeControl.markAsTouched();
        }
      }
      tinControl.setErrors(null);
      tinControl.markAsTouched();
      ftinControl.setErrors(null);
      ftinControl.markAsTouched();
      return error;
    } else {
      tinControl.setErrors(null);
      tinControl.markAsTouched();
      ftinControl.setErrors(null);
      ftinControl.markAsTouched();
      return null;
    }
  }

  // validates no blank empty space
  static noWhitespaceValidator(control): any {
    if (control.pristine) {
      return null;
    }
    control.markAsTouched();
    let isWhitespace = false;
    if (control.value && control.value.trim().length === 0) {
      isWhitespace = true;
    }
    const isValid = !isWhitespace;
    if (isValid) {
      return null;
    }
    return { whitespace: true };
  }

  // Validates numbers
  static numberValidator(number): any {
    if (number.pristine) {
      return null;
    }
    if (!number.value) {
      return null;
    }
    const NUMBER_REGEXP = /^-?[\d]+(?:e-?\d+)?$/;
    number.markAsTouched();
    if (NUMBER_REGEXP.test(number.value)) {
      return null;
    }
    return {
      invalidNumber: true,
    };
  }

  // Validates US SSN
  static ssnValidator(ssn): any {
    if (ssn.pristine) {
      return null;
    }
    const SSN_REGEXP =
      /^(?!219-09-9999|078-05-1120)(?!666|000|9\d{2})\d{3}-(?!00)\d{2}-(?!0{4})\d{4}$/;
    ssn.markAsTouched();
    if (SSN_REGEXP.test(ssn.value)) {
      return null;
    }
    return {
      invalidSsn: true,
    };
  }

  // Validates email list
  static emailListValidator(emailAddresses): any {
    if (emailAddresses.pristine) {
      return null;
    }
    if (!emailAddresses.value) {
      return null;
    }
    const EMAIL_LIST_REGEXP = /\w+@\w+\.\w+(,\s*\w+@\w+\.\w+)*/;
    emailAddresses.markAsTouched();
    if (EMAIL_LIST_REGEXP.test(emailAddresses.value)) {
      return null;
    }
    return {
      invalidList: true,
    };
  }

  // Validates country code
  static countryCodeValidator(code): any {
    if (code.pristine) {
      return null;
    }
    if (!code.value) {
      return null;
    }
    const CODE_REGEXP = /^[0-9]{0,3}$/;
    code.markAsTouched();
    if (CODE_REGEXP.test(code.value)) {
      return null;
    }
    return {
      invalidCountryCode: true,
    };
  }

  // Validates phone numbers
  static phoneValidator(number): any {
    if (number.pristine) {
      return null;
    }
    if (!number.value) {
      return null;
    }
    const PHONE_REGEXP = /^[0-9]{0,12}$/;
    number.markAsTouched();
    const sanitizedPhoneNumber = FormUtils.sanitizePhone(number.value);
    if (PHONE_REGEXP.test(sanitizedPhoneNumber)) {
      return null;
    }
    return {
      invalidPhone: true,
    };
  }

  // Validates zip codes
  static zipCodeValidator(zip): any {
    if (zip.pristine) {
      return null;
    }
    const ZIP_REGEXP = /^[0-9]{5}(?:-[0-9]{4})?$/;
    zip.markAsTouched();
    if (ZIP_REGEXP.test(zip.value)) {
      return null;
    }
    return {
      invalidZip: true,
    };
  }

  // Validates quantity form control
  static quantityValidator(quantity): any {
    const error = { invalid: true };
    if (quantity.pristine) {
      return error;
    }
    if (!quantity.value) {
      return error;
    }
    if (isNaN(quantity.value)) {
      return error;
    }
    if (String(quantity.value).length === 0) {
      return error;
    }
    return null;
  }

  // Validates the budget controls
  static budgetValidator(form: FormGroup): any {
    if (!form) {
      return null;
    }
    if (form.untouched) {
      return null;
    }
    const error = { invalidLifetimeBudget: true };
    const dailyBudgetValue: number = +form.get("dailyBudget").value;
    const lifetimeBudgetValue: number = +form.get("lifetimeBudget").value;

    if (dailyBudgetValue >= lifetimeBudgetValue) {
      form.get("lifetimeBudget").setErrors(error);
      return error;
    }

    return null;
  }

  // Validates the budget controls
  static budgetCpiValidator(form: FormGroup): any {
    if (!form) {
      return null;
    }
    if (form.untouched) {
      return null;
    }
    const error = { invalidDailyBudget: true };
    const dailyBudgetValue: number = +form.get("substep3").get("dailyBudget")
      .value;
    const cpi: number = +form.get("substep2").get("cpi").value;

    if (dailyBudgetValue  < cpi * 20) {
      form.get("substep3").get("dailyBudget").setErrors(error);
      return error;
    }

    return null;
  }
}
