import { Client } from './client.model';

export interface Subscriber extends Client {
  subscriptionId: string;
  subscriptionDate: Date;
  subscriptionType: 'standard' | 'premium' | 'vip';
  subscriptionStatus: 'active' | 'expired' | 'cancelled';
  expirationDate: Date;
  autoRenewal: boolean;
  accounts: SubscriberAccount[];
}

export interface SubscriberAccount {
  id: string;
  accountNumber: string;
  type: 'courant' | 'epargne' | 'livret';
  balance: number;
  currency: string;
  status: 'active' | 'blocked' | 'closed';
  dateCreated: Date;
}