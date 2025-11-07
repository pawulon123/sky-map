import { TestBed } from '@angular/core/testing';

import { ConstellationLinesService } from './constellation-lines.service';

describe('ConstellationLinesService', () => {
  let service: ConstellationLinesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConstellationLinesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
