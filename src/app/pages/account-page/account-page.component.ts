import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Towns } from 'src/app/models/towns';
import { UserInfo } from 'src/app/models/userInfo';
import { AuthService } from 'src/app/security/auth.service';
import { PasswordService } from 'src/app/services/password.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-account-page',
  templateUrl: './account-page.component.html',
  styleUrls: ['./account-page.component.scss'],
})
export class AccountPageComponent implements OnInit {
  accountForm: FormGroup;
  towns = Towns;
  currentTown = Towns.Minsk;
  info: string | null;
  user: UserInfo | null = null;
  isLoading: boolean = true;

  constructor(
    private passwordService: PasswordService,
    private usersService: UsersService,
    private authService: AuthService,
    private router: Router
  ) {
    this.accountForm = new FormGroup({
      name: new FormControl('', Validators.required),
      surname: new FormControl('', Validators.required),
      phone: new FormControl('', [Validators.required]),
      patronymic: new FormControl(),
      street: new FormControl(),
      house: new FormControl(),
      flat: new FormControl(),
      password: new FormControl(),
    });

    this.info = null;
  }

  get patronymic() {
    return this.accountForm.get('patronymic');
  }

  get name() {
    return this.accountForm.get('name');
  }

  get surname() {
    return this.accountForm.get('surname');
  }

  get street() {
    return this.accountForm.get('street');
  }

  get phone() {
    return this.accountForm.get('phone');
  }

  get house() {
    return this.accountForm.get('house');
  }

  get flat() {
    return this.accountForm.get('flat');
  }

  get password() {
    return this.accountForm.get('password');
  }

  ngOnInit(): void {
    this.usersService
      .GetUser(this.authService.getUser().userId ?? '')
      .subscribe({
        next: (user) => {
          this.user = user;
          this.accountForm.setValue({
            name: user.name,
            surname: user.surname,
            phone: user.phone,
            patronymic: user.patronymic,
            street: user.street,
            house: user.houseNumber,
            flat: user.flatNumber,
            password: '',
          });

          let options = document
            .getElementById('location')
            ?.getElementsByTagName('option');
          const index = user.town as number;
          this.currentTown = index;
          options && options[index].setAttribute('selected', 'selected');

          this.isLoading = false;
        },
        error: (err) => console.log(err),
      });
  }

  onSubmit(event: any) {
    event.preventDefault();
    event.stopPropagation();

    if (this.accountForm?.invalid) {
      this.patronymic?.invalid && this.patronymic.markAsDirty();
      this.name?.invalid && this.name.markAsDirty();
      this.surname?.invalid && this.surname.markAsDirty();
      this.phone?.invalid && this.phone.markAsDirty();
      this.passwordService.checkPassword(
        this.password?.value,
        this.password,
        true
      );
      this.info = this.passwordService.info;
      this.password?.invalid && this.password.markAsDirty();
      return;
    }

    const strength = this.passwordService.checkPassword(
      this.password?.value,
      this.password,
      true
    );
    this.info = this.passwordService.info;
    if (strength < 3) {
      return;
    }

    this.isLoading = true;
    this.usersService
      .UpdateUser({
        id: this.user?.id ?? '',
        name: this.name?.value,
        surname: this.surname?.value,
        patronymic: this.patronymic?.value,
        phone: this.phone?.value,
        town: this.currentTown,
        street: this.street?.value,
        houseNumber: this.house?.value,
        flatNumber: this.flat?.value,
        password: this.password ? this.password.value : '',
      })
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.router.navigate(['/account']);
        },
        error: (e) => console.error(e),
      });
  }

  onChangeLocationType(type: string) {
    this.currentTown = parseInt(type);
  }
}
