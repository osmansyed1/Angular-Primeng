import { TestBed } from '@angular/core/testing';

import { EmpserviceService } from './empservice.service';

describe('EmpserviceService', () => {
  let service: EmpserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmpserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
