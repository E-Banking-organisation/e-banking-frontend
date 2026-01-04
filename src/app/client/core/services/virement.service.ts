import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, map, switchMap } from 'rxjs/operators';
import { Apollo, gql } from 'apollo-angular';

import { Account } from '../models/account.model';
import { Beneficiary } from '../models/Beneficiary.model';
import { Transaction } from '../models/transaction.model';
import { Transfer } from '../models/Transfer.model';
import { AuthService } from '../../../auth/services/auth.service';
import { AuditGraphqlService } from '../../../audit/core/services/audit-graphql.service';
import { AccountService } from './account.service';

@Injectable({
  providedIn: 'root'
})
export class VirementService {

  accounts$!: Observable<Account[]>;

  private beneficiariesSubject = new BehaviorSubject<Beneficiary[]>([]);
  private transfersSubject = new BehaviorSubject<Transaction[]>([]);

  beneficiaries$ = this.beneficiariesSubject.asObservable();
  transfers$ = this.transfersSubject.asObservable();

  generatedOtpCode = '123456';

  constructor(
    private authService: AuthService,
    private auditService: AuditGraphqlService,
    private accountService: AccountService,
    private apollo: Apollo
  ) {
    this.accounts$ = this.accountService.accounts$;

    // Mock beneficiaries (on laisse comme tu as dit)
    this.beneficiariesSubject.next([
      { id: 1, name: 'Sophie Martin', accountNumber: '789', favorite: true, client_id: 1, beneficiare_id: 1 },
      { id: 2, name: 'Lucas Dubois', accountNumber: '101', favorite: false, client_id: 1, beneficiare_id: 2 }
    ]);
  }

  loadAccounts(): void {
    this.accountService.getAccounts().subscribe();
  }

