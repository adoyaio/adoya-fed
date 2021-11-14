import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomesitePartnersComponent } from './homesite-partners.component';

describe('HomesitePartnersComponent', () => {
  let component: HomesitePartnersComponent;
  let fixture: ComponentFixture<HomesitePartnersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomesitePartnersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomesitePartnersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
