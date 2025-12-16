import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { BudgetCategory, Expense, BudgetAlert } from '../models/Budget.model';

@Injectable({
  providedIn: 'root'
})
export class BudgetService {

  private categories: BudgetCategory[] = [
    {
      id: 1,
      name: 'Alimentation',
      icon: 'restaurant',
      color: '#4CAF50',
      budgetLimit: 3000,
      currentSpending: 2200
    },
    {
      id: 2,
      name: 'Transport',
      icon: 'directions_car',
      color: '#2196F3',
      budgetLimit: 1500,
      currentSpending: 900
    }
  ];

  private expenses: Expense[] = [
    {
      id: 1,
      date: new Date(),
      amount: 200,
      description: 'Supermarché',
      categoryId: 1,
      accountId: 1,
      isAutomatic: false
    },
    {
      id: 2,
      date: new Date(),
      amount: 120,
      description: 'Taxi',
      categoryId: 2,
      accountId: 1,
      isAutomatic: true
    }
  ];

  private alerts: BudgetAlert[] = [
    {
      id: 1,
      categoryId: 1,
      threshold: 80,
      message: 'Attention : budget alimentation presque atteint',
      isActive: true
    }
  ];

  getBudgetCategories(): Observable<BudgetCategory[]> {
    return of(this.categories);
  }

  getExpenses(): Observable<Expense[]> {
    return of(this.expenses);
  }

  addExpense(expense: Omit<Expense, 'id'>): Observable<Expense> {
    const newExpense: Expense = { ...expense, id: Date.now() };
    this.expenses.push(newExpense);
    return of(newExpense);
  }

  addCategory(category: Omit<BudgetCategory, 'id' | 'currentSpending'>): Observable<BudgetCategory> {
    const newCategory: BudgetCategory = {
      ...category,
      id: Date.now(),
      currentSpending: 0
    };
    this.categories.push(newCategory);
    return of(newCategory);
  }

  getBudgetAlerts(): Observable<BudgetAlert[]> {
    return of(this.alerts);
  }
}
