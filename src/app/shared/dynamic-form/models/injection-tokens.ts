import { InjectionToken } from '@angular/core';
import { FieldConfig } from '../interfaces/field.interface';

export const FIELD = new InjectionToken<FieldConfig>('app.field');
export const FORM = new InjectionToken<FieldConfig>('app.form');
