import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClickwrapComponent } from './clickwrap.component';

describe('ClickwrapComponent', () => {
  let component: ClickwrapComponent;
  let fixture: ComponentFixture<ClickwrapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClickwrapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClickwrapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
