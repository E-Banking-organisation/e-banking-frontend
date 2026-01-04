import { LoadingOptions } from "highcharts";

export interface Transaction {
  id: number;
  accountId: number;
  destinationAccountId: number;
  reference: string;
  date: Date;
  description: string;
  amount: number;
  type: string;
  status: string;
  devise: string;
  frais: number;
  destination: string;
  source: string;
}


