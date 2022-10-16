import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PortalInternalComponent } from './portal-internal.component';

describe('PortalInternalComponent', () => {
  let component: PortalInternalComponent;
  let fixture: ComponentFixture<PortalInternalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PortalInternalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PortalInternalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
