import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnsignedUserViewComponent } from './unsigned-user-view.component';

describe('UnsignedUserViewComponent', () => {
  let component: UnsignedUserViewComponent;
  let fixture: ComponentFixture<UnsignedUserViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnsignedUserViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnsignedUserViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
