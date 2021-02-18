import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DBTestComponent } from './dbtest.component';

describe('DBTestComponent', () => {
  let component: DBTestComponent;
  let fixture: ComponentFixture<DBTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DBTestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DBTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