  getAccounts(): Observable<Account[]> {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.auditService.logEvent(
        user.id,
        'VIEW_TRANSFER_ACCOUNTS',
        'VIREMENT_SERVICE',
        'INFO',
        'Consultation des comptes pour virement'
      ).subscribe();
    }
    return this.accounts$;
  }

  // ✅ NOUVEAU: charger les transactions d’un compte via GraphQL
  loadTransfersByAccount(accountId: number): Observable<Transaction[]> {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.auditService.logEvent(
        user.id,
        'VIEW_ACCOUNT_TRANSACTIONS',
        'VIREMENT_SERVICE',
        'INFO',
        `Consultation transactions du compte ${accountId}`
      ).subscribe();
    }

    const GET_TX_BY_ACCOUNT = gql`
      query GetTxByAccount($accountId: ID!) {
        transactionsByAccount(accountId: $accountId) {
          id
          accountId
          destinationAccountId
          reference
          date
          description
          amount
          type
          status
          devise
          frais
          source
          destination
        }
      }
    `;

    return this.apollo.use('analytics').query<{ transactionsByAccount: Transaction[] }>({
      query: GET_TX_BY_ACCOUNT,
      variables: { accountId: accountId },
      fetchPolicy: 'network-only'
    }).pipe(
      map(res => res.data?.transactionsByAccount ?? []),
      tap(list => this.transfersSubject.next(list))
    );

  }

  // ✅ ton écran historique peut continuer à appeler ça (mais maintenant c’est alimenté par loadTransfersByAccount)
  getTransfers(): Transaction[] {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.auditService.logEvent(
        user.id,
        'VIEW_TRANSFER_HISTORY',
        'VIREMENT_SERVICE',
        'INFO',
        `Consultation historique virements (${this.transfersSubject.value.length} virements)`
      ).subscribe();
    }
    return this.transfersSubject.value;
  }

  loadAllTransfersForAllAccounts(): Observable<Transaction[]> {
    return this.accountService.getAccounts(true).pipe(
      map(accounts =>
        accounts.flatMap(acc => acc.transactions ?? [])
      ),

      map(transactions => {
        const mapById = new Map<number, Transaction>();
        transactions.forEach(tx => mapById.set(tx.id, tx));
        return Array.from(mapById.values());
      }),

      map(transactions =>
        transactions.sort(
          (a, b) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
        )
      ),

      tap(transactions => {
        this.transfersSubject.next(transactions);

        const user = this.authService.getCurrentUser();
        if (user) {
          this.auditService.logEvent(
            user.id,
            'VIEW_ALL_TRANSFERS',
            'VIREMENT_SERVICE',
            'INFO',
            `Chargement historique global (${transactions.length} transactions)`
          ).subscribe();
        }
      })
    );
  }


  // ✅ MODIF: executeTransfer -> mutation GraphQL au lieu d’un mock
  executeTransfer(transfer: Partial<Transfer>, otpCode: string): Observable<boolean> {
    const user = this.authService.getCurrentUser();

    if (otpCode !== this.generatedOtpCode) {
      if (user) {
        this.auditService.logEvent(
          user.id,
          'TRANSFER_OTP_FAILED',
          'VIREMENT_SERVICE',
          'WARNING',
          `Code OTP invalide pour virement de ${transfer.amount} MAD`
        ).subscribe();
      }
      return of(false);
    }

    const CREATE_TX = gql`
      mutation CreateTransaction(
        $accountId: ID!
        $destinationAccountId: ID
        $reference: String!
        $date: String
        $description: String
        $amount: Float!
        $type: String!
        $status: String!
        $devise: String!
        $frais: Float
        $source: String
        $destination: String
      ) {
        createTransaction(
          accountId: $accountId
          destinationAccountId: $destinationAccountId
          reference: $reference
          date: $date
          description: $description
          amount: $amount
          type: $type
          status: $status
          devise: $devise
          frais: $frais
          source: $source
          destination: $destination
        )
      }
    `;

    const variables = {
      accountId: String(transfer.sourceAccountId),
      destinationAccountId: transfer.beneficiaryId ? String(transfer.beneficiaryId) : null,
      reference: `REF${Math.floor(Math.random() * 100000)}`,
      date: new Date().toISOString(),
      description: transfer.description || '',
      amount: Number(transfer.amount ?? 0),
      type: 'Débit',      // à adapter si ton backend attend autre chose
      status: 'Confirmé', // idem
      devise: 'MAD',
      frais: 0,
      source: 'Compte source',
      destination: 'Compte destination'
    };

    return this.apollo.use('analytics').mutate<{ createTransaction: string }>({
      mutation: CREATE_TX,
      variables
    }).pipe(
      switchMap(() => {
        // refresh liste après création
        const accId = transfer.sourceAccountId!;
        return this.loadTransfersByAccount(accId);
      }),
      tap(() => {
        if (user) {
          const beneficiaryName = this.getBeneficiaryName(transfer.beneficiaryId!);
          this.auditService.logEvent(
            user.id,
            'EXECUTE_TRANSFER',
            'VIREMENT_SERVICE',
            'INFO',
            `Virement exécuté: ${transfer.amount} MAD vers ${beneficiaryName}`
          ).subscribe();
        }
      }),
      map(() => true)
    );
  }

  // --- Beneficiaries: on ne touche pas ---
  getBeneficiaries(): Beneficiary[] { return this.beneficiariesSubject.value; }
  addBeneficiary(b: Beneficiary): Observable<any> { this.beneficiariesSubject.next([...this.beneficiariesSubject.value, b]); return of(true); }
  updateBeneficiary(updated: Beneficiary): void { this.beneficiariesSubject.next(this.beneficiariesSubject.value.map(x => x.id === updated.id ? updated : x)); }
  deleteBeneficiary(id: number): Observable<any> { this.beneficiariesSubject.next(this.beneficiariesSubject.value.filter(b => b.id !== id)); return of(true); }
  toggleFavorite(b: Beneficiary): Observable<any> { b.favorite = !b.favorite; this.updateBeneficiary(b); return of(true); }

  getBeneficiaryName(id: number): string {
    const b = this.beneficiariesSubject.value.find(x => x.id === id);
    return b ? b.name : 'Inconnu';
  }
}
