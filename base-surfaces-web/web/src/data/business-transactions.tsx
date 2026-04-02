import { Send, Receive, Convert, Plus } from '@transferwise/icons';
import type { Transaction, TxTranslator } from './transactions';

const LOGO_DEV_TOKEN = 'pk_CkDnlfI6QH-YA3A_mVN8gA';
const logoUrl = (domain: string) =>
  `https://img.logo.dev/${domain}?token=${LOGO_DEV_TOKEN}&size=128&format=png`;

const defaultLabels: TxTranslator = {
  sent: 'Sent',
  sentByYou: 'Sent by you',
  added: 'Added',
  addedByYou: 'Added by you',
  moved: 'Moved',
  movedByYou: 'Moved by you',
  spentByYou: 'Spent by you',
};

export function buildBusinessTransactions(consumerName: string, labels: TxTranslator = defaultLabels): Transaction[] {
  return [
  // Today (25 Feb) — GBP: +1,350.00 | EUR: -89.00
  { name: 'Horizon Digital', amount: '+ 1,350.00 GBP', isPositive: true, icon: <Receive size={24} />, date: 'Today', currency: 'GBP' },
  { name: 'Stripe', subtitle: labels.spentByYou, amount: '89.00 EUR', isPositive: false, imgSrc: logoUrl('stripe.com'), date: 'Today', currency: 'EUR' },

  // Yesterday (24 Feb) — USD: -22.00 | SGD: +680.00
  { name: 'Mailchimp', subtitle: labels.spentByYou, amount: '22.00 USD', isPositive: false, imgSrc: logoUrl('mailchimp.com'), date: 'Yesterday', currency: 'USD' },
  { name: 'AsiaConnect Pte', amount: '+ 680.00 SGD', isPositive: true, icon: <Receive size={24} />, date: 'Yesterday', currency: 'SGD' },

  // 23 Feb — GBP: -245.00 | EUR: +950.00
  { name: 'Royal Mail', subtitle: labels.sentByYou, amount: '245.00 GBP', isPositive: false, icon: <Send size={24} />, date: '23 February', currency: 'GBP' },
  { name: 'Studio Bianchi', amount: '+ 950.00 EUR', isPositive: true, icon: <Receive size={24} />, date: '23 February', currency: 'EUR' },

  // 22 Feb — GBP: +4,200.00 | USD: -8.45
  { name: 'Acme Corp', amount: '+ 4,200.00 GBP', isPositive: true, icon: <Receive size={24} />, date: '22 February', currency: 'GBP' },
  { name: 'Pret A Manger', subtitle: labels.spentByYou, amount: '8.45 USD', isPositive: false, imgSrc: logoUrl('pret.com'), date: '22 February', currency: 'USD' },

  // 21 Feb — GBP: +2,800.00 -1,200.00 | USD: -54.99
  { name: 'Meridian Studios', amount: '+ 2,800.00 GBP', isPositive: true, icon: <Receive size={24} />, date: '21 February', currency: 'GBP' },
  { name: 'Adobe', subtitle: labels.spentByYou, amount: '54.99 USD', isPositive: false, imgSrc: logoUrl('adobe.com'), date: '21 February', currency: 'USD' },
  { name: 'Sarah Chen', subtitle: labels.sentByYou, amount: '1,200.00 GBP', isPositive: false, icon: <Send size={24} />, date: '21 February', currency: 'GBP' },

  // 19 Feb — USD: -29.00 -8.00 | EUR: -186.40
  { name: 'Webflow', subtitle: labels.spentByYou, amount: '29.00 USD', isPositive: false, imgSrc: logoUrl('webflow.com'), date: '19 February', currency: 'USD' },
  { name: 'Notion', subtitle: labels.spentByYou, amount: '8.00 USD', isPositive: false, imgSrc: logoUrl('notion.so'), date: '19 February', currency: 'USD' },
  { name: 'MOO Print', subtitle: labels.sentByYou, amount: '186.40 EUR', isPositive: false, icon: <Send size={24} />, date: '19 February', currency: 'EUR' },

  // 17 Feb — GBP: -280.00(→SGD) | SGD: +475.16 +1,850.00
  { name: 'To SGD', subtitle: labels.movedByYou, amount: '280.00 GBP', amountSub: '475.16 SGD', isPositive: false, icon: <Convert size={24} />, date: '17 February', currency: 'GBP', conversion: { fromCurrency: 'GBP', toCurrency: 'SGD', fromAmount: '280.00 GBP', toAmount: '475.16 SGD' } },
  { name: 'TechStart Singapore', amount: '+ 1,850.00 SGD', isPositive: true, icon: <Receive size={24} />, date: '17 February', currency: 'SGD' },

  // 15 Feb — USD: -20.00 -12.50 | GBP: +1,600.00
  { name: 'Vercel', subtitle: labels.spentByYou, amount: '20.00 USD', isPositive: false, imgSrc: logoUrl('vercel.com'), date: '15 February', currency: 'USD' },
  { name: 'Uber', subtitle: labels.spentByYou, amount: '12.50 USD', isPositive: false, imgSrc: logoUrl('uber.com'), date: '15 February', currency: 'USD' },
  { name: 'Bright Ideas Agency', amount: '+ 1,600.00 GBP', isPositive: true, icon: <Receive size={24} />, date: '15 February', currency: 'GBP' },

  // 14 Feb — GBP: -1,500.00(→USD) | USD: +1,912.50 | EUR: -650.00
  { name: 'To USD', subtitle: labels.movedByYou, amount: '1,500.00 GBP', amountSub: '1,912.50 USD', isPositive: false, icon: <Convert size={24} />, date: '14 February', currency: 'GBP', conversion: { fromCurrency: 'GBP', toCurrency: 'USD', fromAmount: '1,500.00 GBP', toAmount: '1,912.50 USD' } },
  { name: 'Marco Rossi', subtitle: labels.sentByYou, amount: '650.00 EUR', isPositive: false, icon: <Send size={24} />, date: '14 February', currency: 'EUR' },

  // 12 Feb — USD: -8.00 -29.00 | GBP: -34.20
  { name: 'Linear', subtitle: labels.spentByYou, amount: '8.00 USD', isPositive: false, imgSrc: logoUrl('linear.app'), date: '12 February', currency: 'USD' },
  { name: 'Tesco', subtitle: labels.spentByYou, amount: '34.20 GBP', isPositive: false, imgSrc: logoUrl('tesco.com'), date: '12 February', currency: 'GBP' },
  { name: 'Shutterstock', subtitle: labels.spentByYou, amount: '29.00 USD', isPositive: false, imgSrc: logoUrl('shutterstock.com'), date: '12 February', currency: 'USD' },

  // 10 Feb — GBP: +5,000.00 -342.80
  { name: consumerName, subtitle: labels.addedByYou, amount: '+ 5,000.00 GBP', isPositive: true, icon: <Plus size={24} />, date: '10 February', currency: 'GBP' },
  { name: 'Printful', subtitle: labels.sentByYou, amount: '342.80 GBP', isPositive: false, icon: <Send size={24} />, date: '10 February', currency: 'GBP' },

  // 8 Feb — GBP: -1,840.00
  { name: 'HMRC', subtitle: labels.sentByYou, amount: '1,840.00 GBP', isPositive: false, icon: <Send size={24} />, date: '8 February', currency: 'GBP' },

  // 5 Feb — GBP: +3,500.00
  { name: 'Acme Corp', amount: '+ 3,500.00 GBP', isPositive: true, icon: <Receive size={24} />, date: '5 February', currency: 'GBP' },
  ];
}

export const businessTransactions: Transaction[] = buildBusinessTransactions('Connor Berry');
