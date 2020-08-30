import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KeywordReportingLineChartComponent } from './keyword-reporting-line-chart.component';

describe('KeywordReportingLineChartComponent', () => {
  let component: KeywordReportingLineChartComponent;
  let fixture: ComponentFixture<KeywordReportingLineChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KeywordReportingLineChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KeywordReportingLineChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
