export interface Recharge {
  id: number;
  date: Date;
  operator: number;
  account: number;
  amount: number;
  status:  'Confirmé' ;
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

