import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AdminService } from '../../core/services/admin.service';
import { TransactionVerificationService } from '../../core/services/transaction-verification.service';
import { AgentService } from '../../core/services/agent.service';
import { CurrencyService } from '../../core/services/currency.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  private adminService = inject(AdminService);
  private transactionService = inject(TransactionVerificationService);
  private agentService = inject(AgentService);
  private currencyService = inject(CurrencyService);

  totalAgents: number = 0;
  activeAgents: number = 0;
  pendingTransactions: number = 0;
  flaggedTransactions: number = 0;
  totalCurrencies: number = 0;

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.adminService.getAdminDashboardStats().subscribe(stats => {
      this.totalAgents = stats.totalAgents;
      this.activeAgents = stats.activeAgents;
      this.pendingTransactions = stats.pendingTransactions;
      this.flaggedTransactions = stats.flaggedTransactions;
      this.totalCurrencies = stats.totalCurrencies;
    });
  }
}
