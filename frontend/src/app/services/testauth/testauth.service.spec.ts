import { TestBed } from '@angular/core/testing';

import { TestAuthService } from './testauth.service';

describe('TestAuthService', () => {
  let service: TestAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TestAuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
