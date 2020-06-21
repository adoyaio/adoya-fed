import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { DynamicFormModule } from '../../dynamic-form.module';
import { FIELD, FORM } from '../../models/injection-tokens';
import { ContentSectionComponent } from './content-section.component';

describe('ContentSectionComponent', () => {
    let component: ContentSectionComponent;
    let fixture: ComponentFixture<ContentSectionComponent>;
    let formBuilder: FormBuilder;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ContentSectionComponent],
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
        fixture = TestBed.createComponent(ContentSectionComponent);
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
});
