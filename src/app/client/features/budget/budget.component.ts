import {Component, OnInit, OnDestroy, ViewChild, PLATFORM_ID, Inject} from '@angular/core';
import {CommonModule, isPlatformBrowser} from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faWarning, faCheck, faPieChart } from '@fortawesome/free-solid-svg-icons';
import { BudgetService } from '../../core/services/budget.service';
import { AccountService } from '../../core/services/account.service';
import { BudgetCategory, Expense, BudgetAlert } from '../../core/models/Budget.model';
import { Account } from '../../core/models/account.model';
import { Subscription } from 'rxjs';
import { ChartData, ChartOptions, TooltipItem } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

@Component({
  selector: 'app-budget',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    FontAwesomeModule,
    BaseChartDirective,

  ],
  templateUrl: './budget.component.html',
  styleUrl: './budget.component.css'
})



export class BudgetComponent implements OnInit, OnDestroy {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  showExpenseForm = false;

  // Icônes
  faWarning = faWarning;
  faCheck = faCheck;
  faPieChart = faPieChart;

  // Données
  categories: BudgetCategory[] = [];
  expenses: Expense[] = [];
  accounts: Account[] = [];
  alerts: BudgetAlert[] = [];
  overages: BudgetCategory[] = [];

  // Nouvelle dépense
  newExpense: Omit<Expense, 'id'> = {
    date: new Date(),
    amount: 0,
    description: '',
    categoryId: 0,
    accountId: 0,
    isAutomatic: false
  };

  // Pour la Gestion d'une catégorie
  showCategoryForm = false;
  editingCategory: BudgetCategory | null = null;
  newCategory: Omit<BudgetCategory, 'id' | 'currentSpending'> = {
    name: '',
    color: '#FFB6C1',
    budgetLimit: 0
  };

// Palette de couleurs prédéfinie
  colorPalette = [
    '#FFB6C1', // Rose pastel
    '#AEC6CF', // Bleu pastel
    '#B0E57C', // Vert pastel
    '#FFD700', // Jaune doux
    '#C3B1E1', // Lavande
    '#FFCCCC', // Pêche
    '#C1E1C1', // Menthe
    '#C4A484' // Beige
  ];

  applyPastelColors(): void {
    // Applique les nouvelles couleurs aux catégories existantes
    this.categories.forEach((category, index) => {
      if (!category.color || category.color === '#4CAF50') {
        category.color = this.colorPalette[index % this.colorPalette.length];
      }
    });

    // Met à jour les catégories dans le service
    this.categories.forEach(category => {
      this.budgetService.updateBudgetCategory(category).subscribe();
    });
  }


