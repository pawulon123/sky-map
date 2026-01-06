import { TestBed } from '@angular/core/testing';

import { ConstellationLinesPanelsLayerService } from './constellation-lines-panels-layer.service';

describe('ConstellationLinesPanelsLayerService', () => {
  let service: ConstellationLinesPanelsLayerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConstellationLinesPanelsLayerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
