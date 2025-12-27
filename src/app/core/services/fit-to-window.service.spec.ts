import { TestBed } from '@angular/core/testing';

import { FitToWindowService } from './fit-to-window.service';

describe('FitToWindowService', () => {
  let service: FitToWindowService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FitToWindowService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
