import { TestBed } from '@angular/core/testing';

import { HiveSidebarService } from './sidebar.service';

describe('SidebarService', () => {
  let service: HiveSidebarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HiveSidebarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
