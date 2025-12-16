export interface Transaction {
    id: string;
    transactionType: 'TRANSFER' | 'DEPOSIT' | 'WITHDRAWAL' | 'PAYMENT' | 'RECHARGE' | 'CRYPTO_PURCHASE' | 'CRYPTO_SALE';
    amount: number;
    currency: string;
    sourceAccountId?: string;
    sourceAccountNumber?: string;
    destinationAccountId?: string;
    destinationAccountNumber?: string;
    status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'FLAGGED' | 'VERIFIED';
    timestamp: Date;
    description?: string;
    verifiedBy?: string;
    verifiedAt?: Date;
    flagReason?: string;
  }