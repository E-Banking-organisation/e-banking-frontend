export interface User {
  id: string;
  firstName: string;
  lastName: string;
  dateCreated: Date | null;
  email: string;
  phone: string;
  birthday: Date | null;
  password: string;
  role: 'agent' | 'admin' | 'client';
  twoFactorEnabled: boolean;
}
