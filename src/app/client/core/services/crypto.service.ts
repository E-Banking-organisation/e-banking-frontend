import { Injectable } from '@angular/core';
import { Observable, of, map, catchError } from 'rxjs';
import { Apollo, gql } from 'apollo-angular';
import { CryptoWallet, CryptoTransactionDTO } from '../models/Crypto.model';
import { AuthService } from '../../../auth/services/auth.service';

// ========== GraphQL Queries & Mutations (CORRECTED to match backend schema) ==========

// Backend retourne: getMyWallet(userId) -> [WalletItem { id, userId, coinId, quantity }]
const GET_MY_WALLET = gql`
  query GetMyWallet($userId: String!) {
    getMyWallet(userId: $userId) {
      id
      userId
      coinId
      quantity
    }
  }
`;

// Backend retourne: getMarketChart(coinId, days) -> [Candle { time, close, ... }]
const GET_MARKET_CHART = gql`
  query GetChart($coinId: String!, $days: Int!) {
    getMarketChart(coinId: $coinId, days: $days) {
      time
      close
    }
  }
`;

// Backend: buyCrypto(userId, coinId, amount) -> WalletItem
const BUY_CRYPTO = gql`
  mutation Buy($userId: String!, $coinId: String!, $amount: Float!) {
    buyCrypto(userId: $userId, coinId: $coinId, amount: $amount) {
      id
      userId
      coinId
      quantity
    }
  }
`;

// Backend: sellCrypto(userId, coinId, amount) -> WalletItem
const SELL_CRYPTO = gql`
  mutation Sell($userId: String!, $coinId: String!, $amount: Float!) {
    sellCrypto(userId: $userId, coinId: $coinId, amount: $amount) {
      id
      userId
      coinId
      quantity
    }
  }
`;

// ========== Interfaces pour les réponses GraphQL ==========

export interface ChartDataPoint {
  time: number;
  price: number;
}

// Interface qui correspond au backend
export interface WalletItem {
  id: string;
  userId: string;
  coinId: string;
  quantity: number;
}

// Interface pour l'affichage frontend
export interface WalletResponse {
  id: string;
  currency: string;
  balance: number;
}

export interface BuyCryptoResponse {
  id: string;
  quantity: number;
}

