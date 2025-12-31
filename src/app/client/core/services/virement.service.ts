import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Account } from '../models/account.model';
import { Beneficiary } from '../models/Beneficiary.model';
import { Transaction } from '../models/transaction.model';
import { Transfer } from '../models/Transfer.model';
import { AuthService } from '../../../auth/services/auth.service';
import { AuditGraphqlService } from '../../../audit/core/services/audit-graphql.service';

@Injectable({
  providedIn: 'root'
})
export class VirementService {

  private accountsSubject = new BehaviorSubject<Account[]>([]);
  private beneficiariesSubject = new BehaviorSubject<Beneficiary[]>([]);
  private transfersSubject = new BehaviorSubject<Transaction[]>([]);

  accounts$ = this.accountsSubject.asObservable();
  beneficiaries$ = this.beneficiariesSubject.asObservable();
  transfers$ = this.transfersSubject.asObservable();

  generatedOtpCode = '123456';

  constructor(
    private authService: AuthService,
    private auditService: AuditGraphqlService
  ) {
    this.accountsSubject.next([
      { id: 1, accountNumber: '123', rib: 'RIB1', balance: 1000, limit: 5000, dateCrea: new Date(), type: 'Courant', iban: 'IBAN1', currency: 'MAD', statut: 'Actif' },
      { id: 2, accountNumber: '456', rib: 'RIB2', balance: 2000, limit: 5000, dateCrea: new Date(), type: 'Épargne', iban: 'IBAN2', currency: 'MAD', statut: 'Actif' }
    ]);

    this.beneficiariesSubject.next([
      { id: 1, name: 'Sophie Martin', accountNumber: '789', favorite: true, client_id: 1, beneficiare_id: 1 },
      { id: 2, name: 'Lucas Dubois', accountNumber: '101', favorite: false, client_id: 1, beneficiare_id: 2 }
    ]);
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

    return of(this.accountsSubject.value);
  }

  getBeneficiaries(): Beneficiary[] {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.auditService.logEvent(
        user.id,
        'VIEW_BENEFICIARIES',
        'VIREMENT_SERVICE',
        'INFO',
        `Consultation des bénéficiaires (${this.beneficiariesSubject.value.length} bénéficiaires)`
      ).subscribe();
    }

    return this.beneficiariesSubject.value;
  }

  addBeneficiary(beneficiary: Beneficiary): Observable<any> {
    this.beneficiariesSubject.next([...this.beneficiariesSubject.value, beneficiary]);

    const user = this.authService.getCurrentUser();
    if (user) {
      this.auditService.logEvent(
        user.id,
        'ADD_BENEFICIARY',
        'VIREMENT_SERVICE',
        'INFO',
        `Ajout bénéficiaire: ${beneficiary.name} (Compte: ${beneficiary.accountNumber})`
      ).subscribe();
    }

    return of(true);
  }

  updateBeneficiary(updated: Beneficiary): void {
    const beneficiaries = this.beneficiariesSubject.value.map(b => b.id === updated.id ? updated : b);
    this.beneficiariesSubject.next(beneficiaries);

    const user = this.authService.getCurrentUser();
    if (user) {
      this.auditService.logEvent(
        user.id,
        'UPDATE_BENEFICIARY',
        'VIREMENT_SERVICE',
        'INFO',
        `Modification bénéficiaire ID: ${updated.id} - ${updated.name}`
      ).subscribe();
    }
  }

  deleteBeneficiary(id: number): Observable<any> {
    const beneficiary = this.beneficiariesSubject.value.find(b => b.id === id);
    const filtered = this.beneficiariesSubject.value.filter(b => b.id !== id);
    this.beneficiariesSubject.next(filtered);

    const user = this.authService.getCurrentUser();
    if (user) {
      this.auditService.logEvent(
        user.id,
        'DELETE_BENEFICIARY',
        'VIREMENT_SERVICE',
        'WARNING',
        `Suppression bénéficiaire ID: ${id}${beneficiary ? ` - ${beneficiary.name}` : ''}`
      ).subscribe();
    }

    return of(true);
  }

  toggleFavorite(beneficiary: Beneficiary): Observable<any> {
    beneficiary.favorite = !beneficiary.favorite;
    this.updateBeneficiary(beneficiary);

    const user = this.authService.getCurrentUser();
    if (user) {
      this.auditService.logEvent(
        user.id,
        'TOGGLE_BENEFICIARY_FAVORITE',
        'VIREMENT_SERVICE',
        'INFO',
        `${beneficiary.favorite ? 'Ajout aux' : 'Retrait des'} favoris: ${beneficiary.name}`
      ).subscribe();
    }

    return of(true);
  }

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

  executeTransfer(transfer: Partial<Transfer>, otpCode: string): Observable<any> {
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

    const newTransaction: Transaction = {
      id: this.transfersSubject.value.length + 1,
      accountId: transfer.sourceAccountId!,
      destinationAccountId: transfer.beneficiaryId!,
      reference: `REF${Math.random() * 1000}`,
      date: new Date(),
      description: transfer.description || '',
      amount: transfer.amount!,
      type: 'Débit',
      status: 'Confirmé',
      devise: 'MAD',
      frais: 0,
      source: 'Compte source',
      destination: 'Compte destination'
    };

    this.transfersSubject.next([...this.transfersSubject.value, newTransaction]);

    if (user) {
      const beneficiaryName = this.getBeneficiaryName(transfer.beneficiaryId!);
      this.auditService.logEvent(
        user.id,
        'EXECUTE_TRANSFER',
        'VIREMENT_SERVICE',
        'INFO',
        `Virement exécuté: ${transfer.amount} MAD vers ${beneficiaryName} - Réf: ${newTransaction.reference}`
      ).subscribe();
    }

    return of(true);
  }

  getBeneficiaryName(id: number): string {
    const b = this.beneficiariesSubject.value.find(b => b.id === id);
    return b ? b.name : 'Inconnu';
  }
}
