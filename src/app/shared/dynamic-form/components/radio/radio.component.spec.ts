import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { DynamicFormModule } from '../../dynamic-form.module';
import { FIELD, FORM } from '../../models/injection-tokens';
import { RadioComponent } from './radio.component';

describe('RadioComponent', () => {
    let component: RadioComponent;
    let fixture: ComponentFixture<RadioComponent>;
    let formBuilder: FormBuilder;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [RadioComponent],
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
        fixture = TestBed.createComponent(RadioComponent);
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

    describe('#trackOption', () => {
        it('should return string for tracking ngFor loop', () => {
            const result = component.trackOption(0, {
                label: 'test',
                value: 'test'
            });
            expect(result).toBeDefined();
        });
    });

    describe('#handleTooltipClick', () => {
        it('should call tooltipClick', () => {
            component.field.tooltipClick = () => {};
            component.handleTooltipClick();
        });
    });
});
