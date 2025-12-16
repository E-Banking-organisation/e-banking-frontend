import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Currency } from '../models/currency.model';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  private mockCurrencies: Currency[] = [
    {
      id: '1',
      code: 'MAD',
      name: 'Moroccan Dirham',
      symbol: 'د.م.',
      exchangeRate: 1.0, // Base currency
      isActive: true,
      createdAt: new Date('2023-01-15'),
      updatedAt: new Date('2023-01-15')
    },
    {
      id: '2',
      code: 'USD',
      name: 'US Dollar',
      symbol: '$',
      exchangeRate: 0.099,
      isActive: true,
      createdAt: new Date('2023-01-15'),
      updatedAt: new Date('2023-04-10')
    },
    {
      id: '3',
      code: 'EUR',
      name: 'Euro',
      symbol: '€',
      exchangeRate: 0.091,
      isActive: true,
      createdAt: new Date('2023-01-15'),
      updatedAt: new Date('2023-04-10')
    },
    {
      id: '4',
      code: 'GBP',
      name: 'British Pound',
      symbol: '£',
      exchangeRate: 0.078,
      isActive: true,
      createdAt: new Date('2023-01-15'),
      updatedAt: new Date('2023-04-10')
    },
    {
      id: '5',
      code: 'JPY',
      name: 'Japanese Yen',
      symbol: '¥',
      exchangeRate: 14.83,
      isActive: true,
      createdAt: new Date('2023-01-15'),
      updatedAt: new Date('2023-04-10')
    },
    {
      id: '6',
      code: 'CAD',
      name: 'Canadian Dollar',
      symbol: 'C$',
      exchangeRate: 0.134,
      isActive: true,
      createdAt: new Date('2023-02-20'),
      updatedAt: new Date('2023-04-10')
    },
  ];

  constructor(private http: HttpClient) { }

  getAllCurrencies(): Observable<Currency[]> {
    // Mock implementation
    return of(this.mockCurrencies);
  }

  getCurrencyById(id: string): Observable<Currency | undefined> {
    // Mock implementation
    const currency = this.mockCurrencies.find(c => c.id === id);
    return of(currency);
  }

  createCurrency(currency: Omit<Currency, 'id' | 'createdAt' | 'updatedAt'>): Observable<Currency> {
    // Mock implementation
    const newCurrency: Currency = {
      ...currency,
      id: (this.mockCurrencies.length + 1).toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.mockCurrencies.push(newCurrency);
    return of(newCurrency);
  }

  updateCurrency(id: string, updates: Partial<Currency>): Observable<Currency | undefined> {
    // Mock implementation
    const index = this.mockCurrencies.findIndex(c => c.id === id);
    if (index !== -1) {
      this.mockCurrencies[index] = {
        ...this.mockCurrencies[index],
        ...updates,
        updatedAt: new Date()
      };
      return of(this.mockCurrencies[index]);
    }
    return of(undefined);
  }

  deleteCurrency(id: string): Observable<boolean> {
    // Mock implementation
    const initialLength = this.mockCurrencies.length;
    this.mockCurrencies = this.mockCurrencies.filter(c => c.id !== id);
    return of(initialLength > this.mockCurrencies.length);
  }
}
