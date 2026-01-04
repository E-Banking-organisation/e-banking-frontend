import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { Client } from '../models/Client.model';
import { Account } from '../models/account.model';
import {AuthService} from '../../../auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  private mockClient: Client = {
    id: '1',
    CIN: 'AB123456',
    firstName: 'Nada',
    lastName: 'Maliki',
    email: 'nada@example.com',
    phone: '0600000000',
    dateCreated: new Date('2022-01-01'),
    address: 'Rabat, Maroc',
    birthday: new Date('2000-01-01'),
    password: '',
    role: 'client',
    profession: 'Étudiante',
    Accounts: [],
    twoFactorEnabled: false
  };

  private mockAccounts: Account[] = [{
    id: 1,
    numeroCompte: '123',
    rib: 'RIB1',
    solde: 1000,
    plafond: 5000,
    dateCreation: new Date(),
    typeCompte: 'Courant',
    iban: 'IBAN1',
    devise: 'MAD',
    statut: 'Actif',
    etat: false,
    clientId: 0,
    transactions: []
  },
    {
      id: 2,
      numeroCompte: '456',
      rib: 'RIB2',
      solde: 2000,
      plafond: 5000,
      dateCreation: new Date(),
      typeCompte: 'Épargne',
      iban: 'IBAN2',
      devise: 'MAD',
      statut: 'Actif',
      etat: false,
      clientId: 0,
      transactions: []
    }];

  constructor(private authService: AuthService) {}

  getClientData(): Observable<Client> {
    const user = this.authService.currentUserValue;
    if (!user) return throwError(() => new Error('Utilisateur non connecté'));
    this.mockClient.Accounts = this.mockAccounts;
    return of(this.mockClient);
  }

  getClientAccounts(clientId: number): Observable<Account[]> {
    return of(this.mockAccounts);
  }

  updateTwoFactor(clientId: number, enabled: boolean): Observable<{ message: string }> {
    this.mockClient.twoFactorEnabled = enabled;
    return of({ message: `TwoFactorEnabled mis à jour: ${enabled}` });
  }
}
