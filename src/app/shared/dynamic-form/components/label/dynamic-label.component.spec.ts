import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { DynamicFormModule } from '../../dynamic-form.module';
import { FIELD, FORM } from '../../models/injection-tokens';
import { DynamicLabelComponent } from './dynamic-label.component';

describe('DynamicLabelComponent', () => {
    let component: DynamicLabelComponent;
    let fixture: ComponentFixture<DynamicLabelComponent>;
    let formBuilder: FormBuilder;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DynamicLabelComponent],
            imports: [DynamicFormModule],
            providers: [
                {
                    provide: FIELD,
                    useValue: ''
                },
                { provide: FORM, useValue: '' }
            ]
        }).compileComponents();
    }));
    beforeEach(() => {
        fixture = TestBed.createComponent(DynamicLabelComponent);
        component = fixture.componentInstance;
        formBuilder = new FormBuilder();
        component.form = formBuilder.group({
            test: {}
        });
        component.field = {
            type: 'radio',
            name: 'test'
        };
        fixture.detectChanges();
    });

    it('should compile', () => {
        expect(component).toBeTruthy();
    });

    describe('#getValue', () => {
        it('should return value', () => {
            let retVal = component.getValue();
            expect(retVal).toBeDefined();
            component.field.type = 'select';
            component.field.options = [
                {
                    label: '',
                    value: ''
                }
            ];
            retVal = component.getValue();
            expect(retVal).toBeDefined();
        });
    });

    describe('#getPlaceholder', () => {
        it('should return placeholder', () => {
            const retVal = component.getPlaceholder();
            expect(retVal).toBeDefined();
        });
    });
});
