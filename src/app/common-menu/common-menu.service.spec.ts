import { TestBed } from '@angular/core/testing';

import { CommonMenuService } from './common-menu.service';

describe('CommonMenuService', () => {
  let service: CommonMenuService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommonMenuService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
