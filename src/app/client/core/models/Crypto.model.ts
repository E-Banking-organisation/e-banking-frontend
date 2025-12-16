export interface CryptoWallet {
  id: number;
  crypto: string;
  solde: number;
}
export type TypeCryptoOperation = 'ACHAT' | 'VENTE';

export interface CryptoTransactionDTO {
  id?: number; // facultatif car souvent auto-généré
  clientId: string;
  typeOperation: TypeCryptoOperation;
  crypto: string; // ex: 'BTC', 'ETH'

  montantDevise: number;     // en EUR
  quantiteCrypto: number;
  prixUnitaire: number;

  date: Date;
  transactionHash: string;

  compteId: number;
}
