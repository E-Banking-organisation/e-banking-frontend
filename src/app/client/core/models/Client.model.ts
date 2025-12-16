import {Account} from './account.model';
import {User} from './User.model';

export interface Client extends User{
  CIN: string;
  address: string;
  profession:string;
  Accounts: Account[];
}


interface AccountDisplaySetting {
  visible: boolean;
}

interface NotificationSettings {
  transactionAlerts: boolean;
  monthlyReport: boolean;
}

