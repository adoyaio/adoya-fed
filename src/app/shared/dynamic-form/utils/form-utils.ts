import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import {
  chain as _chain,
  find as _find,
  flatMap as _flatMap,
  forEach as _forEach,
  get as _get,
  has as _has,
  isNil as _isNil,
  map as _map,
} from "lodash";
import { UppercaseDirective } from "../directives/uppercase-directive";
import { FieldConfig } from "../interfaces/field.interface";
import { FormFields } from "../models/form-fields";
import { SelectOption } from "../models/select-option";

export class FormUtils {
  public static currencyCode = [
    {
      value: "USD",
      label: "USD",
    },
    {
      value: "CAD",
      label: "CAD",
    },
  ];
  public static transferType = [
    {
      value: undefined,
      label: "",
    },
    {
      value: "ACH",
      label: "ACH Transfer",
    },
    {
      value: "WIRE",
      label: "Wire Transfer",
    },
  ];
  public static accountType = [
    {
      value: undefined,
      label: "",
    },
    {
      value: "CHECKING",
      label: "Checking Account",
    },
    {
      value: "SAVINGS",
      label: "Savings Account",
    },
  ];

  public static accountOwnerType = [
    // {
    //     value: undefined,
    //     label: ''
    // },
    {
      value: "INDIVIDUAL",
      label: "Individual",
    },
    {
      value: "BUSINESS",
      label: "Business",
    },
  ];

  public static accountOwnerTypeMap = {
    INDIVIDUAL: ["firstName", "lastName", "dateOfBirth"],
    BUSINESS: ["businessName"],
  };

  public static countryCodeSelect = [
    {
      value: "1",
      label: "USA/Canada (+1)",
    },
    {
      value: "91",
      label: "India (+91)",
    },
    {
      value: "852",
      label: "Hong Kong (+852)",
    },
  ];

  public static countryArray = [
    { value: undefined, label: "" },
    { value: "US", label: "United States of America" },
    { value: "AU", label: "Australia" },
    { value: "BR", label: "Brazil" },
    { value: "BG", label: "Bulgaria" },
    { value: "CA", label: "Canada" },
    { value: "DE", label: "Germany" },
    { value: "HK", label: "Hong Kong" },
    { value: "IN", label: "India" },
    { value: "ID", label: "Indonesia" },
    { value: "IE", label: "Ireland" },
    { value: "MX", label: "Mexico" },
    { value: "PK", label: "Pakistan" },
    { value: "PL", label: "Poland" },
    { value: "KR", label: "South Korea" },
    { value: "ES", label: "Spain" },
    { value: "LK", label: "Sri Lanka" },
    { value: "TH", label: "Thailand" },
    { value: "TR", label: "Turkey" },
    { value: "GB", label: "United Kingdom" },
    { value: "VN", label: "Vietnam" },
  ];

  public static stateArray = [
    { value: undefined, label: "" },
    { value: "AL", label: "Alabama" },
    { value: "AK", label: "Alaska" },
    { value: "AZ", label: "Arizona" },
    { value: "AR", label: "Arkansas" },
    { value: "CA", label: "California" },
    { value: "CO", label: "Colorado" },
    { value: "CT", label: "Connecticut" },
    { value: "DE", label: "Delaware" },
    { value: "FL", label: "Florida" },
    { value: "GA", label: "Georgia" },
    { value: "HI", label: "Hawaii" },
    { value: "ID", label: "Idaho" },
    { value: "IL", label: "Illinois" },
    { value: "IN", label: "Indiana" },
    { value: "IA", label: "Iowa" },
    { value: "KS", label: "Kansas" },
    { value: "KY", label: "Kentucky" },
    { value: "LA", label: "Louisiana" },
    { value: "ME", label: "Maine" },
    { value: "MD", label: "Maryland" },
    { value: "MA", label: "Massachusetts" },
    { value: "MI", label: "Michigan" },
    { value: "MN", label: "Minnesota" },
    { value: "MS", label: "Mississippi" },
    { value: "MO", label: "Missouri" },
    { value: "MT", label: "Montana" },
    { value: "NE", label: "New England" },
    { value: "NV", label: "Nevada" },
    { value: "NH", label: "New Hampshire" },
    { value: "NJ", label: "New Jersey" },
    { value: "NM", label: "New Mexico" },
    { value: "NY", label: "New York" },
    { value: "NC", label: "North Carolina" },
    { value: "ND", label: "North Dakota" },
    { value: "OH", label: "Ohio" },
    { value: "OR", label: "Oregon" },
    { value: "PA", label: "Pennsylvania" },
    { value: "RI", label: "Rhode Island" },
    { value: "SC", label: "South Carolina" },
    { value: "SD", label: "South Dakota" },
    { value: "TN", label: "Tennessee" },
    { value: "TX", label: "Texas" },
    { value: "UT", label: "Utah" },
    { value: "VT", label: "Vermont" },
    { value: "VA", label: "Virginia" },
    { value: "WA", label: "Washington" },
    { value: "WV", label: "West Virginia" },
    { value: "WI", label: "Wisconsin" },
    { value: "WY", label: "Wyoming" },
    { value: "AS", label: "American Samoa" },
    { value: "DC", label: "District of Columbia" },
    { value: "FM", label: "Federated States of Micronesia" },
    { value: "GU", label: "Guam" },
    { value: "MH", label: "Marshall Islands" },
    { value: "MP", label: "Northern Mariana Islands" },
    { value: "PW", label: "Palau" },
    { value: "PR", label: "Puerto Rico" },
    { value: "VI", label: "Virgin Islands" },
  ];

