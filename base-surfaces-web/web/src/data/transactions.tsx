import { Send, Receive, Convert, Plus } from '@transferwise/icons';

export const LOGO_DEV_TOKEN = 'pk_CkDnlfI6QH-YA3A_mVN8gA';
export const logoUrl = (domain: string) =>
  `https://img.logo.dev/${domain}?token=${LOGO_DEV_TOKEN}&size=128&format=png`;

export type Transaction = {
  name: string;
  subtitle?: string;
  amount: string;
  amountSub?: string;
  isPositive: boolean;
  icon?: React.ReactNode;
  imgSrc?: string;
  date: string;
  currency: string;
  /** For conversion transactions: the other currency involved */
  conversion?: {
    fromCurrency: string;
    toCurrency: string;
    fromAmount: string;
    toAmount: string;
  };
};

/**
 * Get transactions for a specific currency page.
 * - Regular transactions: filtered by currency as normal
 * - Conversion transactions: shown on BOTH currencies involved,
 *   with the name/amount adjusted per currency perspective
 */
export function getTransactionsForCurrency(currencyCode: string, txList: Transaction[] = transactions, movedByYou?: string): Transaction[] {
  const result: Transaction[] = [];
  const movedLabel = movedByYou ?? 'Moved by you';

  for (const tx of txList) {
    if (tx.conversion) {
      const { fromCurrency, toCurrency, fromAmount, toAmount } = tx.conversion;

      if (fromCurrency === currencyCode) {
        // This is the "from" side — money left this currency
        result.push({
          ...tx,
          name: `To ${toCurrency}`,
          subtitle: movedLabel,
          amount: `- ${fromAmount}`,
          amountSub: undefined,
          isPositive: false,
        });
      } else if (toCurrency === currencyCode) {
        // This is the "to" side — money arrived in this currency
        result.push({
          ...tx,
          name: `From ${fromCurrency}`,
          subtitle: movedLabel,
          amount: `+ ${toAmount}`,
          amountSub: undefined,
          isPositive: true,
        });
      }
    } else if (tx.currency === currencyCode) {
      result.push(tx);
    }
  }

  return result;
}

export function groupByDate(txs: Transaction[]): [string, Transaction[]][] {
  const groups: [string, Transaction[]][] = [];
  for (const tx of txs) {
    const last = groups[groups.length - 1];
    if (last && last[0] === tx.date) {
      last[1].push(tx);
    } else {
      groups.push([tx.date, [tx]]);
    }
  }
  return groups;
}

export type TxTranslator = {
  sent: string;
  sentByYou: string;
  added: string;
  addedByYou: string;
  moved: string;
  movedByYou: string;
  spentByYou: string;
};

const defaultLabels: TxTranslator = {
  sent: 'Sent',
  sentByYou: 'Sent by you',
  added: 'Added',
  addedByYou: 'Added by you',
  moved: 'Moved',
  movedByYou: 'Moved by you',
  spentByYou: 'Spent by you',
};

