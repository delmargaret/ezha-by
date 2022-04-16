import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { AuthGuard } from './auth-guard';
import { AuthService } from './auth.service';
import { JwtInterceptor } from './jwt-interceptor';

@NgModule({
  providers: [
    AuthService,
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      deps: [AuthService],
      useFactory: (authService: AuthService) => new JwtInterceptor(authService),
      multi: true,
    },
  ],
})
export class AuthModule {}
