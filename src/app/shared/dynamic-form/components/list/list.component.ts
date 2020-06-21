import { Component, Inject, Injector, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { FieldConfig } from "../../interfaces/field.interface";
import { Validator } from "../../interfaces/validator.interface";
import { FIELD, FORM } from "../../models/injection-tokens";
import { SelectOption } from "../../models/select-option";
import { FormUtils } from "../../utils/form-utils";

@Component({
  selector: "app-list",
  templateUrl: "./list.component.html",
  styleUrls: ["./list.component.scss"],
})
export class ListComponent implements OnInit {
  field: any;
  form: any;

  constructor(
    @Inject(FIELD) private fieldInjected: Injector,
    @Inject(FORM) private formInjected: Injector
  ) {
    this.field = this.fieldInjected;
    this.form = this.formInjected;
  }

  ngOnInit() {}

  getLabel() {
    if (!FormUtils.fieldIsRequired(this.field) && !this.field.noOptionalLabel) {
      return this.field.label + " (Optional)";
    }
    return this.field.label;
  }

  trackOption(index: any, option: SelectOption) {
    return `${index}-${option.value}`;
  }

  handleTooltipClick() {
    if (this.field.tooltipClick) {
      this.field.tooltipClick(this.field.name);
    }
  }

  handleClick(value) {
    const refTarget = this.form.controls[this.field.name];
    this.field.value = value;
    refTarget.setValue(value);
  }

  handleButtonClick() {
    const refTarget = this.form.controls[this.field.name];
    this.field.value = undefined;
    refTarget.setValue(undefined);
    if (this.field.handleButtonClick) {
      this.field.handleButtonClick(this.form);
    }
  }

  fieldHasError(form: FormGroup, field: FieldConfig, validation: Validator) {
    const ctrl = form.controls[field.name];
    return ctrl && ctrl.touched && ctrl.hasError(validation.name);
  }

  trackValidation(index: any, validation: Validator) {
    return `${index}-${validation.name}`;
  }
}
