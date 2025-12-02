import { TestBed } from '@angular/core/testing';

import { BoundaryPathService } from './boundary-path.service';

describe('BoundaryPathService', () => {
  let service: BoundaryPathService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BoundaryPathService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
