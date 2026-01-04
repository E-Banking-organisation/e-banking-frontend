import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgFor } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faDownload, faFilter, faEye, faSort, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';
import { Account } from '../../core/models/account.model';
import { TransactionComponent } from '../transaction/transaction.component';
import { AccountService } from '../../core/services/account.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrl: './account.component.css',
  imports: [CommonModule, FormsModule, FontAwesomeModule, TransactionComponent, NgFor],
  standalone: true
})
export class AccountComponent implements OnInit {
  @Input() displayMode: 'summary' | 'detailed' = 'detailed';
  @ViewChild('transactionComp') transactionComponent!: TransactionComponent;

  faDownload = faDownload;
  faFilter = faFilter;
  faEye = faEye;
  faSort = faSort;
  faSortUp = faSortUp;
  faSortDown = faSortDown;

  accounts: Account[] = [];
  selectedAccount: Account | null = null;

  dateFrom: string = '';
  dateTo: string = '';
  transactionType: string = '';
  amountMin: number | null = null;
  amountMax: number | null = null;

  constructor(private accountService: AccountService) {}

  ngOnInit(): void {
    this.accounts = [];
    this.loadAccounts();
  }

  loadAccounts(): void {
    this.accountService.getAccounts().subscribe({
      next: (accounts) => {
        console.log('Raw API response:', accounts);
        this.accounts = accounts.filter(account => account && account.id && account.numeroCompte && account.numeroCompte !== 'N/A');
        console.log('Filtered accounts:', this.accounts);
        console.log('Number of accounts:', this.accounts.length);
        if (this.accounts.length === 0) {
          console.warn('No valid accounts found after filtering');
        }
      },
      error: (err) => {
        console.error('Error loading accounts:', err);
        this.accounts = [];
      }
    });
  }

  selectAccount(account: Account): void {
    console.log('Selected account:', account);
    this.selectedAccount = account;
    if (this.transactionComponent) {
      console.log('Transaction component exists, updating with account:', account);
      this.transactionComponent.account = account;
    } else {
      console.warn('Transaction component not yet initialized');
    }
  }

  callApplyFilters(): void {
    if (this.transactionComponent) {
      this.transactionComponent.applyFilters();
    } else {
      console.warn('Transaction component not initialized');
    }
  }

  callResetFilters(): void {
    if (this.transactionComponent) {
      this.transactionComponent.resetFilters();
    } else {
      console.warn('Transaction component not initialized');
    }
  }

  downloadPDF(): void {
    console.log('selectedAccount:', this.selectedAccount);
    if (this.selectedAccount) {
      const confirmDownload = window.confirm('Voulez-vous télécharger le relevé PDF pour ce compte ?');
      if (confirmDownload) {
        this.accountService.downloadAccountStatement(this.selectedAccount.id)
          .subscribe({
            next: (success) => {
              if (success) {
                alert('Relevé PDF téléchargé avec succès.');
              } else {
                alert('Erreur lors du téléchargement du relevé PDF.');
              }
            },
            error: (err) => {
              console.error('Error downloading PDF:', err);
              alert('Erreur lors du téléchargement du relevé PDF.');
            }
          });
      }
    } else {
      alert('Aucun compte sélectionné.');
    }
  }
}
