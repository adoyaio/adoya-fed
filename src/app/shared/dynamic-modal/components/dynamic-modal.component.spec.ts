import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicModalComponent } from './dynamic-modal.component';
import { MaterialModule } from '../../material-design/material.module';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DynamicModalDialogData } from '../interfaces/DynamicModalDialogData';

describe('DynamicModalComponent', () => {
    let component: DynamicModalComponent;
    let fixture: ComponentFixture<DynamicModalComponent>;
    const noActionNoData: DynamicModalDialogData = {
        title: 'Test',
        content: `<div>test</div>`,
        actionYes: `OK`,
    };

    const noTitleData: DynamicModalDialogData = {
        content: `<div>test</div>`,
        actionNo: `CANCEL`,
        actionYes: `DELETE`
    };

    const noActionYesData: DynamicModalDialogData = {
        title: 'Test',
        content: `<div>test</div>`,
        actionNo: `CANCEL`,
    };

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DynamicModalComponent],
            imports: [
                MaterialModule
            ],
            providers: [
                {
                    provide: MatDialogRef, useValue: { close: (dialogResult: any) => { } }
                },
                { provide: MAT_DIALOG_DATA, useValue: noTitleData },
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DynamicModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('#ngOnInit', () => {
        it('should initialize local values with no Title passed in', () => {
            component.ngOnInit();
            expect(component.hideTitle).toBeTruthy();
            expect(component.showActionNo).toBeTruthy();
            expect(component.showActionYes).toBeTruthy();
        });
    });

    describe('#ngAfterViewInit', () => {
        it('should set template values when passed in data provides them', () => {
            component.ngAfterViewInit();
            expect(component.actionYesButton).toBeTruthy();
            expect(component.content.nativeElement).toBeTruthy();
            expect(component.actionNoButton.nativeElement).toBeTruthy();
        });
        it('should not set certain template values when data doesnt provide them', () => {
            spyOn(component.modalTitleWrapper.nativeElement, 'remove');
            component.ngAfterViewInit();
            expect(component.modalTitleWrapper.nativeElement.remove).toHaveBeenCalled();
        });
        it('should use rxjs to create and subscribe to an observable from \'no\' click event ', () => {
            spyOn(component, 'onNoClick');
            component.actionNoButton.nativeElement.click();
            expect(component.onNoClick).toHaveBeenCalled();
        });
        it('should use rxjs to create and subscribe to an observable from \'yes\' click event ', () => {
            spyOn(component, 'onYesClick');
            component.actionYesButton.nativeElement.click();
            expect(component.onYesClick).toHaveBeenCalled();
        });
    });

    describe('#ngOnInit', () => {
        it('should initialize local values without actionNo passed in', () => {
            component.data = noActionNoData;
            component.ngOnInit();
            expect(component.hideTitle).toBeFalsy();
            expect(component.showActionNo).toBeFalsy();
            expect(component.showActionYes).toBeTruthy();

        });
    });

    describe('#ngAfterViewInit', () => {
        it('should remove the no button from template, when data doesnt provide value', () => {
            component.data = noActionNoData;
            spyOn(component.actionNoButton.nativeElement, 'remove');
            component.ngOnInit();
            component.ngAfterViewInit();
            expect(component.actionNoButton.nativeElement.remove).toHaveBeenCalled();
        });
    });

    describe('#ngOnInit', () => {
        it('should initialize local values without actionYes passed in', () => {
            component.data = noActionYesData;
            component.ngOnInit();
            expect(component.hideTitle).toBeFalsy();
            expect(component.showActionNo).toBeTruthy();
            expect(component.showActionYes).toBeFalsy();

        });
    });

    describe('#ngAfterViewInit', () => {
        it('should remove yes button from template when data doesnt provide value', () => {
            component.data = noActionYesData;
            spyOn(component.actionYesButton.nativeElement, 'remove');
            component.ngOnInit();
            component.ngAfterViewInit();
            expect(component.actionYesButton.nativeElement.remove).toHaveBeenCalled();
        });
    });

    describe('#onYesClick', () => {
        it('should call close on dialogRef', () => {
            spyOn(component.dialogRef, 'close');
            component.onYesClick();
            expect(component.dialogRef.close).toHaveBeenCalled();
        });
    });

    describe('#onNoClick', () => {
        it('should call close on dialogRef', () => {
            spyOn(component.dialogRef, 'close');
            component.onNoClick();
            expect(component.dialogRef.close).toHaveBeenCalled();
        });
    });
});