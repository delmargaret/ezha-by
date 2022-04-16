import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';
import { PasswordService } from 'src/app/services/password.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-new-password-page',
  templateUrl: './new-password-page.component.html',
  styleUrls: ['./new-password-page.component.scss'],
})
export class NewPasswordPageComponent implements OnInit {
  newPasswordForm: FormGroup;
  info: string | null = null;
  userId: string | null = null;

  constructor(
    private passwordService: PasswordService,
    private usersService: UsersService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.newPasswordForm = new FormGroup({
      password: new FormControl(''),
    });
  }

  ngOnInit(): void {
    this.route.queryParams
      .pipe(map((p) => p['u']))
      .subscribe((id) => (this.userId = id));
  }

  get password() {
    return this.newPasswordForm.get('password');
  }

  onSubmit(event: any) {
    event.preventDefault();
    event.stopPropagation();

    if (this.newPasswordForm?.invalid) {
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
      .SendNewPassword(this.userId ?? '', this.password?.value)
      .subscribe({
        next: () => {
          this.router.navigate(['/login']);
        },
        error: (e) => {
          console.error(e);
        },
      });
  }
}
