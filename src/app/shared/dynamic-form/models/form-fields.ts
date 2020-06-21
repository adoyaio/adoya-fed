import { FieldConfig } from '../interfaces/field.interface';

export class FormFields {
    fieldGroupKey: string;
    fields: FieldConfig[];

    static build(fieldGroupKey: string, fields: FieldConfig[]): FormFields {
        const retVal = new FormFields();
        retVal.fieldGroupKey = fieldGroupKey;
        retVal.fields = fields;
        return retVal;
    }
}