export function buildTransactions(consumerName: string, businessName: string, labels: TxTranslator = defaultLabels): Transaction[] {
  return [
    // Today (25 Feb) — GBP: -6.40 | EUR: -14.90
    { name: 'Pret A Manger', amount: '6.40 GBP', isPositive: false, imgSrc: logoUrl('pret.com'), date: 'Today', currency: 'GBP' },
    { name: 'Lidl', amount: '14.90 EUR', isPositive: false, imgSrc: logoUrl('lidl.com'), date: 'Today', currency: 'EUR' },

    // Yesterday (24 Feb) — GBP: +75.00 -29.99 | USD: -9.99
    { name: 'Olivia Hartley', amount: '+ 75.00 GBP', isPositive: true, icon: <Receive size={24} />, date: 'Yesterday', currency: 'GBP' },
    { name: 'Nando\'s', amount: '29.99 GBP', isPositive: false, imgSrc: logoUrl('nandos.co.uk'), date: 'Yesterday', currency: 'GBP' },
    { name: 'Hulu', amount: '9.99 USD', isPositive: false, imgSrc: logoUrl('hulu.com'), date: 'Yesterday', currency: 'USD' },

    // 23 Feb — EUR: -42.00 | GBP: -8.50
    { name: 'Booking.com', amount: '42.00 EUR', isPositive: false, imgSrc: logoUrl('booking.com'), date: '23 February', currency: 'EUR' },
    { name: 'Costa Coffee', amount: '8.50 GBP', isPositive: false, imgSrc: logoUrl('costa.co.uk'), date: '23 February', currency: 'GBP' },

    // 22 Feb — GBP: +199.66 -147.30
    { name: 'Olivia Hartley', amount: '+ 199.66 GBP', isPositive: true, icon: <Receive size={24} />, date: '22 February', currency: 'GBP' },
    { name: 'Enterprise Rent-A-Car', amount: '147.30 GBP', isPositive: false, imgSrc: logoUrl('enterprise.com'), date: '22 February', currency: 'GBP' },

    // 21 Feb — GBP: -8.49 | USD: -15.49
    { name: "McDonald's", amount: '8.49 GBP', isPositive: false, imgSrc: logoUrl('mcdonalds.com'), date: '21 February', currency: 'GBP' },
    { name: 'Netflix', amount: '15.49 USD', isPositive: false, imgSrc: logoUrl('netflix.com'), date: '21 February', currency: 'USD' },

    // 20 Feb — GBP: +0.04 | EUR: +120.00
    { name: 'Wise Interest', subtitle: labels.added, amount: '+ 0.04 GBP', isPositive: true, icon: <Plus size={24} />, date: '20 February', currency: 'GBP' },
    { name: 'Isabella Moreno', amount: '+ 120.00 EUR', isPositive: true, icon: <Receive size={24} />, date: '20 February', currency: 'EUR' },

    // 19 Feb — GBP: -189.93 +1.00
    { name: 'AMERICAN EXP 4916', subtitle: labels.sent, amount: '189.93 GBP', isPositive: false, icon: <Send size={24} />, date: '19 February', currency: 'GBP' },
    { name: businessName, amount: '+ 1.00 GBP', isPositive: true, icon: <Receive size={24} />, date: '19 February', currency: 'GBP' },

    // 17 Feb — GBP: +0.03 -0.01
    { name: 'Christie Davis', subtitle: labels.sent, amount: '0.01 GBP', isPositive: false, icon: <Send size={24} />, date: '17 February', currency: 'GBP' },
    { name: 'Wise Interest', subtitle: labels.added, amount: '+ 0.03 GBP', isPositive: true, icon: <Plus size={24} />, date: '17 February', currency: 'GBP' },

    // 15 Feb — GBP: -32.47
    { name: 'Tesco', amount: '32.47 GBP', isPositive: false, imgSrc: logoUrl('tesco.com'), date: '15 February', currency: 'GBP' },

    // 14 Feb — GBP: -10.99 -2.80 | USD: -15.49
    { name: 'Spotify', amount: '10.99 GBP', isPositive: false, imgSrc: logoUrl('spotify.com'), date: '14 February', currency: 'GBP' },
    { name: 'TfL', amount: '2.80 GBP', isPositive: false, imgSrc: logoUrl('tfl.gov.uk'), date: '14 February', currency: 'GBP' },

    // 12 Feb — GBP: +0.02 -23.99 -188.00(→USD) | USD: +240.28
    { name: 'Amazon', amount: '23.99 GBP', isPositive: false, imgSrc: logoUrl('amazon.co.uk'), date: '12 February', currency: 'GBP' },
    { name: 'To USD', subtitle: labels.moved, amount: '188.00 GBP', amountSub: '240.28 USD', isPositive: false, icon: <Convert size={24} />, date: '12 February', currency: 'GBP', conversion: { fromCurrency: 'GBP', toCurrency: 'USD', fromAmount: '188.00 GBP', toAmount: '240.28 USD' } },
    { name: 'Wise Interest', subtitle: labels.added, amount: '+ 0.02 GBP', isPositive: true, icon: <Plus size={24} />, date: '12 February', currency: 'GBP' },

    // 10 Feb — EUR: -22.50 | GBP: +50.00
    { name: 'Deliveroo', amount: '22.50 EUR', isPositive: false, imgSrc: logoUrl('deliveroo.co.uk'), date: '10 February', currency: 'EUR' },
    { name: 'Olivia Hartley', amount: '+ 50.00 GBP', isPositive: true, icon: <Receive size={24} />, date: '10 February', currency: 'GBP' },

    // 8 Feb — GBP: +350.00 -47.82
    { name: 'Sainsburys', amount: '47.82 GBP', isPositive: false, imgSrc: logoUrl('sainsburys.co.uk'), date: '8 February', currency: 'GBP' },
    { name: businessName, amount: '+ 350.00 GBP', isPositive: true, icon: <Receive size={24} />, date: '8 February', currency: 'GBP' },

    // 5 Feb — GBP: -219.00(→EUR) -12.40 | EUR: +256.20
    { name: 'To EUR', subtitle: labels.moved, amount: '219.00 GBP', amountSub: '256.20 EUR', isPositive: false, icon: <Convert size={24} />, date: '5 February', currency: 'GBP', conversion: { fromCurrency: 'GBP', toCurrency: 'EUR', fromAmount: '219.00 GBP', toAmount: '256.20 EUR' } },
    { name: 'Uber', amount: '12.40 GBP', isPositive: false, imgSrc: logoUrl('uber.com'), date: '5 February', currency: 'GBP' },

    // 3 Feb — GBP: +500.00
    { name: consumerName, subtitle: labels.added, amount: '+ 500.00 GBP', isPositive: true, icon: <Plus size={24} />, date: '3 February', currency: 'GBP' },
  ];
}

export const transactions: Transaction[] = buildTransactions('Connor Berry', 'Berry Design');
