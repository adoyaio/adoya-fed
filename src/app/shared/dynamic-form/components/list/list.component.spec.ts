import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DynamicFormModule } from '../../dynamic-form.module';
import { FIELD, FORM } from '../../models/injection-tokens';
import { ListComponent } from './list.component';

describe('ListComponent', () => {
    let component: ListComponent;
    let fixture: ComponentFixture<ListComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [NoopAnimationsModule, DynamicFormModule],
            declarations: [ListComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
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
        fixture = TestBed.createComponent(ListComponent);
        component = fixture.componentInstance;
        component.form = new FormBuilder().group({
            test: {}
        });
        component.field = {
            type: 'list',
            name: 'test',
            label: 'label'
        };
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('#getMessage', () => {
        it('should return a message', () => {
            component.field = {
                name: '',
                type: 'list'
            };
            const retVal = component.getMessage('');
            expect(retVal).toBe('Unknown Message');
        });
    });
});
