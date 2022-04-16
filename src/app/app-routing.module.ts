import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutUsPageComponent } from './pages/about-us-page/about-us-page.component';
import { AccountPageComponent } from './pages/account-page/account-page.component';
import { CateringFacilitiesPageComponent } from './pages/catering-facilities-page/catering-facilities-page.component';
import { CateringFacilityPageComponent } from './pages/catering-facility-page/catering-facility-page.component';
import { ContactUsPageComponent } from './pages/contact-us-page/contact-us-page.component';
import { CourierPageComponent } from './pages/courier-page/courier-page.component';
import { LogInPageComponent } from './pages/log-in-page/log-in-page.component';
import { MainPageComponent } from './pages/main-page/main-page.component';
import { MyOrdersPageComponent } from './pages/my-orders-page/my-orders-page.component';
import { NewPasswordPageComponent } from './pages/new-password-page/new-password-page.component';
import { PartnerPageComponent } from './pages/partner-page/partner-page.component';
import { RegisterPageComponent } from './pages/register-page/register-page.component';
import { ResetPasswordPageComponent } from './pages/reset-password-page/reset-password-page.component';
import { ShoppingCartErrorPageComponent } from './pages/shopping-cart-error-page/shopping-cart-error-page.component';
import { ShoppingCartPageComponent } from './pages/shopping-cart-page/shopping-cart-page.component';
import { ShoppingCartSuccessPageComponent } from './pages/shopping-cart-success-page/shopping-cart-success-page.component';
import { TermsOfServicePageComponent } from './pages/terms-of-service-page/terms-of-service-page.component';
import { AuthGuard } from './security/auth-guard';

const routes: Routes = [
  { path: '', component: MainPageComponent, pathMatch: 'full' },
  { path: 'partner', component: PartnerPageComponent, pathMatch: 'full' },
  { path: 'courier', component: CourierPageComponent, pathMatch: 'full' },
  { path: 'terms', component: TermsOfServicePageComponent, pathMatch: 'full' },
  { path: 'about-us', component: AboutUsPageComponent, pathMatch: 'full' },
  { path: 'contact-us', component: ContactUsPageComponent, pathMatch: 'full' },
  {
    path: 'cafes',
    component: CateringFacilitiesPageComponent,
    pathMatch: 'full',
  },
  {
    path: 'cafe',
    component: CateringFacilityPageComponent,
    pathMatch: 'full',
  },
  {
    path: 'cart',
    component: ShoppingCartPageComponent,
    pathMatch: 'full',
  },
  {
    path: 'cart/success',
    component: ShoppingCartSuccessPageComponent,
    pathMatch: 'full',
  },
  {
    path: 'cart/error',
    component: ShoppingCartErrorPageComponent,
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LogInPageComponent,
    pathMatch: 'full',
  },
  {
    path: 'register',
    component: RegisterPageComponent,
    pathMatch: 'full',
  },
  {
    path: 'account',
    component: AccountPageComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'orders',
    component: MyOrdersPageComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'reset-password',
    component: ResetPasswordPageComponent,
  },
  {
    path: 'new-password',
    component: NewPasswordPageComponent,
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
