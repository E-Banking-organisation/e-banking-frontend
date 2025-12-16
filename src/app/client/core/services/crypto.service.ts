import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CryptoWallet, CryptoTransactionDTO, TypeCryptoOperation } from '../models/Crypto.model';
import {AuthService} from '../../../auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class CryptoService {

  private wallets: CryptoWallet[] = [
    { id: 1, crypto: 'BTC', solde: 0.5 },
    { id: 2, crypto: 'ETH', solde: 2 }
  ];

  private transactions: CryptoTransactionDTO[] = [
    {
      id: 1,
      clientId: '1',
      typeOperation: 'ACHAT',
      crypto: 'BTC',
      montantDevise: 15000,
      quantiteCrypto: 0.5,
      prixUnitaire: 30000,
      date: new Date(),
      transactionHash: 'hash1',
      compteId: 1
    }
  ];

  constructor(private authService: AuthService) {}

  getWalletsByClient(clientId: string): Observable<CryptoWallet[]> {
    return of(this.wallets);
  }

  getHistorique(clientId: string): Observable<CryptoTransactionDTO[]> {
    return of(this.transactions);
  }

  effectuerTransaction(transaction: CryptoTransactionDTO): Observable<CryptoTransactionDTO> {
    transaction.id = this.transactions.length + 1;
    transaction.date = new Date();
    this.transactions.push(transaction);

    const wallet = this.wallets.find(w => w.crypto === transaction.crypto);
    if (wallet) {
      wallet.solde += transaction.typeOperation === 'ACHAT' ? transaction.quantiteCrypto : -transaction.quantiteCrypto;
    }
    return of(transaction);
  }

  getWalletValues(clientId: number): Observable<any> {
    const total = this.wallets.reduce((sum, w) => sum + w.solde, 0);
    return of({ total });
  }

  createWallet(clientId: number, crypto: string): Observable<string> {
    const exists = this.wallets.find(w => w.crypto === crypto);
    if (!exists) {
      this.wallets.push({ id: this.wallets.length + 1, crypto, solde: 0 });
    }
    return of(`Wallet ${crypto} créé`);
  }
}
