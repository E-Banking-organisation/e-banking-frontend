import { Injectable } from '@angular/core';
import {forkJoin, Observable, of, switchMap} from 'rxjs';
import { map } from 'rxjs/operators';
import { Apollo, gql } from 'apollo-angular';
import { Recharge, Operator } from '../models/Recharge.model';
import { AuthService } from '../../../auth/services/auth.service';
import {AccountService} from './account.service';

@Injectable({
  providedIn: 'root'
})
export class RechargeService {

  predefinedAmounts: number[] = [5, 10, 20, 30, 50];

  constructor(
    private accountservice: AccountService,
    private authService: AuthService,
    private apollo: Apollo
  ) {}

  getOperators(): Observable<Operator[]> {
    const QUERY = gql`
      query {
        operatorsMobile {
          id
          identifiant
          name
          logo
          type
          url
          category
        }
      }
    `;
    return this.apollo.use('analytics')
      .query<{ operatorsMobile: Operator[] }>({ query: QUERY, fetchPolicy: 'network-only' })
      .pipe(map(res => res.data!.operatorsMobile));
  }

  getServices(): Observable<Operator[]> {
    const QUERY = gql`
      query {
        operatorsService {
          id
          identifiant
          name
          logo
          type
          url
          category
        }
      }
    `;
    return this.apollo.use('analytics')
      .query<{ operatorsService: Operator[] }>({ query: QUERY, fetchPolicy: 'network-only' })
      .pipe(map(res => res.data!.operatorsService));
  }

  getServiceCategories(): Observable<string[]> {
    return this.getServices().pipe(
      map(operators => Array.from(new Set(operators.map(op => op.category || 'Autre'))))
    );
  }

  getRecharges(): Observable<Recharge[]> {
    return this.accountservice.accounts$.pipe(
        map(accounts => accounts.map(a => a.id)),

        switchMap(accountIds => {
          if (accountIds.length === 0) {
            return of([]);
          }

          const queries = accountIds.map(accountId => {
            const QUERY = gql`
              query GetRecharges($accountId: ID!) {
                recharges(accountId: $accountId) {
                  id
                  operator
                  phoneNumber
                  reference
                  amount
                  date
                  account
                }
              }
            `;

            return this.apollo.use('analytics')
                .query<{ recharges: Recharge[] }>({
                  query: QUERY,
                  variables: { accountId },
                  fetchPolicy: 'network-only'
                })
                .pipe(map(res => res.data!.recharges));
          });
          return forkJoin(queries).pipe(
              map(results => results.flat())
          );
        })
    );
  }



  processMobileRecharge(operatorId: number, phoneNumber: string, amount: number, accountId: number): Observable<boolean> {
    return this.accountservice.accounts$.pipe(
      map(accounts => accounts.find(a => a.id === accountId)),
      switchMap(account => {
        if (!account || account.solde < amount) {
          return of(false);
        }

        const MUTATION = gql`
          mutation CreateRecharge($operator: ID!, $phoneNumber: String!, $amount: Float!, $account: ID!) {
            createRecharge(operator: $operator, phoneNumber: $phoneNumber, amount: $amount, account: $account) {
              id
            }
          }
        `;

        return this.apollo.use('analytics')
          .mutate({
            mutation: MUTATION,
            variables: { operator: operatorId, phoneNumber, amount, account: accountId }
          })
          .pipe(
            map(() => true)
          );
      })
    );
  }


  processServiceRecharge(operatorId: number, reference: string, amount: number, accountId: number): Observable<boolean> {
    // Reuse processMobileRecharge pour les services
    return this.processMobileRecharge(operatorId, reference, amount, accountId);
  }


    validateMobileRecharge(
        operatorId: number,
        phone: string,
        amount: number,
        accountId: number
    ): Observable<boolean> {
        return this.accountservice.accounts$.pipe(
            map(accounts => {
                const account = accounts.find(a => a.id === accountId);
                const isPhoneValid = !!phone && /^[0-9]{10}$/.test(phone);
                const isAmountValid = amount > 0;
                const isAccountValid = !!account && account.solde >= amount;
                const isOperatorValid = operatorId > 0;
                return isPhoneValid && isAmountValid && isAccountValid && isOperatorValid;
            })
        );
    }



    validateServiceRecharge(operatorId: number, reference: string, amount: number, accountId: number): Observable<boolean> {
      return this.accountservice.accounts$.pipe(
          map(accounts => {
            const account = accounts.find(a => a.id === accountId);
            const isRefValid = reference.length>0;
            const isAmountValid = amount > 0;
            const isAccountValid = !!account && account.solde >= amount;
            const isOperatorValid = operatorId > 0;
            return isRefValid && isAmountValid && isAccountValid && isOperatorValid;
          })
      );
    }
}
