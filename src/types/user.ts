export type User = {
  _id: string;
  email: string;
  role: 'user' | 'employee' | 'admin';
};
