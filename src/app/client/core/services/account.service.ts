import { Injectable } from '@angular/core';
import { Observable, of, throwError, switchMap, BehaviorSubject } from 'rxjs';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Account } from '../models/account.model';
import { AuthService, User } from '../../../auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(private authService: AuthService) {}

  private accounts: Account[] = [
    {
      id: 1,
      accountNumber: '00123456789',
      rib: 'RIB001',
      balance: 15000,
      limit: 5000,
      dateCrea: new Date('2022-01-10'),
      type: 'COURANT',
      iban: 'MA640115190000012345678901',
      currency: 'MAD',
      statut: 'ACTIVE'
    },
    {
      id: 2,
      accountNumber: '00987654321',
      rib: 'RIB002',
      balance: 8200,
      limit: 3000,
      dateCrea: new Date('2023-05-15'),
      type: 'EPARGNE',
      iban: 'MA640115190000098765432109',
      currency: 'MAD',
      statut: 'ACTIVE'
    }
  ];

  getAccounts(): Observable<Account[]> {
    if (!this.authService.isLoggedIn()) {
      return throwError(() => new Error('Utilisateur non connecté'));
    }
    return of(this.accounts);
  }

  getAccountById(id: number): Observable<Account> {
    const account = this.accounts.find(a => a.id === id);
    if (!account) {
      return throwError(() => new Error('Compte introuvable'));
    }
    return of(account);
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
          body: [
            ['Titulaire', `${user.firstName} ${user.lastName}`],
            ['Email', user.email],
            ['Numéro de compte', account.accountNumber],
            ['IBAN', account.iban],
            ['Solde', `${account.balance} ${account.currency}`],
            ['Type', account.type],
            ['Statut', account.statut]
          ]
        });

        doc.save(`mock_releve_${accountId}.pdf`);
        return of(true);
      })
    );
  }

}
