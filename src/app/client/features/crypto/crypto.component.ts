import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { CryptoService } from '../../core/services/crypto.service';
import { AccountService } from '../../core/services/account.service';
import { CryptoTransactionDTO, CryptoWallet, TypeCryptoOperation } from '../../core/models/Crypto.model';
import { Account } from '../../core/models/account.model';
import {AuthService} from '../../../auth/services/auth.service';

@Component({
  selector: 'app-crypto',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    FontAwesomeModule
  ],
  templateUrl: './crypto.component.html',
  styleUrl: './crypto.component.css'
})
export class CryptoComponent implements OnInit {
  // Icons
  faArrowUp = faArrowUp;
  faArrowDown = faArrowDown;

  // Data
  clientId: string | null = null;
  accounts: Account[] = [];
  wallets: CryptoWallet[] = [];
  transactions: CryptoTransactionDTO[] = [];
  activeTab: string = 'balance';
  selectedCrypto = '';
  transactionAmount = 0;
  transactionType: TypeCryptoOperation = 'ACHAT';
  selectedAccountId: number | null = null;
  timeframe: '24h' | '7d' | '30d' = '24h';

  constructor(
    private cryptoService: CryptoService,
    private accountService: AccountService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Récupérer l'utilisateur connecté
    const user = this.authService.currentUserValue;
    if (user && user.id) {
      this.clientId = user.id;
      this.loadAccounts();
      this.loadWallets();
      this.loadTransactions();
    } else {
      console.error('Utilisateur non connecté ou clientId manquant');
    }
  }

  loadAccounts(): void {
    if (this.clientId) {
      this.accountService.getAccounts().subscribe({
        next: (accounts) => {
          console.log('Comptes chargés:', accounts);
          this.accounts = accounts;
          // Sélectionner le premier compte par défaut, si disponible
          if (accounts.length > 0) {
            this.selectedAccountId = accounts[0].id;
          }
        },
        error: (error) => {
          console.error('Erreur lors du chargement des comptes:', error);
        }
      });
    }
  }

  loadWallets(): void {
    if (this.clientId) {
      this.cryptoService.getWalletsByClient(this.clientId).subscribe({
        next: (data) => {
          console.log('Wallets chargés:', data);
          this.wallets = data;
        },
        error: (error) => {
          console.error('Erreur lors du chargement des wallets:', error);
        }
      });
    }
  }

  loadTransactions(): void {
    if (this.clientId) {
      this.cryptoService.getHistorique(String(this.clientId)).subscribe({
        next: (data) => {
          console.log('Transactions chargées:', data);
          this.transactions = data;
        },
        error: (error) => {
          console.error('Erreur lors du chargement des transactions:', error);
        }
      });
    }
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  setTypeOperation(type: TypeCryptoOperation): void {
    this.transactionType = type;
  }

  changeTimeframe(newTimeframe: '24h' | '7d' | '30d'): void {
    this.timeframe = newTimeframe;
  }

  selectCrypto(crypto: string): void {
    this.selectedCrypto = crypto;
  }

  getCryptoById(cryptoId: number): any {
    // Implémentez la logique pour récupérer les détails d'une crypto
    return {
      name: 'Bitcoin',
      symbol: 'BTC',
      logo: 'path/to/logo'
    };
  }

  getCryptoBalance(cryptoId: number): number {
    const wallet = this.wallets.find(w => w.crypto === cryptoId.toString());
    return wallet ? wallet.solde : 0;
  }

  executeTransaction(): void {
    if (!this.selectedCrypto || this.transactionAmount <= 0 || !this.clientId || !this.selectedAccountId) return;

    const transaction: CryptoTransactionDTO = {
      clientId: String(this.clientId),
      typeOperation: this.transactionType,
      crypto: this.selectedCrypto,
      montantDevise: 0,
      quantiteCrypto: this.transactionAmount,
      prixUnitaire: 0,
      date: new Date(),
      transactionHash: '',
      compteId: this.selectedAccountId
    };

    this.cryptoService.effectuerTransaction(transaction).subscribe({
      next: (result) => {
        console.log('Transaction réussie:', result);
        this.transactionAmount = 0;
        this.loadWallets();
        this.loadTransactions();
      },
      error: (error) => {
        console.error('Échec de la transaction:', error);
      }
    });
  }

  toNumber(value: string | number): number {
    return Number(value);
  }
}
