import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { BudgetCategory, Expense, BudgetAlert } from '../models/Budget.model';
import { Apollo, gql } from 'apollo-angular';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BudgetService {

  constructor(private apollo: Apollo) {}

  private categories: BudgetCategory[] = [];

  getBudgetCategories(): Observable<BudgetCategory[]> {
    const GET_BUDGETS = gql`
      query GetBudgets {
        budgets {
          id
          name
          icon
          color
          budgetLimit
          currentSpending
          clientId
        }
      }
    `;

    return this.apollo.use('analytics')
      .query<{ budgets: BudgetCategory[] }>({
        query: GET_BUDGETS,
        fetchPolicy: 'network-only'
      })
      .pipe(
        map(result => result.data!.budgets)
      );
  }



  /*getBudgetById(id: number): Observable<BudgetCategory | null> {
    const GET_BUDGET = gql`
      query GetBudget($id: ID!) {
        budget(id: $id) {
          id
          name
          icon
          color
          budgetLimit
          currentSpending
          clientId
        }
      }
    `;

    return this.apollo.use('analytics').watchQuery<{ budget?: BudgetCategory }>({
      query: GET_BUDGET,
      variables: {id}
    })
      .valueChanges
      .pipe(
        map(result => result.data?.budget ?? null)
      );
  }*/


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

  updateBudgetCategory(category: BudgetCategory): Observable<void> {
    const UPDATE_BUDGET = gql`
      mutation UpdateBudget($id: ID!, $name: String!, $icon: String, $color: String, $budgetLimit: Float!) {
        updateBudget(id: $id, name: $name, icon: $icon, color: $color, budgetLimit: $budgetLimit) {
          id
        }
      }
    `;
    return this.apollo.use('analytics')
      .mutate({ mutation: UPDATE_BUDGET, variables: category })
      .pipe(map(() => void 0));
  }

  deleteCategory(categoryId: number): Observable<void> {
    const DELETE_BUDGET = gql`
      mutation DeleteBudget($id: ID!) {
        deleteBudget(id: $id)
      }
    `;
    return this.apollo.use('analytics')
      .mutate({ mutation: DELETE_BUDGET, variables: { id: categoryId } })
      .pipe(map(() => void 0));
  }

  getBudgetAlerts(): Observable<BudgetAlert[]> {
    return of(this.alerts);
  }


  getExpenses(startDate?: Date, endDate?: Date): Observable<Expense[]> {
    const GET_EXPENSES = gql`
      query GetExpensesForDates($startDate: String, $endDate: String) {
        expenses(startDate: $startDate, endDate: $endDate) {
          id
          date
          amount
          description
          categoryId
          accountId
          isAutomatic
        }
      }
    `;
    return this.apollo.use('analytics')
      .query<{ expenses: Expense[] }>({
        query: GET_EXPENSES,
        variables: { startDate: startDate?.toISOString(), endDate: endDate?.toISOString() },
        fetchPolicy: 'network-only'
      })
      .pipe(map(result => result.data!.expenses));
  }

  addExpense(expense: Omit<Expense, 'id'>): Observable<Expense> {
    const CREATE_EXPENSE = gql`
      mutation CreateExpense(
        $date: String!, $amount: Float!, $description: String!,
        $categoryId: ID!, $accountId: ID!, $isAutomatic: Boolean!
      ) {
        createExpense(
          date: $date,
          amount: $amount,
          description: $description,
          categoryId: $categoryId,
          accountId: $accountId,
          isAutomatic: $isAutomatic
        ) {
          id
          date
          amount
          description
          categoryId
          accountId
          isAutomatic
        }
      }
    `;
    return this.apollo.use('analytics')
      .mutate<{ createExpense: Expense }>({ mutation: CREATE_EXPENSE, variables: { ...expense, date: expense.date || new Date().toISOString() } })
      .pipe(map(result => result.data!.createExpense));
  }

  updateExpense(id: number, expense: Partial<Expense>): Observable<Expense> {
    const UPDATE_EXPENSE = gql`
      mutation UpdateExpense(
        $id: ID!, $amount: Float!, $description: String!,
        $categoryId: ID!, $accountId: ID!, $isAutomatic: Boolean!
      ) {
        updateExpense(
          id: $id,
          amount: $amount,
          description: $description,
          categoryId: $categoryId,
          accountId: $accountId,
          isAutomatic: $isAutomatic
        ) {
          id
          date
          amount
          description
          categoryId
          accountId
          isAutomatic
        }
      }
    `;
    return this.apollo.use('analytics')
      .mutate<{ updateExpense: Expense }>({ mutation: UPDATE_EXPENSE, variables: { id, ...expense } })
      .pipe(map(result => result.data!.updateExpense));
  }

  deleteExpense(id: number): Observable<void> {
    const DELETE_EXPENSE = gql`
      mutation DeleteExpense($id: ID!) {
        deleteExpense(id: $id)
      }
    `;
    return this.apollo.use('analytics')
      .mutate({ mutation: DELETE_EXPENSE, variables: { id } })
      .pipe(map(() => void 0));
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

  addCategory(category: Omit<BudgetCategory, 'id' | 'currentSpending'>): Observable<BudgetCategory> {
    const CREATE_BUDGET = gql`
      mutation CreateBudget($name: String!, $icon: String, $color: String, $budgetLimit: Float!, $clientId: ID!) {
        createBudget(name: $name, icon: $icon, color: $color, budgetLimit: $budgetLimit, clientId: $clientId) {
          id
          name
          icon
          color
          budgetLimit
          currentSpending
          clientId
        }
      }
    `;
    return this.apollo.use('analytics')
      .mutate<{ createBudget: BudgetCategory }>({ mutation: CREATE_BUDGET, variables: category })
      .pipe(map(result => result.data!.createBudget));
  }

}
