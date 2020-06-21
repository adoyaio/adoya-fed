import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { DynamicFormModule } from '../../dynamic-form.module';
import { ButtonComponent } from './button.component';

describe('ButtonComponent', () => {
    let component: ButtonComponent;
    let fixture: ComponentFixture<ButtonComponent>;
    let formBuilder: FormBuilder;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ButtonComponent],
            imports: [DynamicFormModule]
        }).compileComponents();
    }));
    beforeEach(() => {
        fixture = TestBed.createComponent(ButtonComponent);
        component = fixture.componentInstance;
        formBuilder = new FormBuilder();
        component.group = formBuilder.group({
            test: {}
        });
        component.field = {
            type: 'button',
            name: 'test'
        };
        fixture.detectChanges();
    });

    it('should compile', () => {
        expect(component).toBeTruthy();
    });
});
