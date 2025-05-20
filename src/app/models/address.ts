import { AddressType } from './address-type';
import { User } from './user';

export interface Address {
  id?: number;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  type: AddressType;
  user: User;
}
