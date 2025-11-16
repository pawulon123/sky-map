import { TestBed } from '@angular/core/testing';

import { RefreshProjectionService } from './refresh-projection.service';

describe('RefreshProjectionService', () => {
  let service: RefreshProjectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RefreshProjectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
