export interface BudgetCategory {
  id: number;
  name: string;
  icon?: string;
  color: string;
  budgetLimit: number;
  currentSpending: number;
}

export interface Expense {
  id: number;
  date: Date;
  amount: number;
  description: string;
  categoryId: number;
  accountId: number;
  isAutomatic: boolean;
}

export interface BudgetAlert {
  id: number;
  categoryId: number;
  threshold: number; // pourcentage du budget
  message: string;
  isActive: boolean;
}