export interface SellCryptoResponse {
  id: string;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CryptoService {

  constructor(
    private apollo: Apollo,
    private authService: AuthService
  ) {}

  /**
   * Récupère les portefeuilles de l'utilisateur depuis le backend MongoDB
   */
  getWallets(): Observable<WalletResponse[]> {
    const userId = this.authService.getCurrentUserId() || 'user1';
    
    const cryptoClient = this.apollo.use('crypto');
    if (!cryptoClient) {
      console.error('Apollo client "crypto" non trouvé !');
      return of([]);
    }

    return cryptoClient.query<{ getMyWallet: WalletItem[] }>({
      query: GET_MY_WALLET,
      variables: { userId },
      fetchPolicy: 'network-only'
    }).pipe(
      map(result => {
        const wallets = result?.data?.getMyWallet;
        if (!wallets || !Array.isArray(wallets)) {
          return [];
        }
        // Mapper WalletItem vers WalletResponse
        return wallets
          .filter((w): w is WalletItem => w !== null && w !== undefined)
          .map(w => ({
            id: String(w.id ?? ''),
            currency: String(w.coinId ?? ''), // coinId devient currency
            balance: Number(w.quantity ?? 0)   // quantity devient balance
          }));
      }),
      catchError(error => {
        console.error('Erreur getWallets:', error);
        return of([]);
      })
    );
  }

  /**
   * Récupère les portefeuilles formatés pour l'affichage existant
   */
  getWalletsByClient(clientId: string): Observable<CryptoWallet[]> {
    return this.getWallets().pipe(
      map(wallets => wallets.map((w, index) => ({
        id: index + 1,
        crypto: w.currency.toUpperCase(),
        solde: w.balance
      })))
    );
  }

  /**
   * Récupère les données du graphique pour une crypto donnée
   */
  getMarketChart(coinId: string, days: number): Observable<ChartDataPoint[]> {
    const cryptoClient = this.apollo.use('crypto');
    if (!cryptoClient) {
      console.error('Apollo client "crypto" non trouvé !');
      return of([]);
    }

    return cryptoClient.query<{ getMarketChart: { time: number; close: number }[] }>({
      query: GET_MARKET_CHART,
      variables: { coinId, days },
      fetchPolicy: 'network-only'
    }).pipe(
      map(result => {
        const chartData = result?.data?.getMarketChart;
        if (!chartData || !Array.isArray(chartData)) {
          return [];
        }
        return chartData
          .filter((d): d is { time: number; close: number } => d !== null && d !== undefined)
          .map(d => ({
            time: Number(d.time ?? 0),
            price: Number(d.close ?? 0)
          }));
      }),
      catchError(error => {
        console.error('Erreur getMarketChart:', error);
        return of([]);
      })
    );
  }

  /**
   * Achète de la crypto
   */
  buyCrypto(coinId: string, amount: number): Observable<BuyCryptoResponse> {
    const userId = this.authService.getCurrentUserId() || 'user1';
    
    const cryptoClient = this.apollo.use('crypto');
    if (!cryptoClient) {
      console.error('Apollo client "crypto" non trouvé !');
      throw new Error('Client Apollo non configuré');
    }

    return cryptoClient.mutate<{ buyCrypto: WalletItem }>({
      mutation: BUY_CRYPTO,
      variables: { userId, coinId, amount }
    }).pipe(
      map(result => {
        const data = result?.data?.buyCrypto;
        if (!data) {
          throw new Error('Erreur lors de l\'achat');
        }
        return { 
          id: String(data.id ?? ''), 
          quantity: Number(data.quantity ?? 0) 
        };
      }),
      catchError(error => {
        console.error('Erreur buyCrypto:', error);
        throw error;
      })
    );
  }

  /**
   * Vend de la crypto
   */
  sellCrypto(coinId: string, amount: number): Observable<SellCryptoResponse> {
    const userId = this.authService.getCurrentUserId() || 'user1';
    
    const cryptoClient = this.apollo.use('crypto');
    if (!cryptoClient) {
      console.error('Apollo client "crypto" non trouvé !');
      throw new Error('Client Apollo non configuré');
    }

    return cryptoClient.mutate<{ sellCrypto: WalletItem }>({
      mutation: SELL_CRYPTO,
      variables: { userId, coinId, amount }
    }).pipe(
      map(result => {
        const data = result?.data?.sellCrypto;
        if (!data) {
          throw new Error('Erreur lors de la vente');
        }
        return { 
          id: String(data.id ?? ''), 
          quantity: Number(data.quantity ?? 0) 
        };
      }),
      catchError(error => {
        console.error('Erreur sellCrypto:', error);
        throw error;
      })
    );
  }

  /**
   * Méthode legacy pour compatibilité avec le code existant
   */
  effectuerTransaction(transaction: CryptoTransactionDTO): Observable<CryptoTransactionDTO> {
    const coinId = transaction.crypto.toLowerCase();
    const amount = transaction.quantiteCrypto;

    if (transaction.typeOperation === 'ACHAT') {
      return this.buyCrypto(coinId, amount).pipe(
        map(() => ({
          ...transaction,
          id: Date.now(),
          date: new Date(),
          transactionHash: `tx_${Date.now()}`
        }))
      );
    }
    
    return this.sellCrypto(coinId, amount).pipe(
      map(() => ({
        ...transaction,
        id: Date.now(),
        date: new Date(),
        transactionHash: `tx_${Date.now()}`
      }))
    );
  }

  /**
   * Historique des transactions
   */
  getHistorique(clientId: string): Observable<CryptoTransactionDTO[]> {
    return of([]);
  }

  /**
   * Valeur totale des wallets
   */
  getWalletValues(clientId: number): Observable<{ total: number }> {
    return this.getWallets().pipe(
      map(wallets => ({
        total: wallets.reduce((sum, w) => sum + w.balance, 0)
      }))
    );
  }

  /**
   * Créer un wallet
   */
  createWallet(clientId: number, crypto: string): Observable<string> {
    return of(`Wallet ${crypto} sera créé lors du premier achat`);
  }
}