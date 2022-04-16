import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeavesWrapperComponent } from './leaves-wrapper.component';

describe('LeavesWrapperComponent', () => {
  let component: LeavesWrapperComponent;
  let fixture: ComponentFixture<LeavesWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeavesWrapperComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeavesWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
