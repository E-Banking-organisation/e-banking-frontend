import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CurrencyService } from '../../core/services/currency.service';
import { Currency } from '../../core/models/currency.model';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faEdit, faTrash, faPlus, faTimes, faCheck } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-currency-management',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, FaIconComponent],
  templateUrl: './currency-management.component.html',
  styleUrls: ['./currency-management.component.css']
})
export class CurrencyManagementComponent implements OnInit {
  currencies: Currency[] = [];
  isLoading: boolean = true;
  showForm: boolean = false;
  isEditing: boolean = false;
  currentCurrencyId: string | null = null;
  searchTerm: string = '';

  currencyForm: FormGroup;

  // Icons
  faEdit = faEdit;
  faTrash = faTrash;
  faPlus = faPlus;
  faTimes = faTimes;
  faCheck = faCheck;

  constructor(
    private currencyService: CurrencyService,
    private fb: FormBuilder
  ) {
    this.currencyForm = this.fb.group({
      code: ['', [Validators.required, Validators.maxLength(3)]],
      name: ['', [Validators.required, Validators.maxLength(50)]],
      symbol: ['', [Validators.required, Validators.maxLength(5)]],
      exchangeRate: ['', [Validators.required, Validators.min(0)]],
      isActive: [true]
    });
  }

  ngOnInit(): void {
    this.loadCurrencies();
  }

  loadCurrencies(): void {
    this.isLoading = true;
    this.currencyService.getAllCurrencies().subscribe(
      currencies => {
        this.currencies = currencies;
        this.isLoading = false;
      },
      error => {
        console.error('Error loading currencies:', error);
        this.isLoading = false;
      }
    );
  }

  onSubmit(): void {
    if (this.currencyForm.invalid) return;

    const formValue = this.currencyForm.value;

    if (this.isEditing && this.currentCurrencyId) {
      // Update existing currency
      this.currencyService.updateCurrency(this.currentCurrencyId, formValue).subscribe(
        updatedCurrency => {
          const index = this.currencies.findIndex(c => c.id === this.currentCurrencyId);
          if (index !== -1 && updatedCurrency) {
            this.currencies[index] = updatedCurrency;
          }
          this.resetForm();
        },
        error => console.error('Error updating currency:', error)
      );
    } else {
      // Create new currency
      this.currencyService.createCurrency(formValue).subscribe(
        newCurrency => {
          this.currencies.push(newCurrency);
          this.resetForm();
        },
        error => console.error('Error creating currency:', error)
      );
    }
  }

  editCurrency(currency: Currency): void {
    this.isEditing = true;
    this.currentCurrencyId = currency.id;
    this.showForm = true;

    this.currencyForm.patchValue({
      code: currency.code,
      name: currency.name,
      symbol: currency.symbol,
      exchangeRate: currency.exchangeRate,
      isActive: currency.isActive
    });
  }

  deleteCurrency(id: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette devise ?')) {
      this.currencyService.deleteCurrency(id).subscribe(
        success => {
          if (success) {
            this.currencies = this.currencies.filter(c => c.id !== id);
          }
        },
        error => console.error('Error deleting currency:', error)
      );
    }
  }

  toggleCurrencyStatus(currency: Currency): void {
    this.currencyService.updateCurrency(currency.id, { isActive: !currency.isActive }).subscribe(
      updatedCurrency => {
        const index = this.currencies.findIndex(c => c.id === currency.id);
        if (index !== -1 && updatedCurrency) {
          this.currencies[index] = updatedCurrency;
        }
      },
      error => console.error('Error updating currency status:', error)
    );
  }

  resetForm(): void {
    this.currencyForm.reset({ isActive: true });
    this.isEditing = false;
    this.currentCurrencyId = null;
    this.showForm = false;
  }

  toggleForm(): void {
    if (this.showForm && this.isEditing) {
      this.resetForm();
    } else {
      this.showForm = !this.showForm;
      if (!this.showForm) {
        this.resetForm();
      }
    }
  }

  getFilteredCurrencies(): Currency[] {
    if (!this.searchTerm.trim()) return this.currencies;

    const term = this.searchTerm.toLowerCase();
    return this.currencies.filter(currency =>
      currency.code.toLowerCase().includes(term) ||
      currency.name.toLowerCase().includes(term)
    );
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString();
  }
}
