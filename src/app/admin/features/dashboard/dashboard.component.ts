import { Component, OnInit } from '@angular/core';
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
  totalAgents: number = 0;
  activeAgents: number = 0;
  pendingTransactions: number = 0;
  flaggedTransactions: number = 0;
  totalCurrencies: number = 0;

  constructor(
    private adminService: AdminService,
    private transactionService: TransactionVerificationService,
    private agentService: AgentService,
    private currencyService: CurrencyService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    // In a real app, use the actual services
    this.adminService.getAdminDashboardStats().subscribe(stats => {
      this.totalAgents = stats.totalAgents;
      this.activeAgents = stats.activeAgents;
      this.pendingTransactions = stats.pendingTransactions;
      this.flaggedTransactions = stats.flaggedTransactions;
      this.totalCurrencies = stats.totalCurrencies;
    });
  }
}