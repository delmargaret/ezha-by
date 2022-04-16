import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShoppingCartSuccessPageComponent } from './shopping-cart-success-page.component';

describe('ShoppingCartSuccessPageComponent', () => {
  let component: ShoppingCartSuccessPageComponent;
  let fixture: ComponentFixture<ShoppingCartSuccessPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShoppingCartSuccessPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShoppingCartSuccessPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
