import { Client } from './client.model';

export interface Enrollment {
  id: string;
  client: Client;
  status: 'pending' | 'approved' | 'rejected';
  dateCreated: Date;
  dateProcessed?: Date;
  processedByAgentId?: string;
  rejectionReason?: string;
}

export interface AccountEnrollment {
  id: string;
  enrollmentId: string;
  accountType: 'courant' | 'epargne' | 'livret';
  initialDeposit?: number;
  currency: string;
  status: 'pending' | 'approved' | 'rejected';
}