  public static siteUsageTypeArray = [
    { value: undefined, label: "" },
    { value: "BUSINESS", label: "Business" },
    // { value: 'BILLING', label: 'Billing' }
  ];

  public static cardType = {
    visa: "visa",
    "american-express": "amex",
    mastercard: "mastercard",
    discover: "discover",
  };

  static getControlName(c: AbstractControl): string | null {
    const formGroup = c.parent.controls;
    return Object.keys(formGroup).find((name) => c === formGroup[name]) || null;
  }

  static setControlValidity(control: AbstractControl, validity: boolean) {
    if (control) {
      if (validity) {
        control.setErrors(null);
      } else {
        control.setErrors({ invalid: true });
      }
    }
  }

  static insertFormFieldsByFieldGroup(
    targetFieldGroupKey: string,
    deleteIndex: number,
    inputOne: Array<FormFields>,
    inputTwo: FormFields[]
  ): Array<FormFields> {
    let indexOfTargetGroup = 0;
    if (targetFieldGroupKey !== "top") {
      indexOfTargetGroup = inputOne.findIndex(
        (i) => i.fieldGroupKey === targetFieldGroupKey
      );
    }
    inputOne.splice(indexOfTargetGroup + 1, deleteIndex, ...inputTwo);
    return inputOne;
  }

  static concatFormFields(
    inputOne: Array<FormFields>,
    inputTwo: Array<FormFields>
  ): Array<FormFields> {
    if (!inputOne) {
      return inputTwo;
    }
    return inputOne.concat(inputTwo);
  }

  static createControls(
    fb: FormBuilder,
    arrFormFields: Array<FormFields>,
    form: FormGroup
  ): FormGroup {
    const flattenedFields = _flatMap(arrFormFields, (ff) => _map(ff.fields));
    _forEach(flattenedFields, function (field, key) {
      if (field.type === "button") {
        return;
      }
      if (!form) {
        form = fb.group({});
      }
      let control = form.get(field.name) || form.controls[field.name];
      if (control) {
        if (!field.validations) {
          control.clearValidators();
        } else {
          FormUtils.bindValidations(field.validations);
        }
        if (field.disabled) {
          control.disable();
        } else if (control.disabled && !field.disabled) {
          control.enable();
        }
        if (control.value !== undefined) {
          // noop
        } else if (!_isNil(field.value)) {
          control.setValue(field.value);
        } else {
          control.setValue(undefined);
        }
      } else {
        let controlValue = field.value;
        if (
          (field.type === "select" || field.type === "radio") &&
          field.options &&
          field.defaultSelection &&
          field.value === undefined
        ) {
          controlValue = field.defaultSelection;
        }
        control = fb.control(
          controlValue,
          FormUtils.bindValidations(field.validations || [])
        );
        form.addControl(field.name, control);
      }
    });
    Object.keys(form.controls).filter((k) => {
      const controlIsInFields = flattenedFields.some((f) => k === f.name);
      if (!controlIsInFields) {
        form.removeControl(k);
      }
    });
    return form;
  }

  static bindValidations(validations: any) {
    if (validations.length > 0) {
      const validList = [];
      validations.forEach((valid) => {
        validList.push(valid.validator);
      });
      return Validators.compose(validList);
    }
    return null;
  }

  static sanitizePhone(input: string): string {
    return input
      .replace(/\(/g, "")
      .replace(/\)/g, "")
      .replace(/-/g, "")
      .replace(/ /g, "");
  }

