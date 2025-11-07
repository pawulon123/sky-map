import { TestBed } from '@angular/core/testing';

import { SkyMapStateService } from './sky-map-state.service';

describe('SkyMapStateService', () => {
  let service: SkyMapStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SkyMapStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
