export interface GlobalSetting {
    id: string;
    key: string;
    value: string;
    description: string;
    category: 'SECURITY' | 'TRANSACTION' | 'NOTIFICATION' | 'SYSTEM' | 'OTHER';
    isEncrypted: boolean;
    createdAt: Date;
    updatedAt: Date;
  }