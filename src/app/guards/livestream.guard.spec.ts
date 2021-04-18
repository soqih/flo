import { TestBed } from '@angular/core/testing';

import { LivestreamGuard } from './livestream.guard';

describe('LivestreamGuard', () => {
  let guard: LivestreamGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(LivestreamGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
