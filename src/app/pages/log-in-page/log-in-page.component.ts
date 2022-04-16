import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/security/auth.service';
import { Router } from '@angular/router';
import { CredentialsStatus } from 'src/app/models/credentialsStatus';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in-page.component.html',
  styleUrls: ['./log-in-page.component.scss'],
})
export class LogInPageComponent {
  loginForm: FormGroup;
  authResult = CredentialsStatus.CREDENTIALS_NOT_CHECKED;

  constructor(private authService: AuthService, private router: Router) {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
    });
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  get info(): string | null {
    if (this.authResult === CredentialsStatus.WRONG_ROLE) {
      return 'К сожалению, Ваша роль в системе не позволяет воспользоваться данным функционалом. Обратитесь к администратору, пожалуйста.';
    }
    if (this.authResult === CredentialsStatus.CREDENTIALS_NOT_FOUND) {
      return 'К сожалению, пользователь не обнаружен в системе. Пожалуйста, проверьте вводимые данные и попробуйте ещё раз.';
    }
    return null;
  }

  onSubmit(event: any) {
    event.preventDefault();
    event.stopPropagation();

    if (this.email?.invalid) {
      this.email.markAsDirty();

      if (this.password?.invalid) {
        this.password.markAsDirty();
      }
      return;
    }

    if (this.password?.invalid) {
      this.password.markAsDirty();
      return;
    }

    this.authService
      .authorize(this.email?.value, this.password?.value)
      .subscribe({
        next: (token) => {
          this.authResult = this.authService.saveUser(token);
          if (this.authResult === CredentialsStatus.CREDENTIALS_OK) {
            this.router.navigate(['']);
          }
        },
        error: () =>
          (this.authResult = CredentialsStatus.CREDENTIALS_NOT_FOUND),
      });
  }
}
