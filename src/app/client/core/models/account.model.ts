import {Transaction} from './transaction.model';

export interface Account {
  id: number;
  numeroCompte: string;
  rib: string;
  solde: number;
  plafond: number;
  dateCreation: Date;
  typeCompte: string;
  iban: string;
  devise: string;
  statut: string;
  etat: boolean;
  clientId: number;
  transactions: Transaction[];
}


export interface Compte {
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
  etat: boolean;
  clientId: number;
}
