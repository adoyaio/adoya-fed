import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KeywordReportingPieChartComponent } from './keyword-reporting-pie-chart.component';

describe('KeywordReportingPieChartComponent', () => {
  let component: KeywordReportingPieChartComponent;
  let fixture: ComponentFixture<KeywordReportingPieChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KeywordReportingPieChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KeywordReportingPieChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
