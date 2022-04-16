import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CredentialsStatus } from 'src/app/models/credentialsStatus';
import { AuthService } from 'src/app/security/auth.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-reset-password-page',
  templateUrl: './reset-password-page.component.html',
  styleUrls: ['./reset-password-page.component.scss'],
})
export class ResetPasswordPageComponent implements OnInit {
  authResult = CredentialsStatus.CREDENTIALS_NOT_CHECKED;
  resetForm: FormGroup;

  constructor(private usersService: UsersService, private router: Router) {
    this.resetForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
    });
  }

  get email() {
    return this.resetForm.get('email');
  }

  ngOnInit(): void {}

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
      return;
    }

    this.usersService.ResendEmail(this.email?.value).subscribe({
      next: () => {
        this.authResult = CredentialsStatus.CREDENTIALS_OK;
        this.router.navigate(['/login']);
      },
      error: (e) => {
        if (e.status === 409) {
          this.authResult = CredentialsStatus.CREDENTIALS_NOT_FOUND;
        }
        console.error(e);
      },
    });
  }
}
