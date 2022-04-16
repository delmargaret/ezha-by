import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { UserInfo } from '../models/userInfo';
import { ConfigService } from './config.service';

@Injectable()
export class UsersService {
  constructor(private http: HttpClient) {}

  AddUser(user: User) {
    return this.http.post(ConfigService.addBaseAddress(`api/users`), user);
  }

  UpdateUser(user: UserInfo) {
    return this.http.put(
      ConfigService.addBaseAddress(`api/users/${user.id}`),
      user
    );
  }

  GetUser(id: string): Observable<UserInfo> {
    return this.http.get<UserInfo>(
      ConfigService.addBaseAddress(`api/users/${id}`)
    );
  }

  ResendEmail(email: string) {
    return this.http.post(
      ConfigService.addBaseAddress('api/users/resend-email'),
      { email: email }
    );
  }

  SendNewPassword(id: string, password: string) {
    return this.http.post(
      ConfigService.addBaseAddress('api/users/new-password'),
      { id: id, password: password }
    );
  }
}
