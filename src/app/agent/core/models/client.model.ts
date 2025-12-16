export interface Client {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    address?: string;
    nationalId?: string;
    dateOfBirth?: Date;
    enrollmentDate?: Date;
    status: 'active' | 'pending' | 'suspended' | 'closed';
  }