import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OptimizationsCarouselComponent } from './optimizations-carousel.component';

describe('OptimizationsCarouselComponent', () => {
  let component: OptimizationsCarouselComponent;
  let fixture: ComponentFixture<OptimizationsCarouselComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OptimizationsCarouselComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OptimizationsCarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
