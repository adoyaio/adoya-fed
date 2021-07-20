import {
  AfterViewInit,
  Component,
  Inject,
  Injector,
  ViewChild,
} from "@angular/core";
import { FormGroup } from "@angular/forms";
import { MatSelect } from "@angular/material/select";
import { FieldConfig } from "../../interfaces/field.interface";
import { Validator } from "../../interfaces/validator.interface";
import { FIELD, FORM } from "../../models/injection-tokens";
import { SelectOption } from "../../models/select-option";

@Component({
  selector: "app-select",
  templateUrl: "select.component.html",
  styleUrls: ["select.component.scss"],
})
export class SelectComponent implements AfterViewInit {
  field: any;
  form: any;

  defaultSelection: string;

  constructor(
    @Inject(FIELD) private fieldInjected: Injector,
    @Inject(FORM) private formInjected: Injector
  ) {
    this.field = this.fieldInjected;
    this.form = this.formInjected;
  }

  @ViewChild("select") select: MatSelect;

  ngAfterViewInit() {
    if (this.field.initialFocus) {
      setTimeout(() => {
        this.select.focus();
      }, 0);
    }
  }

  fieldHasError(form: FormGroup, field: FieldConfig, validation: Validator) {
    return form.controls[field.name].hasError(validation.name);
  }

  trackOption(index: any, option: SelectOption) {
    return `${index}-${option.value}`;
  }

  trackValidation(index: any, validation: Validator) {
    return `${index}-${validation.name}`;
  }

  handleTooltipClick() {
    if (this.field.tooltipClick) {
      this.field.tooltipClick(this.field.name);
    }
  }
}
