import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { Transaction } from '../models/transaction.model';
import {AuthService} from '../../../auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  private transactions: Transaction[] = [
    { id: 1, accountId: 1, destinationAccountId: 2, reference: 'REF001', date: new Date(), description: 'Paiement Facture', amount: 200, type: 'Débit', status: 'Confirmé', devise: 'MAD', frais: 0, destination: 'Account 2', source: 'Account 1' },
    { id: 2, accountId: 2, destinationAccountId: 1, reference: 'REF002', date: new Date(), description: 'Virement reçu', amount: 300, type: 'Crédit', status: 'Confirmé', devise: 'MAD', frais: 0, destination: 'Account 1', source: 'Account 2' }
  ];

  constructor(private authService: AuthService) {}

  getAllTransactions(): Observable<Transaction[]> {
    const user = this.authService.currentUserValue;
    if (!user) return throwError(() => new Error('Utilisateur non connecté'));
    return of(this.transactions);
  }

  getTransactionsByAccountId(accountId: number): Observable<Transaction[]> {
    return of(this.transactions.filter(t => t.accountId === accountId || t.destinationAccountId === accountId));
  }

  getLatestTransactions(clientId: string): Observable<Transaction[]> {
    return of(this.transactions.sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 5));
  }

  filterTransactions(transactions: Transaction[], dateFrom?: string, dateTo?: string, amountMin?: number, amountMax?: number, transactionType?: string): Transaction[] {
    return transactions.filter(t => {
      const tDate = new Date(t.date);
      return (!dateFrom || tDate >= new Date(dateFrom)) &&
        (!dateTo || tDate <= new Date(dateTo)) &&
        (amountMin === undefined || t.amount >= amountMin) &&
        (amountMax === undefined || t.amount <= amountMax) &&
        (!transactionType || t.type === transactionType);
    });
  }

  sortTransactions(transactions: Transaction[], column: string, direction: 'asc' | 'desc'): Transaction[] {
    const modifier = direction === 'asc' ? 1 : -1;
    return [...transactions].sort((a, b) => {
      switch (column) {
        case 'date': return modifier * (new Date(a.date).getTime() - new Date(b.date).getTime());
        case 'amount': return modifier * (a.amount - b.amount);
        case 'description': return modifier * a.description.localeCompare(b.description);
        case 'type': return modifier * a.type.localeCompare(b.type);
        default: return 0;
      }
    });
  }
}
