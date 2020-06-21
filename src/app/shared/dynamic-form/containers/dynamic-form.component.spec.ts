import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { MessagesService } from 'src/app/modules/core/services/messages.service';
import { FormsService } from '../../../core/services';
import { FormFields } from '../models/form-fields';
import { DynamicFieldComponent } from './dynamic-field.component';
import { DynamicFormComponent } from './dynamic-form.component';

describe('#dynamic-form', () => {
    let httpClient: HttpClient;
    let httpTestingController: HttpTestingController;
    let service: MessagesService;
    let formService: FormsService;
    let dynamicForm: DynamicFormComponent;
    let fixture: ComponentFixture<DynamicFormComponent>;
    let de: DebugElement;
    const firstTestControlKey = 'test';

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule, ReactiveFormsModule],
            providers: [MessagesService, FormsService],
            declarations: [DynamicFormComponent, DynamicFieldComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        httpClient = TestBed.inject(HttpClient);
        httpTestingController = TestBed.inject(HttpTestingController);
        service = TestBed.inject(MessagesService);
        formService = TestBed.inject(FormsService);
        fixture = TestBed.createComponent(DynamicFormComponent);
        dynamicForm = fixture.componentInstance;
        dynamicForm.fieldMap = new BehaviorSubject<Array<FormFields>>([
            {
                fieldGroupKey: '',
                fields: [
                    {
                        name: 'firstTestControlKey',
                        type: 'input'
                    }
                ]
            }
        ]);
        dynamicForm.formId = 'test';
        dynamicForm.ngOnInit();
        de = fixture.debugElement;
    });

    describe('#getValue', () => {
        it('should return a value', () => {
            const result = dynamicForm.value;
            expect(result).toBeDefined();
        });
    });

    describe('#keyDownFunction', () => {
        it('should call onSubmit if enter was pressed', () => {
            const event = {
                preventDefault: function () {},
                stopPropagation: function () {},
                keyCode: 13
            };
            spyOn(dynamicForm, 'onSubmit').and.callThrough();
            dynamicForm.keyDownFunction(event);
            expect(dynamicForm.onSubmit).toHaveBeenCalled();
        });
    });

    describe('#validateAllFormFields', () => {
        it('should mark every control as touched', () => {
            dynamicForm.validateAllFormFields();
            Object.keys(dynamicForm.form.controls).forEach((control) => {
                expect(dynamicForm.form.controls[control].touched).toBeTruthy();
            });
        });
    });

    describe('#validateFormField', () => {
        it('should mark the control as touched', () => {
            dynamicForm.validateFormField('firstTestControlKey');
            expect(dynamicForm.form.controls['firstTestControlKey'].touched).toBeTruthy();
        });
    });

    describe('#onSubmit', () => {
        it('should emit when form is valid', () => {
            spyOn(dynamicForm, 'onSubmit').and.callThrough();
            spyOn(dynamicForm.submit, 'emit');
            dynamicForm.submit.subscribe(() => {
                expect(dynamicForm.onSubmit).toHaveBeenCalled();
                expect(dynamicForm.submit.emit).toHaveBeenCalledWith(dynamicForm.form.value);
            });
            dynamicForm.onSubmit(new Event('onSubmit'));
        });

        it('should not emit and validate all forms when form is not valid', () => {
            spyOn(dynamicForm, 'onSubmit').and.callThrough();
            spyOn(dynamicForm, 'validateAllFormFields');
            spyOn(dynamicForm.submit, 'emit');
            dynamicForm.form.setErrors({ invalid: true });
            dynamicForm.submit.subscribe(() => {
                expect(dynamicForm.onSubmit).toHaveBeenCalled();
                expect(dynamicForm.submit.emit).not.toHaveBeenCalled();
                expect(dynamicForm.validateAllFormFields).toHaveBeenCalled();
            });
            dynamicForm.onSubmit(new Event('onSubmit'));
        });
    });
});
