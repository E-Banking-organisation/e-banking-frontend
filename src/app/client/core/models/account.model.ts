export interface Account {
  id: number;
  accountNumber: string;
  rib : string;
  balance: number;
  limit: number;
  dateCrea: Date;
  type: string;
  iban:  string;
  currency: string;
  statut: string;
}

export interface ApiAccount {
  id: number;
  numeroCompte: string;
  rib: string;
  solde: number;
  plafond: number;
  dateCreation: number;
  typeCompte: string;
  iban: string;
  devise: string;
  statut: string;
}
