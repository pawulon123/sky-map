import { TestBed } from '@angular/core/testing';

import { LabelBoundariesService } from './label-boundaries.service';

describe('LabelBoundariesService', () => {
  let service: LabelBoundariesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LabelBoundariesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
