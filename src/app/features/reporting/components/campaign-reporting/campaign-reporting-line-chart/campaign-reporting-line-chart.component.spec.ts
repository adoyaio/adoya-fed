import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignReportingLineChartComponent } from './campaign-reporting-line-chart.component';

describe('CampaignReportingLineChartComponent', () => {
  let component: CampaignReportingLineChartComponent;
  let fixture: ComponentFixture<CampaignReportingLineChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CampaignReportingLineChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignReportingLineChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
