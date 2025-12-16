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

  getTransactionsByAgentId(agentId: string): Observable<AgentTransaction[]> {
    const filteredTransactions = this.transactions.filter(t => t.agentId === agentId);
    return of(filteredTransactions).pipe(delay(300));
  }

  getTransactionsByClientId(clientId: string): Observable<AgentTransaction[]> {
    const filteredTransactions = this.transactions.filter(t => t.clientId === clientId);
    return of(filteredTransactions).pipe(delay(300));
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

  updateTransactionStatus(id: string, status: 'pending' | 'completed' | 'failed'): Observable<AgentTransaction | undefined> {
    let updatedTransaction: AgentTransaction | undefined;
    
    this.transactions = this.transactions.map(t => {
      if (t.id === id) {
        updatedTransaction = { ...t, status: status };
        return updatedTransaction;
      }
      return t;
    });
    
    this.transactionsSubject.next(this.transactions);
    return of(updatedTransaction).pipe(delay(300));
  }
}