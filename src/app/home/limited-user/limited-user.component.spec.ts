import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LimitedUserComponent } from './limited-user.component';

describe('LimitedUserComponent', () => {
  let component: LimitedUserComponent;
  let fixture: ComponentFixture<LimitedUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LimitedUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LimitedUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
