import { useState, useMemo } from 'react';
import { ListItem, Button, IconButton, Modal } from '@transferwise/components';
import { Graph, Money, Rewards, QuestionMarkCircle } from '@transferwise/icons';
import type { AccountType } from '../App';
import { currencies } from '../data/currencies';
import { businessCurrencies } from '../data/business-currencies';
import { buildTransactions } from '../data/transactions';
import { buildBusinessTransactions } from '../data/business-transactions';
import { usePrototypeNames } from '../context/PrototypeNames';
import { useLanguage, useTxLabels } from '../context/Language';
import type { TranslationKey } from '../translations/en';
import { convertToHomeCurrency, getCurrencySymbol, usdBaseRates } from '../data/currency-rates';
import { useLiveRates } from '../context/LiveRates';

export function Insights({ accountType = 'personal' }: { accountType?: AccountType }) {
  const { consumerName, businessName, consumerHomeCurrency, businessHomeCurrency } = usePrototypeNames();
  const { t } = useLanguage();
  const txLabels = useTxLabels();
  const rates = useLiveRates();
  const isBusiness = accountType === 'business';
  const homeCurrency = isBusiness ? businessHomeCurrency : consumerHomeCurrency;
  const activeCurrencies = isBusiness ? businessCurrencies : currencies;
  const personalTransactions = useMemo(() => buildTransactions(consumerName, businessName, txLabels), [consumerName, businessName, txLabels]);
  const businessTransactions = useMemo(() => buildBusinessTransactions(consumerName, txLabels), [consumerName, txLabels]);
  const activeTransactions = isBusiness ? businessTransactions : personalTransactions;

  const taxesBalance = isBusiness ? 5000 : 0;

  const { totalBalance, cashBalance, interestBalance, hasStocks, stocksBalance, totalInterestReturns, spentThisMonth, spentLastMonth, products } = useMemo(() => {
    const total = activeCurrencies.reduce((sum, c) => sum + convertToHomeCurrency(c.balance, c.code, homeCurrency, rates), 0) + convertToHomeCurrency(taxesBalance, 'GBP', homeCurrency, rates);

    // Check if any currency has interest or stocks enabled
    const gbpCurrency = activeCurrencies.find((c) => c.code === 'GBP');
    const gbpHasStocks = gbpCurrency?.hasStocks ?? false;
    const gbpHasInterest = gbpCurrency?.hasInterest ?? false;
    const gbpHasAssets = gbpHasStocks || gbpHasInterest;
    const interestInHome = gbpHasAssets ? convertToHomeCurrency(gbpCurrency?.balance ?? 0, 'GBP', homeCurrency, rates) : 0;
    const cashInHome = activeCurrencies
      .filter((c) => gbpHasAssets ? c.code !== 'GBP' : true)
      .reduce((sum, c) => sum + convertToHomeCurrency(c.balance, c.code, homeCurrency, rates), 0);

    const stocks = gbpHasStocks ? convertToHomeCurrency(24.75, 'GBP', homeCurrency, rates) : 0;

    // Interest returns from Wise Interest transactions — use fallback rates (historical, not live)
    const interestTxs = activeTransactions.filter((tx) => tx.name === 'Wise Interest' && tx.isPositive);
    const interestReturns = interestTxs.reduce((sum, tx) => {
      const match = tx.amount.match(/([\d.]+)\s*(\w+)/);
      if (!match) return sum;
      const amt = parseFloat(match[1]);
      const cur = match[2];
      return sum + convertToHomeCurrency(amt, cur, homeCurrency, usdBaseRates);
    }, 0);

    // Spending: debit transactions (not conversions, not interest adds) — use fallback rates (historical)
    const debits = activeTransactions.filter((tx) => !tx.isPositive && !tx.conversion);
    const spent = debits.reduce((sum, tx) => {
      const match = tx.amount.match(/([\d,.]+)\s*(\w+)/);
      if (!match) return sum;
      const amt = parseFloat(match[1].replace(/,/g, ''));
      const cur = match[2];
      return sum + convertToHomeCurrency(amt, cur, homeCurrency, usdBaseRates);
    }, 0);

    const prods: { key: string; titleKey: TranslationKey; subtitle: string | undefined; icon: React.ReactNode; control: 'navigation' | 'button'; value: number }[] = [
      {
        key: 'cash',
        titleKey: 'insights.cash' as TranslationKey,
        subtitle: `${(gbpHasAssets ? cashInHome : total).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${homeCurrency}`,
        icon: <Money size={24} />,
        control: 'navigation' as const,
        value: gbpHasAssets ? cashInHome : total,
      },
      // Interest: show with balance if active, otherwise show with Learn more button
      gbpHasAssets ? {
        key: 'interest',
        titleKey: 'insights.interest' as TranslationKey,
        subtitle: `${interestInHome.toFixed(2)} ${homeCurrency}`,
        icon: <Rewards size={24} />,
        control: 'navigation' as const,
        value: interestInHome,
      } : {
        key: 'interest',
        titleKey: 'insights.interest' as TranslationKey,
        subtitle: undefined as string | undefined,
        icon: <Rewards size={24} />,
        control: 'button' as const,
        value: 0,
      },
      // Stocks: show with balance if active, otherwise show with Learn more button
      gbpHasStocks ? {
        key: 'stocks',
        titleKey: 'insights.stocks' as TranslationKey,
        subtitle: undefined as string | undefined,
        icon: <Graph size={24} />,
        control: 'navigation' as const,
        value: stocks,
      } : {
        key: 'stocks',
        titleKey: 'insights.stocks' as TranslationKey,
        subtitle: undefined as string | undefined,
        icon: <Graph size={24} />,
        control: 'button' as const,
        value: -1,
      },
    ].sort((a, b) => b.value - a.value);

    return {
      totalBalance: total.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      cashBalance: cashInHome,
      interestBalance: interestInHome,
      hasStocks: gbpHasStocks,
      stocksBalance: stocks,
      totalInterestReturns: interestReturns,
      spentThisMonth: spent,
      spentLastMonth: 0,
      products: prods,
    };
  }, [activeCurrencies, activeTransactions, homeCurrency, rates]);
  const [isBalanceInfoOpen, setIsBalanceInfoOpen] = useState(false);

  return (
    <div className="insights-page">
      {/* Total Balance */}
      <div className="insights-page__balance">
        <div className="insights-page__balance-label">
          <span className="np-text-body-large" style={{ margin: 0 }}>{t('insights.totalBalance')}</span>
          <IconButton
            size={24}
            priority="minimal"
            aria-label={t('balance.balanceInfo')}
            onClick={() => setIsBalanceInfoOpen(true)}
          >
            <QuestionMarkCircle size={16} />
          </IconButton>
        </div>
        <h1 className="np-text-display-number" style={{ margin: 0 }}>{totalBalance} {homeCurrency}</h1>
      </div>

      {/* Balance Info Modal */}
      <Modal
        open={isBalanceInfoOpen}
        onClose={() => setIsBalanceInfoOpen(false)}
        title={t('insights.totalBalance')}
        body={
          <>
            <p className="np-text-body-large" style={{ margin: 0 }}>
              {t('balance.insightsModalBody1')}
            </p>
            <p className="np-text-body-large" style={{ margin: 0 }}>
              {t('balance.insightsModalBody2')}
            </p>
          </>
        }
      />

      {/* Product List */}
      <div className="insights-page__products">
        {products.map((product) => (
          <ListItem
            key={product.key}
            title={<span className="np-text-body-large" style={{ fontWeight: 600 }}>{t(product.titleKey)}</span>}
            subtitle={product.subtitle}
            media={
              <ListItem.AvatarView
                size={48}
                style={
                  product.key === 'stocks'
                    ? { backgroundColor: '#CBD9C3', color: '#163300' }
                    : product.key === 'interest'
                      ? { backgroundColor: '#163300', color: '#CBD9C3' }
                      : undefined
                }
              >
                {product.icon}
              </ListItem.AvatarView>
            }
            control={
              product.control === 'navigation'
                ? <ListItem.Navigation onClick={() => {}} />
                : <ListItem.Button priority="secondary-neutral" onClick={() => {}}>{t('common.learnMore')}</ListItem.Button>
            }
          />
        ))}
      </div>

      {/* Total Returns */}
      <div className="insights-page__returns">
        <h3 className="np-text-title-subsection" style={{ margin: 0 }}>{t('insights.totalReturns')}</h3>
        <div className="insights-page__returns-card">
          <div>
            <p className="np-text-body-default" style={{ margin: 0, color: 'var(--color-content-secondary)' }}>{t('insights.interest')}</p>
            <p className="np-text-title-subsection" style={{ margin: '4px 0 0', color: totalInterestReturns > 0 ? 'var(--color-sentiment-positive)' : undefined }}>
              {totalInterestReturns > 0 ? '+ ' : ''}{totalInterestReturns.toFixed(2)} {homeCurrency}
            </p>
          </div>
          <div>
            <p className="np-text-body-default" style={{ margin: 0, color: 'var(--color-content-secondary)' }}>{t('insights.stocks')}</p>
            <p className="np-text-title-subsection" style={{ margin: '4px 0 0' }}>
              0.00 {homeCurrency}
            </p>
          </div>
        </div>
      </div>

      {/* Spending — personal only */}
      {!isBusiness && (
        <div className="insights-page__spending">
          <div className="insights-page__spending-card">
            <div className="insights-page__spending-header">
              <h3 className="np-text-title-subsection" style={{ margin: 0 }}>{t('insights.spending')}</h3>
              <Button v2 size="sm" priority="tertiary" onClick={() => {}}>{t('common.seeAll')}</Button>
            </div>
            <ListItem
              title={`${spentThisMonth.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${homeCurrency}`}
              subtitle={t('insights.spentThisMonth')}
              media={
                <ListItem.AvatarView size={48}>
                  <Money size={24} />
                </ListItem.AvatarView>
              }
            />
            <ListItem
              title={`${spentLastMonth.toFixed(2)} ${homeCurrency}`}
              subtitle={t('insights.spentLastMonth')}
              media={
                <ListItem.AvatarView size={48}>
                  <Money size={24} />
                </ListItem.AvatarView>
              }
            />
          </div>
        </div>
      )}

      {/* Feedback Footer */}
      <div className="insights-page__footer">
        <p className="np-text-body-default" style={{ color: 'var(--color-content-secondary)', margin: 0 }}>
          {t('insights.feedbackQuestion')}
        </p>
        <a
          href="#"
          className="np-text-link-default"
          onClick={(e) => e.preventDefault()}
        >
          {t('common.giveFeedback')}
        </a>
      </div>
    </div>
  );
}
