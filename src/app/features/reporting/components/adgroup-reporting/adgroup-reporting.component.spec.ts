import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdgroupReportingComponent } from './adgroup-reporting.component';

describe('AdgroupReportingComponent', () => {
  let component: AdgroupReportingComponent;
  let fixture: ComponentFixture<AdgroupReportingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdgroupReportingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdgroupReportingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
