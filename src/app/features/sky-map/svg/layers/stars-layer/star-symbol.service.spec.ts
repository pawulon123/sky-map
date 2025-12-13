import { TestBed } from '@angular/core/testing';

import { StarSymbolService } from './star-symbol.service';

describe('StarSymbolService', () => {
  let service: StarSymbolService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StarSymbolService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
