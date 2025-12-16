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

  updateBudgetCategory(category: BudgetCategory): Observable<void> {
    const index = this.categories.findIndex(c => c.id === category.id);
    if (index !== -1) this.categories[index] = category;
    return of();
  }

  deleteCategory(categoryId: number): Observable<void> {
    this.categories = this.categories.filter(c => c.id !== categoryId);
    return of();
  }

  getExpenses(startDate?: Date, endDate?: Date): Observable<Expense[]> {
    return of(this.expenses.filter(e => {
      if (!startDate || !endDate) return true;
      return e.date >= startDate && e.date <= endDate;
    }));
  }

  checkBudgetOverages(): Observable<BudgetCategory[]> {
    const overagedCategories = this.categories.filter(category =>
      category.currentSpending > category.budgetLimit
    );
    return of(overagedCategories);
  }

  getMonthlyExpenseData(year: number): Observable<{ month: string; amount: number }[]> {
    const monthNames = [
      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];

    const monthly = monthNames.map(name => ({ month: name, amount: 0 }));

    this.expenses
      .filter(e => e.date.getFullYear() === year)
      .forEach(e => {
        const m = e.date.getMonth();
        monthly[m].amount += e.amount;
      });

    return of(monthly);
  }

}
