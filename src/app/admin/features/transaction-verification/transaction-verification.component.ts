import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TransactionVerificationService } from '../../core/services/transaction-verification.service';
import { Transaction } from '../../core/models/transaction.model';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import {
  faCheckCircle,
  faTimesCircle,
  faEye,
  faFilter,
  faExchangeAlt,
  faFlag,
  faMoneyBillWave,
  faArrowUp,
  faArrowDown,
  faWallet,
  faMobileAlt,
  IconDefinition
} from '@fortawesome/free-solid-svg-icons';
import { faBitcoin } from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'app-transaction-verification',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, FaIconComponent],
  templateUrl: './transaction-verification.component.html',
  styleUrls: ['./transaction-verification.component.css']
})
export class TransactionVerificationComponent implements OnInit {
  private transactionService = inject(TransactionVerificationService);
  private fb = inject(FormBuilder);

  transactions: Transaction[] = [];
  filteredTransactions: Transaction[] = [];
  isLoading: boolean = true;
  showRejectForm: boolean = false;
  currentTransaction: Transaction | null = null;
  searchTerm: string = '';
  filterStatus: string = 'FLAGGED';

  rejectForm: FormGroup;

  // Icons
  faCheckCircle = faCheckCircle;
  faTimesCircle = faTimesCircle;
  faEye = faEye;
  faFilter = faFilter;
  faExchangeAlt = faExchangeAlt;
  faFlag = faFlag;
  faMoneyBillWave = faMoneyBillWave;
  faArrowUp = faArrowUp;
  faArrowDown = faArrowDown;
  faWallet = faWallet;
  faMobileAlt = faMobileAlt;
  faBitcoin = faBitcoin;

  constructor() {
    this.rejectForm = this.fb.group({
      reason: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit(): void {
    this.loadTransactions();
  }

  loadTransactions(): void {
    this.isLoading = true;
    this.transactionService.getAllTransactions().subscribe(
      transactions => {
        this.transactions = transactions;
        this.applyFilters();
        this.isLoading = false;
      },
      error => {
        console.error('Error loading transactions:', error);
        this.isLoading = false;
      }
    );
  }

  applyFilters(): void {
    let result = this.transactions;
    if (this.filterStatus !== 'ALL') {
      result = result.filter(t => t.status === this.filterStatus);
    }

    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(transaction =>
        transaction.id.toLowerCase().includes(term) ||
        transaction.transactionType.toLowerCase().includes(term) ||
        (transaction.sourceAccountNumber && transaction.sourceAccountNumber.includes(term)) ||
        (transaction.destinationAccountNumber && transaction.destinationAccountNumber.includes(term)) ||
        (transaction.description && transaction.description.toLowerCase().includes(term))
      );
    }

    this.filteredTransactions = result;
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  showTransaction(transaction: Transaction): void {
    this.currentTransaction = transaction;
    this.showRejectForm = false;
  }

  verifyTransaction(transaction: Transaction): void {
    if (confirm('Êtes-vous sûr de vouloir approuver cette transaction ?')) {
      const adminId = 'admin-123';

      this.transactionService.verifyTransaction(transaction.id, adminId).subscribe(
        verifiedTransaction => {
          if (verifiedTransaction) {
            const index = this.transactions.findIndex(t => t.id === transaction.id);
            if (index !== -1) {
              this.transactions[index] = verifiedTransaction;
              this.applyFilters();
            }
          }
          this.currentTransaction = null;
        },
        error => console.error('Error verifying transaction:', error)
      );
    }
  }

  showRejectTransactionForm(transaction: Transaction): void {
    this.currentTransaction = transaction;
    this.showRejectForm = true;
    this.rejectForm.reset();
  }

  rejectTransaction(): void {
    if (this.rejectForm.invalid || !this.currentTransaction) return;

    const adminId = 'admin-123';
    const reason = this.rejectForm.value.reason;

    this.transactionService.rejectTransaction(this.currentTransaction.id, adminId, reason).subscribe(
      rejectedTransaction => {
        if (rejectedTransaction) {
          const index = this.transactions.findIndex(t => t.id === this.currentTransaction!.id);
          if (index !== -1) {
            this.transactions[index] = rejectedTransaction;
            this.applyFilters();
          }
        }
        this.currentTransaction = null;
        this.showRejectForm = false;
      },
      error => console.error('Error rejecting transaction:', error)
    );
  }

  cancelRejectForm(): void {
    this.showRejectForm = false;
  }

  getTransactionIcon(type: string): IconDefinition {
    switch(type) {
      case 'TRANSFER':
        return this.faExchangeAlt;
      case 'DEPOSIT':
        return this.faArrowDown;
      case 'WITHDRAWAL':
        return this.faArrowUp;
      case 'PAYMENT':
        return this.faMoneyBillWave;
      case 'RECHARGE':
        return this.faMobileAlt;
      case 'CRYPTO_PURCHASE':
      case 'CRYPTO_SALE':
        return this.faBitcoin;
      default:
        return this.faWallet;
    }
  }

  getStatusClass(status: string): string {
    switch(status) {
      case 'COMPLETED':
        return 'completed';
      case 'PENDING':
        return 'pending';
      case 'FAILED':
        return 'failed';
      case 'FLAGGED':
        return 'flagged';
      case 'VERIFIED':
        return 'verified';
      default:
        return '';
    }
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleString();
  }

  formatAmount(amount: number, currency: string): string {
    return new Intl.NumberFormat('fr-MA', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  }
}
