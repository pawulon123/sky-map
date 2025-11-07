import { TestBed } from '@angular/core/testing';

import { BoundariesService } from './boundaries.service';

describe('BoundariesService', () => {
  let service: BoundariesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BoundariesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
