import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  Injector,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { AbstractControl, FormGroup } from "@angular/forms";
import { Subject } from "rxjs";
import { delay, takeUntil, tap } from "rxjs/operators";
import { FieldConfig } from "../../interfaces/field.interface";
import { Validator } from "../../interfaces/validator.interface";
import { FIELD, FORM } from "../../models/injection-tokens";
import { FormUtils } from "../../utils/form-utils";

@Component({
  selector: "app-input",
  templateUrl: "input.component.html",
  styleUrls: ["input.component.scss"],
})
export class InputComponent implements OnInit, OnDestroy, AfterViewInit {
  field: any;
  form: any;
  show = true;

  prefixUrl: string;

  @ViewChild("input", { static: false }) input: ElementRef;

  _destroyed$: Subject<boolean> = new Subject<boolean>();

  constructor(
    @Inject(FIELD) private fieldInjected: Injector,
    @Inject(FORM) private formInjected: Injector
  ) {
    this.field = this.fieldInjected;
    this.form = this.formInjected;
  }

  ngOnInit() {
    this.handleReferencedFieldHasValue();
  }

  ngOnDestroy(): void {
    this._destroyed$.next(true);
  }

  ngAfterViewInit() {
    if (this.field.initialFocus) {
      setTimeout(() => {
        if (this.input) {
          this.input.nativeElement.focus();
        }
      }, 0);
    }

    if (this.field.getPrefix) {
      this.field
        .getPrefix(this.form)
        .pipe(
          delay(0),
          tap(
            (val) => (this.prefixUrl = val && `${val}`),
            takeUntil(this._destroyed$)
          )
        )
        .subscribe();
    }
  }

  getLabel() {
    if (!FormUtils.fieldIsRequired(this.field) && !this.field.noOptionalLabel) {
      return this.field.label + " (Optional)";
    }
    return this.field.label;
  }

  shouldHideRequiredMarker() {
    if (this.field.hideRequiredMarker) {
      return this.field.hideRequiredMarker;
    }
    return false;
  }

  getRequiredAsterisk() {
    if (this.field.requiredAsterisk) {
      return this.field.requiredAsterisk;
    }
    return false;
  }

  handleTooltipClick() {
    if (this.field.tooltipClick) {
      this.field.tooltipClick(this.field.name);
    }
  }

  getMaxLength() {
    if (this.field.maxlength) {
      return this.field.maxlength;
    }
    return 999;
  }

  handleReferencedFieldHasValue() {
    if (this.field && this.field.referenceField) {
      const referenceControl = this.form.controls[this.field.referenceField];
      const targetControl = this.form.controls[this.field.name];
      if (referenceControl && targetControl) {
        this.compareControls(targetControl, referenceControl);
        this.subscribeToReferenceControlChanges(
          referenceControl,
          targetControl
        );
      }
    }
  }

  private subscribeToReferenceControlChanges(
    referenceControl: AbstractControl,
    targetControl: AbstractControl
  ): void {
    referenceControl.valueChanges
      .pipe(
        tap((refValChanges) => {
          const tarVal = targetControl.value;
          this.implementBusinessLogic(refValChanges, tarVal);
        }),
        takeUntil(this._destroyed$)
      )
      .subscribe();
    targetControl.valueChanges
      .pipe(
        tap((tarValChanges) => {
          const refVal = referenceControl.value;
          this.implementBusinessLogic(refVal, tarValChanges);
        }),
        takeUntil(this._destroyed$)
      )
      .subscribe();
  }

  implementBusinessLogic(referenceValue, targetValue): void {
    let refHasVal = false;
    let tarHasVal = false;
    if (!referenceValue) {
      refHasVal = false;
    } else {
      refHasVal = referenceValue.trim() !== "";
    }
    if (!targetValue) {
      tarHasVal = false;
    } else {
      tarHasVal = targetValue.trim() !== "";
    }
    if (refHasVal && !tarHasVal) {
      this.show = true;
    } else if (refHasVal && tarHasVal) {
      this.show = true;
    } else if (!refHasVal && tarHasVal) {
      this.show = true;
    } else if (!refHasVal && !tarHasVal) {
      this.show = false;
    }
  }

  private compareControls(
    targetControl: AbstractControl,
    referenceControl: AbstractControl
  ): void {
    const refVal = referenceControl.value;
    const tarVal = targetControl.value;
    this.implementBusinessLogic(refVal, tarVal);
  }

  fieldHasError(form: FormGroup, field: FieldConfig, validation: Validator) {
    return form.controls[field.name].hasError(validation.name);
  }

  trackValidation(index: any, validation: Validator) {
    return `${index}-${validation.name}`;
  }
}
