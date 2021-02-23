import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerfiyEmailComponent } from './verfiy-email.component';

describe('VerfiyEmailComponent', () => {
  let component: VerfiyEmailComponent;
  let fixture: ComponentFixture<VerfiyEmailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerfiyEmailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerfiyEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
