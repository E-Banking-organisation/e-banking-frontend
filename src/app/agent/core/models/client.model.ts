export interface Client {
  id?: string;            // ✅ STRING (TRÈS IMPORTANT)
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  nationalId?: string;
  dateOfBirth?: string;
  status?: 'active' | 'pending' | 'suspended' | 'closed';
}
