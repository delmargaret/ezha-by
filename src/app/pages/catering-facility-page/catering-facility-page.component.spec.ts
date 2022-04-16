import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CateringFacilityPageComponent } from './catering-facility-page.component';

describe('CateringFacilityPageComponent', () => {
  let component: CateringFacilityPageComponent;
  let fixture: ComponentFixture<CateringFacilityPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CateringFacilityPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CateringFacilityPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
