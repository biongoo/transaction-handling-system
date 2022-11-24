import { UserRole } from 'enums';

export type User = {
  _id: string;
  email: string;
  role: UserRole;
};
