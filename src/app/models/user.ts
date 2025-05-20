import { Address } from './address';
import { UserRole } from './user-role';

export interface User {
  id?: number;
  name: string;
  email: string;
  role: UserRole;
  addresses?: Address[];
}
