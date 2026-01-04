import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { Recharge, Operator } from '../models/Recharge.model';
import {AccountService} from './account.service';
import {AuthService} from '../../../auth/services/auth.service';


@Injectable({
  providedIn: 'root'
})
export class RechargeService {

  private operators: Operator[] = [
    { id: 1, name: 'Orange', logo: '', type: 'mobile', category: 'telecom', url: '' },
    { id: 2, name: 'Inwi', logo: '', type: 'mobile', category: 'telecom', url: '' }
  ];

  private recharges: Recharge[] = [];

  predefinedAmounts: number[] = [5, 10, 20, 30, 50];

  constructor(private accountService: AccountService, private authService: AuthService) {}

  getOperators(): Observable<Operator[]> {
    return of(this.operators);
  }

  getRecharges(): Observable<Recharge[]> {
    return of(this.recharges);
  }

  processMobileRecharge(operatorId: number, phoneNumber: string, amount: number, accountId: number): Observable<boolean> {
    // @ts-ignore
    const account = this.accountService['accounts'].find(a => a.id === accountId);
    if (!account || account.solde < amount) return of(false);

    account.solde -= amount;
    this.recharges.push({
      id: this.recharges.length + 1,
      date: new Date(),
      operatorId,
      phoneNumber,
      accountId,
      amount,
      status: 'Confirmé'
    } as Recharge);

    return of(true);
  }

  processServiceRecharge(operatorId: number, reference: string, amount: number, accountId: number): Observable<boolean> {
    return this.processMobileRecharge(operatorId, reference, amount, accountId);
  }

  getServices(): Observable<Operator[]> {
    return this.getOperators();
  }

  getServiceCategories(): Observable<string[]> {
    return of(['telecom', 'eau', 'électricité']);
  }

  validateMobileRecharge(operatorId: number, phone: string, amount: number, accountId: number): Observable<boolean> {
    // @ts-ignore
    const account = this.accountService['accounts'].find(a => a.id === accountId);

    const isValid = !!(account &&
      account.solde >= amount &&
      phone &&
      phone.length > 0 &&
      amount > 0);

    return of(isValid);
  }

  validateServiceRecharge(operatorId: number, reference: string, amount: number, accountId: number): Observable<boolean> {
    return this.processServiceRecharge(operatorId, reference, amount, accountId);
  }

}
