export type CurrencyData = {
  code: string;
  name: string;
  symbol: string;
  balance: number;
  formattedBalance: string;
  accountDetails?: string;
  hasStocks?: boolean;
  hasInterest?: boolean;
  interestRate?: string;
  availableBalance?: number;
  totalReturns?: string;
};

export const currencies: CurrencyData[] = [
  {
    code: 'GBP',
    name: 'British pound',
    symbol: '\u00A3',
    balance: 247.66,
    formattedBalance: '247.66 GBP',
    accountDetails: '23-14-70 \u00B7 46839215',
    hasInterest: true,
    interestRate: '3.26%',
    totalReturns: '+1.06 GBP',
  },
  {
    code: 'EUR',
    name: 'Euro',
    symbol: '\u20AC',
    balance: 296.80,
    formattedBalance: '296.80 EUR',
    accountDetails: 'BE68 9670 3781 7624',
  },
  {
    code: 'USD',
    name: 'United States dollar',
    symbol: '$',
    balance: 214.80,
    formattedBalance: '214.80 USD',
    accountDetails: '8311094826',
  },
  {
    code: 'CAD',
    name: 'Canadian dollar',
    symbol: 'C$',
    balance: 0,
    formattedBalance: '0.00 CAD',
    accountDetails: '200110083474',
  },
];

export const totalAccountBalance = currencies.reduce((sum, c) => sum + c.balance, 0);
