import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ComponentsModule } from './components/components.module';
import { AuthModule } from './security/auth.module';
import { StoreModule } from '@ngrx/store';
import { mainReducer } from './state/reducers/main.reducer';
import { HttpClientModule } from '@angular/common/http';
import { MainPageComponent } from './pages/main-page/main-page.component';
import { PartnerPageComponent } from './pages/partner-page/partner-page.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RequestsService } from './services/requests.service';
import { CourierPageComponent } from './pages/courier-page/courier-page.component';
import { TermsOfServicePageComponent } from './pages/terms-of-service-page/terms-of-service-page.component';
import { AboutUsPageComponent } from './pages/about-us-page/about-us-page.component';
import { ContactUsPageComponent } from './pages/contact-us-page/contact-us-page.component';
import { CateringFacilitiesService } from './services/catering-facilities.service';
import { CateringFacilitiesPageComponent } from './pages/catering-facilities-page/catering-facilities-page.component';
import { CateringFacilityPageComponent } from './pages/catering-facility-page/catering-facility-page.component';
import { ShoppingCartPageComponent } from './pages/shopping-cart-page/shopping-cart-page.component';
import { ShoppingCartSuccessPageComponent } from './pages/shopping-cart-success-page/shopping-cart-success-page.component';
import { ShoppingCartErrorPageComponent } from './pages/shopping-cart-error-page/shopping-cart-error-page.component';
import { OrdersService } from './services/orders.service';
import { LogInPageComponent } from './pages/log-in-page/log-in-page.component';
import { RegisterPageComponent } from './pages/register-page/register-page.component';
import { UsersService } from './services/users.service';
import { AccountPageComponent } from './pages/account-page/account-page.component';
import { PasswordService } from './services/password.service';
import { MyOrdersPageComponent } from './pages/my-orders-page/my-orders-page.component';
import { ResetPasswordPageComponent } from './pages/reset-password-page/reset-password-page.component';
import { NewPasswordPageComponent } from './pages/new-password-page/new-password-page.component';

@NgModule({
  declarations: [
    AppComponent,
    MainPageComponent,
    PartnerPageComponent,
    CourierPageComponent,
    TermsOfServicePageComponent,
    AboutUsPageComponent,
    ContactUsPageComponent,
    CateringFacilitiesPageComponent,
    CateringFacilityPageComponent,
    ShoppingCartPageComponent,
    ShoppingCartSuccessPageComponent,
    ShoppingCartErrorPageComponent,
    LogInPageComponent,
    RegisterPageComponent,
    AccountPageComponent,
    MyOrdersPageComponent,
    ResetPasswordPageComponent,
    NewPasswordPageComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ComponentsModule,
    AuthModule,
    HttpClientModule,
    ReactiveFormsModule,
    StoreModule.forRoot(mainReducer),
  ],
  providers: [
    RequestsService,
    CateringFacilitiesService,
    OrdersService,
    UsersService,
    PasswordService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
