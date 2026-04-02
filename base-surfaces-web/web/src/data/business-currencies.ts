import type { CurrencyData } from './currencies';

export const businessCurrencies: CurrencyData[] = [
  {
    code: 'GBP',
    name: 'British pound',
    symbol: '£',
    balance: 8246.00,
    formattedBalance: '8,246.00 GBP',
    accountDetails: '23-14-70 · 81204736',
  },
  {
    code: 'USD',
    name: 'United States dollar',
    symbol: '$',
    balance: 1720.56,
    formattedBalance: '1,720.56 USD',
    accountDetails: '9402718365',
  },
  {
    code: 'EUR',
    name: 'Euro',
    symbol: '€',
    balance: 1136.67,
    formattedBalance: '1,136.67 EUR',
    accountDetails: 'BE42 9670 5519 3847',
  },
  {
    code: 'SGD',
    name: 'Singapore dollar',
    symbol: 'S$',
    balance: 3005.16,
    formattedBalance: '3,005.16 SGD',
    accountDetails: '2048193756',
  },
];

export const businessTotalAccountBalance = businessCurrencies.reduce((sum, c) => sum + c.balance, 0);
