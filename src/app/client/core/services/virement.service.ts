import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Account } from '../models/account.model';
import { Beneficiary } from '../models/Beneficiary.model';
import { Transaction } from '../models/transaction.model';
import { Transfer } from '../models/Transfer.model';
import {AuthService} from '../../../auth/services/auth.service';

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

  constructor(private authService: AuthService) {
    // mock data initial
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
    return of(this.accountsSubject.value);
  }

  getBeneficiaries(): Beneficiary[] {
    return this.beneficiariesSubject.value;
  }

  addBeneficiary(beneficiary: Beneficiary): Observable<any> {
    this.beneficiariesSubject.next([...this.beneficiariesSubject.value, beneficiary]);
    return of(true);
  }

  updateBeneficiary(updated: Beneficiary): void {
    const beneficiaries = this.beneficiariesSubject.value.map(b => b.id === updated.id ? updated : b);
    this.beneficiariesSubject.next(beneficiaries);
  }

  deleteBeneficiary(id: number): Observable<any> {
    const filtered = this.beneficiariesSubject.value.filter(b => b.id !== id);
    this.beneficiariesSubject.next(filtered);
    return of(true);
  }

  toggleFavorite(beneficiary: Beneficiary): Observable<any> {
    beneficiary.favorite = !beneficiary.favorite;
    this.updateBeneficiary(beneficiary);
    return of(true);
  }

  getTransfers(): Transaction[] {
    return this.transfersSubject.value;
  }

  executeTransfer(transfer: Partial<Transfer>, otpCode: string): Observable<any> {
    if (otpCode !== this.generatedOtpCode) return of(false);

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
    return of(true);
  }

  getBeneficiaryName(id: number): string {
    const b = this.beneficiariesSubject.value.find(b => b.id === id);
    return b ? b.name : 'Inconnu';
  }

}
