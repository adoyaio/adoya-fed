import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignReportingPieChartComponent } from './campaign-reporting-pie-chart.component';

describe('CampaignReportingPieChartComponent', () => {
  let component: CampaignReportingPieChartComponent;
  let fixture: ComponentFixture<CampaignReportingPieChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CampaignReportingPieChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignReportingPieChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
