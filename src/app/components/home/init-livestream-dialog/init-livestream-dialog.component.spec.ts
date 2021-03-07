import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InitLivestreamDialogComponent } from './init-livestream-dialog.component';

describe('InitLivestreamDialogComponent', () => {
  let component: InitLivestreamDialogComponent;
  let fixture: ComponentFixture<InitLivestreamDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InitLivestreamDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InitLivestreamDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
