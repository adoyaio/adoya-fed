import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KeywordReportingComponent } from './keyword-reporting.component';

describe('KeywordReportingComponent', () => {
  let component: KeywordReportingComponent;
  let fixture: ComponentFixture<KeywordReportingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KeywordReportingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KeywordReportingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
