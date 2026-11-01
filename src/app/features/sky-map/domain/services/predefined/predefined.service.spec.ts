import { TestBed } from '@angular/core/testing';

import { PredefinedService } from './predefined.service';

describe('PredefinedService', () => {
  let service: PredefinedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PredefinedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
