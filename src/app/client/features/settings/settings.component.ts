import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Client } from '../../core/models/Client.model';
import { SettingsService } from '../../core/services/settings.service';
import { AuthService } from '../../../auth/services/auth.service';
import { FormsModule } from '@angular/forms';
import { DatePipe, NgIf, CommonModule } from '@angular/common';
import { Account } from '../../core/models/account.model';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  imports: [FormsModule, DatePipe, NgIf, CommonModule],
  styleUrls: ['./settings.component.css'],
  standalone: true
})


export class SettingsComponent implements OnInit {
  client: Client | null = null;
  comptes: Account[] = [];
  loadingError: string = '';
  passwordLoading: boolean = false;
  passwordMessage: string = '';
  passwordSuccess: boolean = false;
  twoFactorEnabled: boolean = false;
  twoFactorLoading: boolean = false;
  twoFactorMessage: string = '';
  twoFactorSuccess: boolean = false;

  constructor(
    private clientService: SettingsService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
    console.log('Component initialized, twoFactorLoading:', this.twoFactorLoading);
    console.log('FormsModule imported:', !!FormsModule);
    this.loadClientData();
  }

  private loadClientData(): void {
    this.clientService.getClientData().subscribe({
      next: (client) => {
        this.client = client;
        if (!client || !client.email || !client.id) {
          this.loadingError = 'Erreur: Données client incomplètes (email ou ID manquant)';
          console.error('Client data incomplete:', client);
          return;
        }
        this.twoFactorEnabled = client.twoFactorEnabled || false;
        console.log('Client loaded, twoFactorEnabled initial value:', this.twoFactorEnabled);
        console.log('twoFactorLoading after client load:', this.twoFactorLoading);
        this.clientService.getClientAccounts(parseInt(client.id)).subscribe({
          next: (comptes) => {
            this.comptes = comptes || [];
          },
          error: (err) => {
            console.error('Failed to load accounts:', err);
            this.loadingError = 'Erreur lors du chargement des comptes: ' + (err.message || err.statusText || 'Erreur inconnue');
          }
        });
      },
      error: (err) => {
        console.error('Failed to load client data:', err);
        this.loadingError = 'Erreur lors du chargement des données client: ' + (err.message || err.statusText || 'Erreur inconnue');
      }
    });
  }

  requestPasswordReset(): void {
    if (!this.client || !this.client.email) {
      this.passwordMessage = 'Erreur: Données client ou email non disponibles';
      this.passwordSuccess = false;
      return;
    }
    this.passwordLoading = true;
    this.passwordMessage = '';
    this.authService.forgotPassword(this.client.email).subscribe({
      next: (response) => {
        this.passwordMessage = response.message || 'Un lien de réinitialisation a été envoyé à votre email. Veuillez cliquer sur le lien pour modifier votre mot de passe.';
        this.passwordSuccess = true;
        this.passwordLoading = false;
      },
      error: (err) => {
        console.error('Password reset request error:', err);
        this.passwordMessage = err.message || 'Échec de l\'envoi du lien de réinitialisation. Veuillez réessayer.';
        this.passwordSuccess = false;
        this.passwordLoading = false;
      }
    });
  }

  toggleTwoFactor(newValue: boolean): void {
    console.log('toggleTwoFactor called, twoFactorEnabled before:', this.twoFactorEnabled);
    console.log('New value from click:', newValue);
    console.log('twoFactorLoading before request:', this.twoFactorLoading);
    this.twoFactorEnabled = newValue; // Mettre à jour manuellement pour tester
    console.log('twoFactorEnabled after set:', this.twoFactorEnabled);
    if (!this.client || !this.client.id) {
      this.twoFactorMessage = 'Erreur: Données client non disponibles';
      this.twoFactorSuccess = false;
      console.error('Client or client.id missing:', this.client);
      this.cdr.detectChanges();
      return;
    }
    const clientId = parseInt(this.client.id, 10);
    if (isNaN(clientId)) {
      this.twoFactorMessage = 'Erreur: ID client invalide';
      this.twoFactorSuccess = false;
      console.error('Invalid client ID:', this.client.id);
      this.cdr.detectChanges();
      return;
    }
    this.twoFactorLoading = true;
    this.twoFactorMessage = '';
    const newTwoFactorState = this.twoFactorEnabled;
    console.log('Sending updateTwoFactor request, clientId:', clientId, 'enabled:', newTwoFactorState);
    this.clientService.updateTwoFactor(clientId, newTwoFactorState).subscribe({
      next: (response) => {
        console.log('2FA update success:', response);
        this.twoFactorMessage = response.message || `2FA ${newTwoFactorState ? 'activée' : 'désactivée'} avec succès.`;
        this.twoFactorSuccess = true;
        this.twoFactorLoading = false;
        console.log('twoFactorEnabled after success:', this.twoFactorEnabled);
        console.log('twoFactorLoading after success:', this.twoFactorLoading);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('2FA toggle error:', err);
        this.twoFactorMessage = err.message || 'Échec de la mise à jour de la 2FA. Veuillez réessayer.';
        this.twoFactorSuccess = false;
        this.twoFactorLoading = false;
        console.log('twoFactorEnabled after error:', this.twoFactorEnabled);
        console.log('twoFactorLoading after error:', this.twoFactorLoading);
        this.cdr.detectChanges();
      }
    });
  }

  onRadioClick(value: boolean): void {
    console.log('Radio button clicked, value:', value);
    this.toggleTwoFactor(value); // Appeler toggleTwoFactor directement au clic
  }

}
