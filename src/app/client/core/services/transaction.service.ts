import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Transaction } from '../models/transaction.model';
import { AuthService } from '../../../auth/services/auth.service';
import { AuditGraphqlService } from '../../../audit/core/services/audit-graphql.service';
import { AccountService } from './account.service';
import { Account } from '../models/account.model';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  private transactions: Transaction[] = [];

  constructor(
    private authService: AuthService,
    private auditService: AuditGraphqlService,
    private accountService: AccountService
  ) {
    this.buildGlobalTransactions();
  }

  private buildGlobalTransactions(): void {
    this.accountService.accounts$.subscribe(accounts => {

      const transactionMap = new Map<number, Transaction>();

      accounts.forEach(account => {
        account.transactions?.forEach(tx => {
          if (!transactionMap.has(tx.id)) {
            transactionMap.set(tx.id, tx);
          }
        });
      });

      this.transactions = Array.from(transactionMap.values())
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    });
  }


  gettransactions(): Observable<Transaction[]> {
    const user = this.authService.currentUserValue;
    if (!user) {
      return throwError(() => new Error('Utilisateur non connecté'));
    }

    this.logAudit(
      6,
      'VIEW_ALL_TRANSACTIONS',
      'Consultation de toutes les transactions'
    );

    return of(this.transactions);
  }

  getTransactionsByAccountId(accountId: number): Observable<Transaction[]> {
    const user = this.authService.currentUserValue;

    if (user) {
      this.logAudit(
        6,
        'VIEW_ACCOUNT_TRANSACTIONS',
        `Consultation transactions compte ${accountId}`
      );
    }

    return of(
      this.transactions.filter(
        tx =>
          tx.accountId === accountId ||
          tx.destinationAccountId === accountId
      )
    );
  }

  getLatestTransactions(): Observable<Transaction[]> {
    return of(this.transactions.slice(0, 5));
  }

  filterTransactions(
    transactions: Transaction[],
    dateFrom?: string,
    dateTo?: string,
    amountMin?: number,
    amountMax?: number,
    transactionType?: string
  ): Transaction[] {
    return transactions.filter(tx => {
      const d = new Date(tx.date);
      return (!dateFrom || d >= new Date(dateFrom)) &&
        (!dateTo || d <= new Date(dateTo)) &&
        (amountMin == null || tx.amount >= amountMin) &&
        (amountMax == null || tx.amount <= amountMax) &&
        (!transactionType || tx.type === transactionType);
    });
  }

  sortTransactions(
    transactions: Transaction[],
    column: string,
    direction: 'asc' | 'desc'
  ): Transaction[] {
    const factor = direction === 'asc' ? 1 : -1;

    return [...transactions].sort((a, b) => {
      switch (column) {
        case 'date':
          return factor * (a.date.getTime() - b.date.getTime());
        case 'amount':
          return factor * (a.amount - b.amount);
        case 'type':
          return factor * a.type.localeCompare(b.type);
        default:
          return 0;
      }
    });
  }
  private logAudit(userId: number, action: string, message: string): void {
    this.auditService.logEvent(
      userId.toString(),
      action,
      'TRANSACTION_SERVICE',
      'INFO',
      message
    ).subscribe();
  }
}
