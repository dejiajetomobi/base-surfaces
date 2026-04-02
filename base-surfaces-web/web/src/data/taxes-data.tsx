import { Plus } from '@transferwise/icons';
import type { CurrencyData } from './currencies';
import type { Transaction } from './transactions';

export const taxesCurrencies: CurrencyData[] = [
  {
    code: 'GBP',
    name: 'British pound',
    symbol: '£',
    balance: 5800,
    formattedBalance: '5,800.00 GBP',
    accountDetails: '23-14-70 · 81204736',
  },
];

export const taxesTotalBalance = 5800;

export const taxesTransactions: Transaction[] = [
  { name: 'From GBP', subtitle: 'Moved by you', amount: '+ 800.00 GBP', isPositive: true, icon: <Plus size={24} />, date: '20 February', currency: 'GBP' },
  { name: 'From GBP', subtitle: 'Moved by you', amount: '+ 5,000.00 GBP', isPositive: true, icon: <Plus size={24} />, date: '10 February', currency: 'GBP' },
];
