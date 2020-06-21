import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DynamicFormModule } from '../../dynamic-form.module';
import { DateComponent } from './date.component';

describe('DateComponent', () => {
    let component: DateComponent;
    let fixture: ComponentFixture<DateComponent>;
    let formBuilder: FormBuilder;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DateComponent],
            imports: [NoopAnimationsModule, DynamicFormModule]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DateComponent);
        component = fixture.componentInstance;
        formBuilder = new FormBuilder();
        component.group = formBuilder.group({
            test: {}
        });
        component.field = {
            type: 'date',
            name: 'test',
            label: 'label'
        };
        fixture.detectChanges();
    });

    it('should compile', () => {
        expect(component).toBeTruthy();
    });

    describe('#trackValidation', () => {
        it('should return string to track for loop by', () => {
            const retVal = component.trackValidation(0, {
                message: '',
                name: 'test',
                validator: {}
            });
            expect(retVal).toBeDefined();
        });
    });
});
