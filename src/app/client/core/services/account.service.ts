import { Injectable } from '@angular/core';
import { Observable, of, throwError, switchMap, BehaviorSubject } from 'rxjs';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Account } from '../models/account.model';
import { AuthService, User } from '../../../auth/services/auth.service';
import { Apollo, gql } from 'apollo-angular';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private accountsSubject = new BehaviorSubject<Account[]>([]);
  accounts$ = this.accountsSubject.asObservable();
  constructor(private apollo: Apollo, private authService: AuthService) {}

  getAccounts(forceRefresh: boolean = false): Observable<Account[]> {
    console.log(this.accounts$);
    if (!forceRefresh && this.accountsSubject.value.length > 0) {
      return of(this.accountsSubject.value);
    }

    const GET_ACCOUNTS = gql`
      query GetAccounts($clientId: ID) {
        accounts(clientId: $clientId) {
          id
          numeroCompte
          rib
          solde
          plafond
          dateCreation
          typeCompte
          iban
          devise
          statut
          etat
          clientId
          transactions {
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
      }
    `;
    return this.apollo.query<{ accounts: Account[] }>({
      query: GET_ACCOUNTS,
      variables: { clientId: 6 },
      fetchPolicy: 'network-only'
    }).pipe(
      map(res => res.data!.accounts),
      map(accounts => {
        this.accountsSubject.next(accounts);
        return accounts;
      })
    );
  }


  getAccountById(id: number): Observable<Account> {
    const GET_ACCOUNT = gql`
      query GetAccount($id: ID!) {
        account(id: $id) {
          id
          numeroCompte
          rib
          solde
          plafond
          dateCreation
          typeCompte
          iban
          devise
          statut
          etat
          clientId
        }
      }
    `;
    return this.apollo
      .query<{ account: Account }>({ query: GET_ACCOUNT, variables: { id }, fetchPolicy: 'network-only' })
      .pipe(map(result => result.data!.account));
  }

  createAccount(account: Omit<Account, 'id'>): Observable<Account> {
    const CREATE_ACCOUNT = gql`
      mutation CreateAccount(
        $numeroCompte: String!, $rib: String, $solde: Float!, $plafond: Float,
        $dateCreation: String!, $typeCompte: String, $iban: String, $devise: String,
        $statut: String, $etat: Boolean!, $clientId: ID!
      ) {
        createAccount(
          numeroCompte: $numeroCompte,
          rib: $rib,
          solde: $solde,
          plafond: $plafond,
          dateCreation: $dateCreation,
          typeCompte: $typeCompte,
          iban: $iban,
          devise: $devise,
          statut: $statut,
          etat: $etat,
          clientId: $clientId
        ) {
          id
          numeroCompte
          rib
          solde
          plafond
          dateCreation
          typeCompte
          iban
          devise
          statut
          etat
          clientId
        }
      }
    `;
    return this.apollo
      .mutate<{ createAccount: Account }>({
        mutation: CREATE_ACCOUNT,
        variables: { ...account, dateCreation: account.dateCreation?.toISOString() }
      })
      .pipe(map(result => result.data!!.createAccount));
  }

  updateAccount(id: number, account: Partial<Account>): Observable<Account> {
    const UPDATE_ACCOUNT = gql`
      mutation UpdateAccount(
        $id: ID!, $numeroCompte: String, $rib: String, $solde: Float,
        $plafond: Float, $dateCreation: String, $typeCompte: String, $iban: String,
        $devise: String, $statut: String, $etat: Boolean, $clientId: ID
      ) {
        updateAccount(
          id: $id,
          numeroCompte: $numeroCompte,
          rib: $rib,
          solde: $solde,
          plafond: $plafond,
          dateCreation: $dateCreation,
          typeCompte: $typeCompte,
          iban: $iban,
          devise: $devise,
          statut: $statut,
          etat: $etat,
          clientId: $clientId
        ) {
          id
          numeroCompte
          rib
          solde
          plafond
          dateCreation
          typeCompte
          iban
          devise
          statut
          etat
          clientId
        }
      }
    `;
    return this.apollo
      .mutate<{ updateAccount: Account }>({
        mutation: UPDATE_ACCOUNT,
        variables: { id, ...account, dateCreation: account.dateCreation?.toISOString() }
      })
      .pipe(map(result => result.data!!.updateAccount));
  }

  deleteAccount(id: number): Observable<void> {
    const DELETE_ACCOUNT = gql`
      mutation DeleteAccount($id: ID!) {
        deleteAccount(id: $id)
      }
    `;
    return this.apollo
      .mutate({ mutation: DELETE_ACCOUNT, variables: { id } })
      .pipe(map(() => void 0));
  }

  downloadAccountStatement(accountId: number): Observable<boolean> {
    const user = this.authService.getCurrentUser();
    if (!user) return of(false);

    return this.getAccountById(accountId).pipe(
      switchMap(account => {
        const doc = new jsPDF();

        doc.setFontSize(18);
        doc.text('Relevé de compte - MOCK', 20, 20);

        autoTable(doc, {
          startY: 30,
          head: [['Champ', 'Valeur']],
          body: [    // 🔹 Si déjà chargé et pas de refresh → on renvoie le cache
            ['Titulaire', `${user.firstName} ${user.lastName}`],
            ['Email', user.email],
            ['Numéro de compte', account.numeroCompte],
            ['IBAN', account.iban],
            ['Solde', `${account.solde} ${account.devise}`],
            ['Type', account.typeCompte],
            ['Statut', account.statut]
          ]
        });

        doc.save(`mock_releve_${accountId}.pdf`);
        return of(true);
      })
    );
  }

}
