import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LegalSecureComponent } from './legal-secure.component';

describe('LegalSecureComponent', () => {
  let component: LegalSecureComponent;
  let fixture: ComponentFixture<LegalSecureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LegalSecureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LegalSecureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
