import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { delay } from 'rxjs/operators';
import { AgentTransaction } from '../models/transaction.model';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private transactions: AgentTransaction[] = [
    {
      id: 't1',
      type: 'enrollment',
      date: new Date('2025-05-10'),
      details: 'Client enrollment initiated for Karim Najjar',
      agentId: 'agent001',
      clientId: '5',
      status: 'pending'
    },
    {
      id: 't2',
      type: 'enrollment',
      date: new Date('2025-05-12'),
      details: 'Client enrollment initiated for Nadia Toumi',
      agentId: 'agent001',
      clientId: '6',
      status: 'pending'
    },
    {
      id: 't3',
      type: 'subscription_management',
      date: new Date('2025-05-05'),
      details: 'Changed subscription type from standard to premium',
      agentId: 'agent001',
      clientId: '1',
      status: 'completed'
    },
    {
      id: 't4',
      type: 'account_creation',
      date: new Date('2025-05-03'),
      details: 'Created new savings account',
      agentId: 'agent001',
      clientId: '2',
      status: 'completed'
    }
  ];

  private transactionsSubject = new BehaviorSubject<AgentTransaction[]>(this.transactions);
  transactions$ = this.transactionsSubject.asObservable();

  constructor() { }

  getTransactions(): Observable<AgentTransaction[]> {
    return this.transactions$.pipe(delay(500));
  }

  getTransactionById(id: string): Observable<AgentTransaction | undefined> {
    const transaction = this.transactions.find(t => t.id === id);
    return of(transaction).pipe(delay(300));
  }

  createTransaction(transaction: Omit<AgentTransaction, 'id' | 'date'>): Observable<AgentTransaction> {
    const newTransaction: AgentTransaction = {
      ...transaction,
      id: `t${Date.now()}`,
      date: new Date()
    };
    
    this.transactions = [...this.transactions, newTransaction];
    this.transactionsSubject.next(this.transactions);
    
    return of(newTransaction).pipe(delay(300));
  }

}