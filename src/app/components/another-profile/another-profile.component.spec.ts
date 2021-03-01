import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnotherProfileComponent } from './another-profile.component';

describe('AnotherProfileComponent', () => {
  let component: AnotherProfileComponent;
  let fixture: ComponentFixture<AnotherProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnotherProfileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnotherProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
