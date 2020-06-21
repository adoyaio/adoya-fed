import {
  Component,
  EventEmitter,
  Input,
  isDevMode,
  OnDestroy,
  OnInit,
  Output,
} from "@angular/core";
import { FormBuilder, ValidatorFn } from "@angular/forms";
import { find as _find, flatMap as _flatMap } from "lodash";
import { isObservable, Observable, Subject } from "rxjs";
import {
  catchError,
  distinctUntilChanged,
  filter,
  map,
  takeUntil,
  tap,
} from "rxjs/operators";
import { FieldConfig } from "../interfaces/field.interface";
import { FormFields } from "../models/form-fields";
import { FormUtils } from "../utils/form-utils";
import { FormsService } from "src/app/core/services/forms.service";

@Component({
  selector: "app-dynamic-form",
  templateUrl: "./dynamic-form.component.html",
  styleUrls: ["./dynamic-form.component.scss"],
})
export class DynamicFormComponent implements OnInit, OnDestroy {
  @Input()
  fieldMap: Observable<Array<FormFields>>;
  @Input()
  formId: string;
  @Input()
  isDebugDisabled = !isDevMode();
  @Input()
  groupTitlesEnabled = false;
  @Input()
  isLabels?: boolean;
  @Input()
  formValidator?: ValidatorFn;

  @Output() submit: EventEmitter<any> = new EventEmitter<any>();

  destroyed$: Subject<boolean> = new Subject<boolean>();
  showDebug = false;
  showConfigs = false;

  constructor(
    private formBuilder: FormBuilder,
    public formService: FormsService
  ) {}

  ngOnInit(): void {
    if (this.formId === null || this.formId === undefined) {
      throw new Error("Error");
    }
    if (this.fieldMap === null || this.fieldMap === undefined) {
      throw new Error("Error");
    }
    if (!isObservable(this.fieldMap)) {
      throw new Error("Error");
    }
    this.fieldMap
      .pipe(
        filter((fm) => fm.length > 0),
        distinctUntilChanged(),
        map((fm) => {
          const _form = FormUtils.createControls(
            this.formBuilder,
            fm,
            this.form
          );
          if (this.formValidator) {
            _form.setValidators(this.formValidator);
          }
          return _form;
        }),
        tap((form) => {
          this.formService.putForm(this.formId, form);
        }),
        takeUntil(this.destroyed$)
      )
      .subscribe();
  }

  get form() {
    const form = this.formService.getForm(this.formId);
    if (!form) {
      return this.formBuilder.group({});
    }
    return form;
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
  }

  get value() {
    return this.form.value;
  }

  getFieldGroupKeys(): Observable<string[]> {
    return this.fieldMap.pipe(
      map((fm) => {
        if (fm === undefined) {
          return [];
        } else {
          return _flatMap(fm, (ff) => ff.fieldGroupKey);
        }
      }),
      catchError((error) => []),
      takeUntil(this.destroyed$)
    );
  }

  getFieldConfigs(entry: string): Observable<FieldConfig[]> {
    return this.fieldMap.pipe(
      map((fm) => {
        const found = _find(fm, (e) => e.fieldGroupKey === entry);
        if (found === undefined) {
          return [];
        }
        return found.fields;
      }),
      takeUntil(this.destroyed$)
    );
  }

  onSubmit(event: any) {
    event.preventDefault();
    event.stopPropagation();
    if (this.form.valid) {
      this.submit.emit(this.form.value);
    } else {
      this.validateAllFormFields();
    }
  }

  keyDownFunction(event) {
    if (event.keyCode === 13) {
      this.onSubmit(event);
    }
  }

  validateAllFormFields() {
    Object.keys(this.form.controls).forEach((field) => {
      this.validateFormField(field);
    });
  }

  validateFormField(field: string) {
    const control = this.form.get(field);
    if (!control) {
      return;
    }
    control.markAsTouched({ onlySelf: true });
  }

  trackEntry(index: any, entry: string) {
    return `${index}-${entry}`;
  }

  trackField(index: any, field: FieldConfig) {
    return `${index}-${field.name}`;
  }

  findFirstInvalidControl(): string {
    let retVal;
    _find(this.form.controls, function (c, k) {
      if (c.invalid) {
        retVal = k;
        return false;
      }
    });
    return retVal;
  }
}
