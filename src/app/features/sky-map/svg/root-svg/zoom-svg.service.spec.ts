import { TestBed } from '@angular/core/testing';

import { ZoomSvgService } from './zoom-svg.service';

describe('ZoomSvgService', () => {
  let service: ZoomSvgService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ZoomSvgService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
