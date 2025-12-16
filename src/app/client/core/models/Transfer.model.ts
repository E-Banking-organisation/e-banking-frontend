export interface Transfer {
  id: number;
  date: Date;
  sourceAccountId: number;
  beneficiaryId: number;
  amount: number;
  description: string;
  status: 'En attente' | 'Confirmé' | 'Refusé';
}
