import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Transaction } from '../models/transaction.model';

@Injectable({
  providedIn: 'root'
})
export class TransactionVerificationService {
  private mockTransactions: Transaction[] = [
    {
      id: 'T001',
      transactionType: 'TRANSFER',
      amount: 25000,
      currency: 'MAD',
      sourceAccountId: 'ACC123',
      sourceAccountNumber: '123456789',
      destinationAccountId: 'ACC456',
      destinationAccountNumber: '987654321',
      status: 'FLAGGED',
      timestamp: new Date('2023-05-10T14:32:00'),
      description: 'Transfer to Ali',
      flagReason: 'Amount exceeds usual patterns'
    },
    {
      id: 'T002',
      transactionType: 'WITHDRAWAL',
      amount: 5000,
      currency: 'MAD',
      sourceAccountId: 'ACC789',
      sourceAccountNumber: '456789123',
      status: 'PENDING',
      timestamp: new Date('2023-05-10T15:45:00'),
      description: 'ATM withdrawal'
    },
    {
      id: 'T003',
      transactionType: 'DEPOSIT',
      amount: 10000,
      currency: 'MAD',
      destinationAccountId: 'ACC123',
      destinationAccountNumber: '123456789',
      status: 'COMPLETED',
      timestamp: new Date('2023-05-09T09:15:00'),
      description: 'Salary deposit'
    },
    {
      id: 'T004',
      transactionType: 'TRANSFER',
      amount: 35000,
      currency: 'MAD',
      sourceAccountId: 'ACC456',
      sourceAccountNumber: '987654321',
      destinationAccountId: 'ACC789',
      destinationAccountNumber: '456789123',
      status: 'FLAGGED',
      timestamp: new Date('2023-05-08T11:20:00'),
      description: 'Business expenses',
      flagReason: 'Unusual destination account'
    },
    {
      id: 'T005',
      transactionType: 'PAYMENT',
      amount: 1200,
      currency: 'MAD',
      sourceAccountId: 'ACC123',
      sourceAccountNumber: '123456789',
      status: 'COMPLETED',
      timestamp: new Date('2023-05-07T17:05:00'),
      description: 'Electricity bill payment'
    },
    {
      id: 'T006',
      transactionType: 'RECHARGE',
      amount: 100,
      currency: 'MAD',
      sourceAccountId: 'ACC456',
      sourceAccountNumber: '987654321',
      status: 'COMPLETED',
      timestamp: new Date('2023-05-07T18:30:00'),
      description: 'Phone recharge'
    },
    {
      id: 'T007',
      transactionType: 'CRYPTO_PURCHASE',
      amount: 500,
      currency: 'USD',
      sourceAccountId: 'ACC789',
      sourceAccountNumber: '456789123',
      status: 'FLAGGED',
      timestamp: new Date('2023-05-06T10:45:00'),
      description: 'Bitcoin purchase',
      flagReason: 'Crypto purchase requires verification'
    }
  ];

  constructor(private http: HttpClient) { }

  getAllTransactions(): Observable<Transaction[]> {
    // Mock implementation
    return of(this.mockTransactions);
  }

  getFlaggedTransactions(): Observable<Transaction[]> {
    // Mock implementation
    const flaggedTransactions = this.mockTransactions.filter(t => t.status === 'FLAGGED');
    return of(flaggedTransactions);
  }

  getPendingTransactions(): Observable<Transaction[]> {
    // Mock implementation
    const pendingTransactions = this.mockTransactions.filter(t => t.status === 'PENDING');
    return of(pendingTransactions);
  }

  getTransactionById(id: string): Observable<Transaction | undefined> {
    // Mock implementation
    const transaction = this.mockTransactions.find(t => t.id === id);
    return of(transaction);
  }

  verifyTransaction(id: string, adminId: string): Observable<Transaction | undefined> {
    // Mock implementation
    const index = this.mockTransactions.findIndex(t => t.id === id);
    if (index !== -1) {
      this.mockTransactions[index] = {
        ...this.mockTransactions[index],
        status: 'VERIFIED',
        verifiedBy: adminId,
        verifiedAt: new Date()
      };
      return of(this.mockTransactions[index]);
    }
    return of(undefined);
  }

  rejectTransaction(id: string, adminId: string, reason: string): Observable<Transaction | undefined> {
    // Mock implementation
    const index = this.mockTransactions.findIndex(t => t.id === id);
    if (index !== -1) {
      this.mockTransactions[index] = {
        ...this.mockTransactions[index],
        status: 'FAILED',
        verifiedBy: adminId,
        verifiedAt: new Date(),
        flagReason: reason
      };
      return of(this.mockTransactions[index]);
    }
    return of(undefined);
  }
}