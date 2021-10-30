import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportingCarouselComponent } from './reporting-carousel.component';

describe('ReportingCarouselComponent', () => {
  let component: ReportingCarouselComponent;
  let fixture: ComponentFixture<ReportingCarouselComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportingCarouselComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportingCarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
