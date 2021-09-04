import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeSiteMenuComponent } from './home-site-menu.component';

describe('HomeSiteMenuComponent', () => {
  let component: HomeSiteMenuComponent;
  let fixture: ComponentFixture<HomeSiteMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeSiteMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeSiteMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
