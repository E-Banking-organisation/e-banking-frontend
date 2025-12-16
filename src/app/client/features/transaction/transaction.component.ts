import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSort, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';
import { Account } from '../../core/models/account.model';
import { Transaction } from '../../core/models/transaction.model';
import { TransactionService } from '../../core/services/transaction.service';
import {AuthService} from '../../../auth/services/auth.service';

@Component({
  selector: 'app-transaction',
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule],
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css']
})
export class TransactionComponent implements OnChanges {

  @Input() displayMode: 'summary' | 'detailed' = 'detailed';
  @Input() account: Account | null = null;
  @Input() accounts: Account[] | undefined;

  @Input() dateFrom = '';
  @Input() dateTo = '';
  @Input() amountMin: number | null = null;
  @Input() amountMax: number | null = null;
  @Input() transactionType = '';

  transactions: Transaction[] = [];
  latestTransactions: Transaction[] = [];
  filteredTransactions: Transaction[] = [];
  paginatedTransactions: Transaction[] = [];

  faSort = faSort;
  faSortUp = faSortUp;
  faSortDown = faSortDown;

  sortColumn = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  currentPage = 1;
  pageSize = 5;
  totalPages = 0;

  constructor(private transactionService: TransactionService, private authService: AuthService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['account']) {
      this.loadTransactions();
    }

    const user = this.authService.currentUserValue;
    if (!user || !user.id) {
      console.error('Utilisateur non connecté');
      return;
    }

    this.transactionService.getLatestTransactions(user.id).subscribe({
      next: (transactions) => {
        this.latestTransactions = transactions;
      },
      error: (err) => {
        console.error('Erreur chargement dernières transactions :', err);
      }
    });
  }


  loadTransactions(): void {
    if (this.account) {
      this.transactions = [];
      this.paginatedTransactions = [];
      this.transactionService.getTransactionsByAccountId(this.account.id)
        .subscribe(transactions => {
          this.transactions = transactions;
          this.applyFilters();
        });
    }
  }

  applyFilters(): void {
    if (!this.account) return;

    this.filteredTransactions = this.transactionService.filterTransactions(
      this.transactions,
      this.dateFrom,
      this.dateTo,
      this.amountMin ?? undefined,
      this.amountMax ?? undefined,
      this.transactionType
    );

    if (this.sortColumn) {
      this.filteredTransactions = this.transactionService.sortTransactions(
        this.filteredTransactions,
        this.sortColumn,
        this.sortDirection
      );
    }

    this.updatePagination();
  }

  resetFilters(): void {
    this.dateFrom = '';
    this.dateTo = '';
    this.transactionType = '';
    this.amountMin = null;
    this.amountMax = null;
    this.applyFilters();
  }

  sortTransactions(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.filteredTransactions = this.transactionService.sortTransactions(
      this.filteredTransactions,
      column,
      this.sortDirection
    );

    this.updatePagination();
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredTransactions.length / this.pageSize);
    if (this.totalPages === 0) {
      this.paginatedTransactions = [];
    } else {
      this.goToPage(1);
    }
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;

    this.currentPage = page;
    const start = (page - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedTransactions = this.filteredTransactions.slice(start, end);
  }

  previousPage(): void {
    this.goToPage(this.currentPage - 1);
  }

  nextPage(): void {
    this.goToPage(this.currentPage + 1);
  }

  downloadPDF(): void {
    alert('Téléchargement du relevé PDF...');
  }
}
