export interface Recharge {
  id: number;
  date: Date;
  operatorId: number;
  accountId: number;
  amount: number;
  status: 'En attente' | 'Confirmé' | 'Échoué';
  phoneNumber?: string;
  reference?: string;
}

export interface Operator {
  id: number;
  name: string;
  logo: string;
  type: 'mobile' | 'service';
  category: string;
  url: string;
}

