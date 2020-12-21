import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CmsHomeComponent } from './cms-home.component';

describe('CmsHomeComponent', () => {
  let component: CmsHomeComponent;
  let fixture: ComponentFixture<CmsHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CmsHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CmsHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
