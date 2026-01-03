import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowUp, faArrowDown, faChartLine, faWallet, faHistory, faSpinner, faExchangeAlt } from '@fortawesome/free-solid-svg-icons';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';
import { Subject, takeUntil } from 'rxjs';

import { CryptoService, WalletResponse, ChartDataPoint } from '../../core/services/crypto.service';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-crypto',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    FontAwesomeModule,
    BaseChartDirective
  ],
  templateUrl: './crypto.component.html',
  styleUrl: './crypto.component.css'
})
export class CryptoComponent implements OnInit, OnDestroy {
  // Icons
  faArrowUp = faArrowUp;
  faArrowDown = faArrowDown;
  faChartLine = faChartLine;
  faWallet = faWallet;
  faHistory = faHistory;
  faSpinner = faSpinner;
  faExchangeAlt = faExchangeAlt;

  // State
  private destroy$ = new Subject<void>();
  activeTab: 'balance' | 'market' | 'chart' = 'chart';
  
  // Wallets
  wallets: WalletResponse[] = [];
  walletsLoading = false;

  // Chart
  selectedCrypto = 'bitcoin';
  chartDays = 7;
  chartLoading = false;
  chartData: ChartDataPoint[] = [];

  // Chart.js configuration
  lineChartType: ChartType = 'line';
  lineChartData: ChartConfiguration['data'] = {
    datasets: [{
      data: [],
      label: 'Prix (USD)',
      borderColor: '#1976d2',
      backgroundColor: 'rgba(25, 118, 210, 0.1)',
      fill: true,
      tension: 0.4,
      pointRadius: 0,
      pointHoverRadius: 6
    }],
    labels: []
  };

  lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: 'top' },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: (ctx) => {
            const value = ctx.parsed?.y;
            return value != null ? `$${value.toLocaleString()}` : '';
          }
        }
      }
    },
    scales: {
      x: { display: true, title: { display: true, text: 'Date' } },
      y: { display: true, title: { display: true, text: 'Prix (USD)' }, beginAtZero: false }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    }
  };

  // Transaction form
  amountToBuy = 0;
  amountToSell = 0;
  transactionLoading = false;
  transactionMessage = '';
  transactionSuccess = false;
  transactionType: 'buy' | 'sell' = 'buy';

  // Crypto options
  cryptoOptions = [
    { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC' },
    { id: 'ethereum', name: 'Ethereum', symbol: 'ETH' },
    { id: 'solana', name: 'Solana', symbol: 'SOL' }
  ];

  constructor(
    private cryptoService: CryptoService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadWallets();
    this.loadChart(this.selectedCrypto);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  setActiveTab(tab: 'balance' | 'market' | 'chart'): void {
    this.activeTab = tab;
    if (tab === 'balance') {
      this.loadWallets();
    }
  }

  // ========== Wallets ==========

  loadWallets(): void {
    this.walletsLoading = true;
    this.cryptoService.getWallets()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (wallets) => {
          this.wallets = wallets;
          this.walletsLoading = false;
        },
        error: (err) => {
          console.error('Erreur chargement wallets:', err);
          this.walletsLoading = false;
        }
      });
  }

  // ========== Chart ==========

  loadChart(coinId: string): void {
    this.selectedCrypto = coinId;
    this.chartLoading = true;

    this.cryptoService.getMarketChart(coinId, this.chartDays)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.chartData = data;
          this.updateChartData(data, coinId);
          this.chartLoading = false;
        },
        error: (err) => {
          console.error('Erreur chargement chart:', err);
          this.chartLoading = false;
        }
      });
  }

  private updateChartData(data: ChartDataPoint[], coinId: string): void {
    const crypto = this.cryptoOptions.find(c => c.id === coinId);
    
    this.lineChartData = {
      labels: data.map(d => new Date(d.time).toLocaleDateString('fr-FR', { 
        day: '2-digit', 
        month: 'short' 
      })),
      datasets: [{
        data: data.map(d => d.price),
        label: `${crypto?.name || coinId} (USD)`,
        borderColor: this.getCryptoColor(coinId),
        backgroundColor: this.getCryptoColor(coinId, 0.1),
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 6
      }]
    };
  }

  private getCryptoColor(coinId: string, alpha = 1): string {
    const colors: Record<string, string> = {
      bitcoin: `rgba(247, 147, 26, ${alpha})`,
      ethereum: `rgba(98, 126, 234, ${alpha})`,
      solana: `rgba(0, 255, 163, ${alpha})`
    };
    return colors[coinId] || `rgba(25, 118, 210, ${alpha})`;
  }

  changeDays(days: number): void {
    this.chartDays = days;
    this.loadChart(this.selectedCrypto);
  }

  // ========== Buy Crypto ==========

  buyCrypto(): void {
    if (this.amountToBuy <= 0) {
      this.transactionMessage = 'Veuillez entrer une quantité valide';
      this.transactionSuccess = false;
      return;
    }

    this.transactionLoading = true;
    this.transactionMessage = '';

    this.cryptoService.buyCrypto(this.selectedCrypto, this.amountToBuy)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result) => {
          const cryptoName = this.getCryptoName(this.selectedCrypto);
          this.transactionMessage = `✅ Achat réussi ! ${result.quantity} ${cryptoName} ajouté(s) à votre portefeuille.`;
          this.transactionSuccess = true;
          this.amountToBuy = 0;
          this.transactionLoading = false;
          this.loadWallets();
        },
        error: (err) => {
          console.error('Erreur achat:', err);
          this.transactionMessage = '❌ Erreur lors de l\'achat. Veuillez réessayer.';
          this.transactionSuccess = false;
          this.transactionLoading = false;
        }
      });
  }

  // ========== Sell Crypto ==========

  sellCrypto(): void {
    if (this.amountToSell <= 0) {
      this.transactionMessage = 'Veuillez entrer une quantité valide';
      this.transactionSuccess = false;
      return;
    }

    // Vérifier le solde disponible
    const wallet = this.wallets.find(w => w.currency.toLowerCase() === this.selectedCrypto.toLowerCase());
    if (!wallet || wallet.balance < this.amountToSell) {
      this.transactionMessage = '❌ Solde insuffisant pour cette vente.';
      this.transactionSuccess = false;
      return;
    }

    this.transactionLoading = true;
    this.transactionMessage = '';

    this.cryptoService.sellCrypto(this.selectedCrypto, this.amountToSell)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result) => {
          const cryptoName = this.getCryptoName(this.selectedCrypto);
          this.transactionMessage = `✅ Vente réussie ! ${result.quantity} ${cryptoName} vendu(s).`;
          this.transactionSuccess = true;
          this.amountToSell = 0;
          this.transactionLoading = false;
          this.loadWallets();
        },
        error: (err) => {
          console.error('Erreur vente:', err);
          this.transactionMessage = '❌ Erreur lors de la vente. Veuillez réessayer.';
          this.transactionSuccess = false;
          this.transactionLoading = false;
        }
      });
  }

  // ========== Helpers ==========

  getCryptoSymbol(currency: string): string {
    const crypto = this.cryptoOptions.find(c => c.id === currency.toLowerCase());
    return crypto?.symbol || currency.toUpperCase();
  }

  getCryptoName(currency: string): string {
    const crypto = this.cryptoOptions.find(c => c.id === currency.toLowerCase());
    return crypto?.name || currency;
  }

  getWalletBalance(coinId: string): number {
    const wallet = this.wallets.find(w => w.currency.toLowerCase() === coinId.toLowerCase());
    return wallet?.balance ?? 0;
  }

  setTransactionType(type: 'buy' | 'sell'): void {
    this.transactionType = type;
    this.transactionMessage = '';
  }
}