import { SelectOption } from '../models/select-option';
import { Validator } from './validator.interface';

export interface FieldConfig {
    label?: string;
    noOptionalLabel?: boolean;
    name: string;
    inputType?: string;
    disabled?: boolean;
    options?: SelectOption[];
    defaultSelection?: string;
    collections?: any;
    type: string;
    value?: any;
    placeholder?: string;
    multiple?: boolean;
    prefix?: string;
    mask?: string;
    uppercase?: boolean;
    readonly?: boolean;
    appearance?: string | 'standard';
    icon?: string;
    hint?: string;
    referenceField?: string;
    maxlength?: number;
    requiredAsterisk?: boolean;
    hideRequiredMarker?: boolean;
    validations?: Validator[];
    displayOnFormChange?: boolean;
    visible?: boolean;
    initialFocus?: boolean;
    fullwidth?: boolean;
    keepMask?: boolean;
    getPrefix?: Function;
    tooltipIcon?: string;
    tooltipClick?: Function;
    buttonLabel?: string;
    handleButtonClick?: Function;
}
