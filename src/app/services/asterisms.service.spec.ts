import { TestBed } from '@angular/core/testing';

import { AsterismsService } from './asterisms.service';

describe('AsterismsService', () => {
  let service: AsterismsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AsterismsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
