import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InitLiveComponent } from './init-live.component';



describe('InitLiveComponent', () => {
  let component: InitLiveComponent;
  let fixture: ComponentFixture<InitLiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InitLiveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InitLiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
