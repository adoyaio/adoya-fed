import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MmpCarouselComponent } from './mmp-carousel.component';

describe('MmpCarouselComponent', () => {
  let component: MmpCarouselComponent;
  let fixture: ComponentFixture<MmpCarouselComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MmpCarouselComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MmpCarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
