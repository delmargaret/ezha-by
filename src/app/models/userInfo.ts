import { Towns } from './towns';

export interface UserInfo {
  id: string;
  name: string;
  surname: string;
  patronymic: string;
  phone: string;
  password: string | null;
  town: Towns;
  street: string;
  houseNumber: string;
  flatNumber: string;
}
