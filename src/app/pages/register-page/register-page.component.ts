import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UsersService } from 'src/app/services/users.service';
import { AuthService } from 'src/app/security/auth.service';
import { PasswordService } from 'src/app/services/password.service';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss'],
})
export class RegisterPageComponent implements OnInit {
  registerForm: FormGroup;
  info: string | null;
  registerInfo: string | null = null;

  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private passwordService: PasswordService
  ) {
    this.registerForm = new FormGroup({
      name: new FormControl('', Validators.required),
      surname: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      phone: new FormControl('', [Validators.required]),
      patronymic: new FormControl(),
      password: new FormControl(''),
    });

    this.info = null;
  }

  ngOnInit(): void {}

  get patronymic() {
    return this.registerForm.get('patronymic');
  }

  get name() {
    return this.registerForm.get('name');
  }

  get surname() {
    return this.registerForm.get('surname');
  }

  get email() {
    return this.registerForm.get('email');
  }

  get phone() {
    return this.registerForm.get('phone');
  }

  get password() {
    return this.registerForm.get('password');
  }

  onSubmit(event: any) {
    event.preventDefault();
    event.stopPropagation();
    this.registerInfo = null;

    if (this.registerForm?.invalid) {
      this.patronymic?.invalid && this.patronymic.markAsDirty();
      this.name?.invalid && this.name.markAsDirty();
      this.surname?.invalid && this.surname.markAsDirty();
      this.email?.invalid && this.email.markAsDirty();
      this.phone?.invalid && this.phone.markAsDirty();
      this.passwordService.checkPassword(this.password?.value, this.password);
      this.info = this.passwordService.info;
      this.password?.invalid && this.password.markAsDirty();
      return;
    }

    const strength = this.passwordService.checkPassword(
      this.password?.value,
      this.password
    );
    this.info = this.passwordService.info;
    if (strength < 3) {
      return;
    }

    this.usersService
      .AddUser({
        name: this.name?.value,
        surname: this.surname?.value,
        patronymic: this.patronymic?.value,
        phone: this.phone?.value,
        email: this.email?.value,
        password: this.password?.value,
      })
      .subscribe({
        next: () => this.authService.removeUser(),
        error: (e) => {
          if (e.status === 409) {
            this.registerInfo = 'Аккаунт с таким e-mail уже существует.';
          }
          console.error(e);
        },
      });
  }
}
