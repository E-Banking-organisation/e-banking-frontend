export interface Currency {
    id: string;
    code: string;         // Ex: USD, EUR, MAD
    name: string;         // Ex: US Dollar, Euro, Moroccan Dirham
    symbol: string;       // Ex: $, €, د.م.
    exchangeRate: number; // Exchange rate relative to base currency (usually USD or EUR)
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  }