  static recursiveNullAndTrimObject(obj): void {
    for (const property in obj) {
      if (obj.hasOwnProperty(property)) {
        if (typeof obj[property] === "object") {
          FormUtils.recursiveNullAndTrimObject(obj[property]);
        } else {
          const value = obj[property];
          if (typeof value === "string" && value && value.trim() === "") {
            obj[property] = null;
          } else if (typeof value === "string") {
            obj[property] = obj[property].trim();
          } else {
            obj[property] = value;
          }
        }
      }
    }
  }

  static fieldIsRequired(field: FieldConfig) {
    if (!field.validations) {
      return false;
    }
    for (let i = 0; i < field.validations.length; i++) {
      const val = field.validations[i];
      if (val.name === "required") {
        return true;
      }
    }
    return false;
  }

  static applyObjectValuesToFormFields(object: Object, formFields: FormFields) {
    _forEach(formFields.fields, function (fc, k2) {
      if (fc.disabled) {
        return;
      }
      if (FormUtils.hasSubObject(fc.name)) {
        const tokens = fc.name.split(".");
        if (tokens.length === 3) {
          const mainObject: string = tokens[0];
          const nestedObject: string = tokens[1];
          const nestedProperty: string = tokens[2];
          FormUtils.setValueOnFieldConfigByPropertyName(
            object[mainObject][nestedObject],
            fc,
            nestedProperty
          );
        } else {
          const nestedObject: string = tokens[0];
          const innerObject: any = object[nestedObject];
          if (innerObject) {
            const nestedFieldName: string = tokens[1];
            FormUtils.setValueOnFieldConfigByPropertyName(
              object,
              fc,
              nestedFieldName
            );
          }
        }
      } else {
        FormUtils.setValueOnFieldConfigByPropertyName(object, fc, fc.name);
      }
    });
  }

  static applyObjectValuesToFormFieldsArray(
    object: Object,
    formFieldsArray: Array<FormFields>
  ): void {
    _forEach(formFieldsArray, function (v, k) {
      FormUtils.applyObjectValuesToFormFields(object, v);
    });
  }

  private static setValueOnFieldConfigByPropertyName(
    object: Object,
    fc: FieldConfig,
    propertyName: string
  ): void {
    const hasProperty = _has(object, propertyName);
    if (hasProperty) {
      const value = _get(object, propertyName);
      if (fc.uppercase) {
        fc.value = UppercaseDirective.convertToUpper(value);
      } else {
        fc.value = value;
      }
    }
  }

  static applyObjectValuesToExistingFormGroup(
    object: Object,
    form: FormGroup
  ): void {
    if (!form) {
      return;
    }
    _forEach(form.controls, function (val, ctrlKey) {
      const ctrl = form.controls[ctrlKey];
      if (ctrl && FormUtils.hasSubObject(ctrlKey)) {
        const tokens = ctrlKey.split(".");
        if (tokens.length === 3) {
          const mainObject: string = tokens[0];
          const nestedObject: string = tokens[1];
          const nestedProperty: string = tokens[2];
          if (!object[mainObject] || !object[mainObject][nestedObject]) {
          } else {
            const fieldValue: any =
              object[mainObject][nestedObject][nestedProperty];
            if (fieldValue) {
              ctrl.setValue(fieldValue);
              return;
            }
          }
        } else {
          const nestedObject: string = tokens[0];
          const innerObject: any = object[nestedObject];
          if (innerObject) {
            _forEach(innerObject, function (val2, key) {
              const nestedFieldName: string = tokens[1];
              if (nestedFieldName === key) {
                ctrl.setValue(innerObject[nestedFieldName]);
                return false;
              }
            });
          }
        }
      } else if (ctrl) {
        _forEach(object, function (val3, key) {
          if (ctrlKey === key) {
            ctrl.setValue(val3);
            return false;
          }
        });
      }
    });
  }

  private static hasSubObject(input: string): boolean {
    return input.includes(".");
  }

  static setFormToDisabled(formGroup: FormGroup, shouldDisable: boolean) {
    Object.keys(formGroup.controls).forEach((key) => {
      if (shouldDisable) {
        formGroup.controls[key].disable();
      } else {
        formGroup.controls[key].enable();
      }
    });
  }

  static applyOptionsFields(
    fieldMap: Array<FormFields>,
    fieldGroup: string,
    fieldName: string,
    options: SelectOption[]
  ): void {
    if (_isNil(fieldMap)) {
      return;
    }
    const foundGroup = _find(fieldMap, (fg) => fg.fieldGroupKey === fieldGroup);
    if (!foundGroup) {
      return;
    }
    const foundField = _find(foundGroup.fields, (f) => f.name === fieldName);
    if (!foundField) {
      return;
    }
    if (!foundField.options) {
      return;
    }
    foundField.options = options;
  }
}
