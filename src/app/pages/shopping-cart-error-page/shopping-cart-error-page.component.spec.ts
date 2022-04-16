import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShoppingCartErrorPageComponent } from './shopping-cart-error-page.component';

describe('ShoppingCartErrorPageComponent', () => {
  let component: ShoppingCartErrorPageComponent;
  let fixture: ComponentFixture<ShoppingCartErrorPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShoppingCartErrorPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShoppingCartErrorPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
