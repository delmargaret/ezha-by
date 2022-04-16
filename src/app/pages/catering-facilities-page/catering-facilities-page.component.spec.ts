import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CateringFacilitiesPageComponent } from './catering-facilities-page.component';

describe('CateringFacilitiesPageComponent', () => {
  let component: CateringFacilitiesPageComponent;
  let fixture: ComponentFixture<CateringFacilitiesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CateringFacilitiesPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CateringFacilitiesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
