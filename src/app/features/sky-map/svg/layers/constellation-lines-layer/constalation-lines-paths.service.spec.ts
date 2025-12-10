import { TestBed } from '@angular/core/testing';

import { ConstalationLinesPathsService } from './constalation-lines-paths.service';

describe('ConstalationLinesPathsService', () => {
  let service: ConstalationLinesPathsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConstalationLinesPathsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
