import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignReportingComponent } from './campaign-reporting.component';

describe('CampaignReportingComponent', () => {
  let component: CampaignReportingComponent;
  let fixture: ComponentFixture<CampaignReportingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CampaignReportingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignReportingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