  // Graphique avec barres
  public barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      { data: [], label: 'Dépenses' }
    ]
  };

  public barChartOptions: ChartOptions = {
    responsive: true
  };

  // Graphique circulaire
  public pieChartData: ChartData<'pie'> = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: []
      }
    ]
  };

  pieChartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 2,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          usePointStyle: true
        }
      },
      tooltip: {
        callbacks: {
          label: function(context: TooltipItem<'pie'>) {
            return `${context.label}: ${context.parsed.toFixed(2)}€`;
          }
        }
      }
    }
  };

  // Filtres
  currentMonth: number = new Date().getMonth();
  currentYear: number = new Date().getFullYear();

  private subscriptions: Subscription = new Subscription();

  isBrowser: boolean = false;

  constructor(
    private budgetService: BudgetService,
    private accountService: AccountService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    console.log('Budget component initialized');
    this.loadData();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  loadData(): void {
    console.log('Loading data...');

    const startDate = new Date(this.currentYear, this.currentMonth, 1);
    const endDate = new Date(this.currentYear, this.currentMonth + 1, 0);

    this.subscriptions.add(
      this.budgetService.getBudgetCategories().subscribe(categories => {
        this.categories = categories;
        this.applyPastelColors();
        if (categories.length > 0) {
          this.newExpense.categoryId = categories[0].id;
        }
      })
    );

    this.subscriptions.add(
      this.budgetService.getExpenses(startDate, endDate).subscribe(expenses => {
        this.expenses = expenses;
        this.updatePieChart();
      })
    );

    this.subscriptions.add(
      this.accountService.getAccounts().subscribe(accounts => {
        this.accounts = accounts;
        if (accounts.length > 0) {
          this.newExpense.accountId = accounts[0].id;
        }
      })
    );

    this.subscriptions.add(
      this.budgetService.getBudgetAlerts().subscribe(alerts => {
        this.alerts = alerts;
      })
    );

    this.subscriptions.add(
      this.budgetService.checkBudgetOverages().subscribe(overages => {
        this.overages = overages;
      })
    );

    this.subscriptions.add(
      this.budgetService.getMonthlyExpenseData(this.currentYear).subscribe(data => {
        this.updateChart(data);
      })
    );
  }

  updateChart(data: {month: string, amount: number}[]): void {
    this.barChartData = {
      labels: data.map(item => item.month),
      datasets: [
        {
          data: data.map(item => item.amount),
          label: 'Dépenses mensuelles',
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgb(54, 162, 235)'
        }
      ]
    };

    if (this.chart) {
      this.chart.update();
    }
  }

  addExpense(): void {
    if (this.newExpense.amount <= 0 || !this.newExpense.categoryId || !this.newExpense.accountId) {
      return;
    }

    this.budgetService.addExpense(this.newExpense).subscribe(expense => {
      this.expenses.push(expense);
      this.newExpense = {
        date: new Date(),
        amount: 0,
        description: '',
        categoryId: this.newExpense.categoryId,
        accountId: this.newExpense.accountId,
        isAutomatic: false
      };
      this.loadData();
    });
  }

  changeMonth(offset: number): void {
    const newDate = new Date(this.currentYear, this.currentMonth + offset, 1);
    this.currentMonth = newDate.getMonth();
    this.currentYear = newDate.getFullYear();
    this.loadData();
  }

  getProgressPercentage(category: BudgetCategory): number {
    return Math.min(100, (category.currentSpending / category.budgetLimit) * 100);
  }

  getCategoryName(categoryId: number): string {
    const category = this.categories.find(c => c.id === categoryId);
    return category ? category.name : '';
  }


// Méthodes de gestion des catégories
  addOrUpdateCategory(): void {
    if (this.editingCategory) {
      // Mode édition
      const updatedCategory: BudgetCategory = {
        ...this.editingCategory,
        name: this.newCategory.name,
        color: this.newCategory.color,
        budgetLimit: this.newCategory.budgetLimit
      };

      this.budgetService.updateBudgetCategory(updatedCategory).subscribe(() => {
        this.resetCategoryForm();
        this.loadData();
      });
    } else {
      // Mode ajout
      this.budgetService.addCategory(this.newCategory).subscribe(() => {
        this.resetCategoryForm();
        this.loadData();
      });
    }
  }

  editCategory(category: BudgetCategory): void {
    this.showCategoryForm = true;
    this.editingCategory = category;
    this.newCategory = {
      name: category.name,
      color: category.color,
      budgetLimit: category.budgetLimit
    };
  }

  deleteCategory(categoryId: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ? Toutes les dépenses associées seront également supprimées.')) {
      this.budgetService.deleteCategory(categoryId).subscribe(() => {
        this.loadData();
      });
    }
  }

  resetCategoryForm(): void {
    this.showCategoryForm = false;
    this.editingCategory = null;
    this.newCategory = {
      name: '',
      color: '#4CAF50',
      budgetLimit: 0
    };
  }

  selectColor(color: string): void {
    this.newCategory.color = color;
  }

  openCategoryModal(): void {
    this.showCategoryForm = true;
    this.editingCategory = null;
    this.newCategory = {
      name: '',
      color: this.colorPalette[0],
      budgetLimit: 0
    };
  }

  //Méthodes de gestion des dépenses
  openExpenseModal(): void {
    this.showExpenseForm = true;
  }

  resetExpenseForm(): void {
    this.showExpenseForm = false;
    this.newExpense = {
      date: new Date(),
      amount: 0,
      description: '',
      categoryId: this.categories.length > 0 ? this.categories[0].id : 0,
      accountId: this.accounts.length > 0 ? this.accounts[0].id : 0,
      isAutomatic : false
    };
  }


  // Méthode pour annuler la modale
  cancelModal(event: MouseEvent, modalType: 'category' | 'expense'): void {
    if ((event.target as HTMLElement).className === 'modal-overlay') {
      if (modalType === 'category') {
        this.resetCategoryForm();
      } else {
        this.resetExpenseForm();
      }
    }
  }


  // Méthode pour mettre à jour le graphique circulaire
  updatePieChart(): void {
    const categorySpending = this.categories.map(category => {
      const totalSpent = this.expenses
        .filter(expense => expense.categoryId === category.id)
        .reduce((sum, expense) => sum + expense.amount, 0);
      return { name: category.name, amount: totalSpent, color: category.color };
    });

    this.pieChartData = {
      labels: categorySpending.map(item => item.name),
      datasets: [{
        data: categorySpending.map(item => item.amount),
        backgroundColor: categorySpending.map(item => item.color)
      }]
    };

    if (this.chart) {
      this.chart.update();
    }
  }

}
