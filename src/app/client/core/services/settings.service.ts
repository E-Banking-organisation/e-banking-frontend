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

  private mockAccounts: Account[] = [
    { id: 1, accountNumber: '1234567890', rib: 'RIB123', balance: 1000, limit: 5000, dateCrea: new Date(), type: 'Courant', iban: 'MA123456789', currency: 'MAD', statut: 'Actif' },
    { id: 2, accountNumber: '0987654321', rib: 'RIB456', balance: 2000, limit: 5000, dateCrea: new Date(), type: 'Épargne', iban: 'MA987654321', currency: 'MAD', statut: 'Actif' }
  ];

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
