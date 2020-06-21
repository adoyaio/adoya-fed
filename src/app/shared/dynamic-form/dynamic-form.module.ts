import { CommonModule } from "@angular/common";
import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
// import { IConfig, NgxMaskModule } from "ngx-mask";
import { MaterialModule } from "../material-design/material.module";
import { AutocompleteComponent } from "./components/autocomplete/autocomplete.component";
import { ButtonComponent } from "./components/button/button.component";
import { CheckboxComponent } from "./components/checkbox/checkbox.component";
import { ContentSectionComponent } from "./components/content-section/content-section.component";
import { DateRangePickerComponent } from "./components/date-range-picker/date-range-picker.component";
import { DateComponent } from "./components/date/date.component";
import { InputComponent } from "./components/input/input.component";
import { DynamicLabelComponent } from "./components/label/dynamic-label.component";
import { ListComponent } from "./components/list/list.component";
import { RadioComponent } from "./components/radio/radio.component";
import { SelectComponent } from "./components/select/select.component";
import { DynamicFieldComponent } from "./containers/dynamic-field.component";
import { DynamicFormComponent } from "./containers/dynamic-form.component";
import { UppercaseDirective } from "./directives/uppercase-directive";

// export const options: Partial<IConfig> | (() => Partial<IConfig>) = {};

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    // NgxMaskModule.forRoot(options),
  ],
  declarations: [
    AutocompleteComponent,
    ButtonComponent,
    InputComponent,
    SelectComponent,
    CheckboxComponent,
    DateComponent,
    RadioComponent,
    ListComponent,
    ContentSectionComponent,
    DynamicLabelComponent,
    DynamicFieldComponent,
    DynamicFormComponent,
    UppercaseDirective,
    DateRangePickerComponent,
  ],
  exports: [
    DynamicFormComponent,
    ReactiveFormsModule,
    UppercaseDirective,
    // NgxMaskModule,
    MaterialModule,
  ],
  entryComponents: [
    AutocompleteComponent,
    InputComponent,
    ButtonComponent,
    SelectComponent,
    DateComponent,
    RadioComponent,
    ListComponent,
    ContentSectionComponent,
    CheckboxComponent,
    DynamicLabelComponent,
    DateRangePickerComponent,
  ],
  schemas: [NO_ERRORS_SCHEMA],
})
export class DynamicFormModule {}
