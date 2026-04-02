import { useState, useMemo } from 'react';
import { Download, Slider, UpwardGraph, AutoConvert, Link as LinkIcon, ChevronRight } from '@transferwise/icons';
import { Button, ListItem, SearchInput, Size, SegmentedControl } from '@transferwise/components';
import type { AccountType } from '../App';
import { AccountPageHeader } from '../components/AccountPageHeader';
import { ActivitySummary } from '../components/ActivitySummary';
import { currencies, type CurrencyData } from '../data/currencies';
import { businessCurrencies } from '../data/business-currencies';
import { buildTransactions, getTransactionsForCurrency, groupByDate, type Transaction } from '../data/transactions';
import { buildBusinessTransactions } from '../data/business-transactions';
import { usePrototypeNames } from '../context/PrototypeNames';
import { useLanguage, useTxLabels } from '../context/Language';

import { taxesCurrencies, taxesTransactions } from '../data/taxes-data';

type Props = {
  code: string;
  onNavigateAccount?: () => void;
  accountType?: AccountType;
  jar?: 'taxes';
  onAdd?: () => void;
  onConvert?: () => void;
  onSend?: () => void;
  onRequest?: () => void;
  onPaymentLink?: () => void;
};

function TransactionsSection({ currency, isMobile, txList }: { currency: CurrencyData; isMobile?: boolean; txList?: Transaction[] }) {
  const { t } = useLanguage();
  const [search, setSearch] = useState('');
  const allTx = getTransactionsForCurrency(currency.code, txList, t('tx.movedByYou'));
  const isSearching = search.length >= 3;
  const filtered = isSearching
    ? allTx.filter((tx) => tx.name.toLowerCase().includes(search.toLowerCase()))
    : allTx;
  const grouped = groupByDate(filtered);

  return (
    <div className="section-card">
      {!isMobile && (
        <div className="section-card__header">
          <h3 className="section-card__title" style={{ margin: 0 }}>{t('home.transactions')}</h3>
        </div>
      )}
      {allTx.length > 0 && (
        <div className="account-tab-panel__tx-header">
          <div className="account-tab-panel__tx-search">
            <SearchInput
              placeholder={t('common.search')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              size={Size.SMALL}
            />
          </div>
          <Button v2 size="sm" priority="secondary-neutral" addonStart={{ type: 'icon', value: <Slider size={16} /> }}>{t('common.filters')}</Button>
          <Button v2 size="sm" priority="secondary-neutral" addonStart={{ type: 'icon', value: <Download size={16} /> }}>{t('common.download')}</Button>
        </div>
      )}

      {allTx.length === 0 && (
        <div className="section-card__empty">
          <h3 className="section-card__title" style={{ margin: '0 0 8px' }}>{t('currencyPage.nothingYet')}</h3>
          <p className="np-text-body-default" style={{ margin: 0, color: 'var(--color-content-secondary)' }}>{t('currencyPage.txWillShow')}</p>
        </div>
      )}

      {isSearching && grouped.length === 0 && allTx.length > 0 && (
        <p className="np-text-body-default" style={{ margin: '24px 0', fontWeight: 600, color: 'var(--color-content-primary)' }}>{t('transactions.noResults')}</p>
      )}

      {grouped.map(([date, txs]) => (
        <div className="np-section" key={date}>
          <h5 className="np-text-title-group np-header np-header--group p-y-2" style={{ margin: 0 }}>
            {date}
          </h5>
          <ul className="wds-list list-unstyled m-y-0 transactions-list">
            {txs.map((tx, i) => (
              <ActivitySummary
                key={i}
                icon={tx.icon}
                imgSrc={tx.imgSrc}
                name={tx.name}
                subtitle={tx.subtitle}
                amount={tx.amount}
                amountSub={tx.amountSub}
                isPositive={tx.isPositive}
              />
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function InterestListItem({ currency, accountType = 'personal' }: { currency: CurrencyData; accountType?: AccountType }) {
  const { t } = useLanguage();
  const isActive = (currency.code === 'GBP' && accountType === 'personal') || currency.hasInterest;
  return (
    <ListItem
      spotlight={isActive ? 'active' : 'inactive'}
      title={isActive ? t('currencyPage.interestActive') : t('currencyPage.earnReturn')}
      subtitle={isActive ? t('currencyPage.variableRate') : t('currencyPage.exploreGrow')}
      media={
        <ListItem.AvatarView size={48} style={isActive
          ? { backgroundColor: '#9fe870', border: 'none', color: '#163300' }
          : { backgroundColor: 'var(--color-background-neutral)', border: 'none' }
        }>
          <UpwardGraph size={24} />
        </ListItem.AvatarView>
      }
      control={<ListItem.Navigation onClick={() => {}} />}
    />
  );
}

function InterestRateCard({ currency, interestReturns }: { currency: CurrencyData; interestReturns?: number }) {
  const { t } = useLanguage();
  const rate = currency.interestRate ?? '3.26%';
  const returnsValue = interestReturns ?? 0;
  const returns = returnsValue > 0
    ? `+${returnsValue.toFixed(2)} ${currency.code}`
    : `${returnsValue.toFixed(2)} ${currency.code}`;
  const isPositiveReturn = returnsValue > 0;
  const isNegativeReturn = returnsValue < 0;
  const returnColor = isPositiveReturn
    ? 'var(--color-sentiment-positive)'
    : isNegativeReturn
      ? 'var(--color-sentiment-negative)'
      : undefined;

  return (
    <div className="interest-rate-card">
      <div className="interest-rate-card__cell">
        <span className="interest-rate-card__value">{rate}</span>
        <span className="np-text-body-default" style={{ color: 'var(--color-content-secondary)' }}>{t('currencyPage.variableRateLabel')}</span>
      </div>
      <div className="interest-rate-card__divider" />
      <button type="button" className="interest-rate-card__cell interest-rate-card__cell--clickable">
        <span className="interest-rate-card__value" style={returnColor ? { color: returnColor } : undefined}>
          {returns}
          <span className="interest-rate-card__chevron"><ChevronRight size={16} /></span>
        </span>
        <span className="np-text-body-default" style={{ color: 'var(--color-content-secondary)' }}>{t('currencyPage.returnsThisMonth')}</span>
      </button>
    </div>
  );
}

function OptionsContent({ currency, accountType = 'personal', interestReturns }: { currency: CurrencyData; accountType?: AccountType; interestReturns?: number }) {
  const { t } = useLanguage();
  const showRateCard = (currency.hasStocks || currency.hasInterest) && accountType === 'personal';

  return (
    <>
      {showRateCard && (
        <div className="currency-page__options-rate-card">
          <InterestRateCard currency={currency} interestReturns={interestReturns} />
          <p className="np-text-body-small currency-page__disclaimer" style={{ margin: '12px 0 20px', color: 'var(--color-content-secondary)', textAlign: 'center' }}>
            {t('currencyPage.disclaimerInterest')}
          </p>
        </div>
      )}
      <InterestListItem currency={currency} accountType={accountType} />
      {!showRateCard && (
        <p className="np-text-body-small currency-page__disclaimer" style={{ margin: '12px 0 8px', color: 'var(--color-content-secondary)', textAlign: 'center' }}>
          {t('currencyPage.disclaimer')}
        </p>
      )}

      <div style={{ marginTop: 32 }}>
        <ListItem
          spotlight="inactive"
          title={t('currencyPage.autoConversions')}
          subtitle={t('currencyPage.autoConversionsSub')}
          media={
            <ListItem.AvatarView size={48} style={{ backgroundColor: 'var(--color-background-neutral)', border: 'none' }}>
              <AutoConvert size={24} />
            </ListItem.AvatarView>
          }
          control={<ListItem.Navigation onClick={() => {}} />}
        />
      </div>

      {accountType === 'business' && (
        <div style={{ marginTop: 16 }}>
          <ListItem
            spotlight="inactive"
            title={t('currencyPage.setupConnection')}
            subtitle={t('currencyPage.setupConnectionSub')}
            media={
              <ListItem.AvatarView size={48} style={{ backgroundColor: 'var(--color-background-neutral)', border: 'none' }}>
                <LinkIcon size={24} />
              </ListItem.AvatarView>
            }
            control={<ListItem.Navigation onClick={() => {}} />}
          />
        </div>
      )}
    </>
  );
}

function Sidebar({ currency, accountType = 'personal', interestReturns }: { currency: CurrencyData; accountType?: AccountType; interestReturns?: number }) {
  const { t } = useLanguage();
  const showRateCard = (currency.hasStocks || currency.hasInterest) && accountType === 'personal';

  return (
    <aside className="currency-page__sidebar">
      {showRateCard && (
        <>
          <InterestRateCard currency={currency} interestReturns={interestReturns} />
          <p className="np-text-body-small currency-page__disclaimer" style={{ margin: '12px 0 20px', color: 'var(--color-content-secondary)', textAlign: 'center' }}>
            {t('currencyPage.disclaimerInterest')}
          </p>
        </>
      )}
      <InterestListItem currency={currency} accountType={accountType} />
      {!showRateCard && (
        <p className="np-text-body-small currency-page__disclaimer" style={{ margin: '12px 0 8px', color: 'var(--color-content-secondary)', textAlign: 'center' }}>
          {t('currencyPage.disclaimer')}
        </p>
      )}

      <div style={{ marginTop: 32 }}>
        <ListItem
          spotlight="inactive"
          title={t('currencyPage.autoConversions')}
          subtitle={t('currencyPage.autoConversionsSub')}
          media={
            <ListItem.AvatarView size={48} style={{ backgroundColor: 'var(--color-background-neutral)', border: 'none' }}>
              <AutoConvert size={24} />
            </ListItem.AvatarView>
          }
          control={<ListItem.Navigation onClick={() => {}} />}
        />
      </div>

      {accountType === 'business' && (
        <div style={{ marginTop: 16 }}>
          <ListItem
            spotlight="inactive"
            title={t('currencyPage.setupConnection')}
            subtitle={t('currencyPage.setupConnectionSub')}
            media={
              <ListItem.AvatarView size={48} style={{ backgroundColor: 'var(--color-background-neutral)', border: 'none' }}>
                <LinkIcon size={24} />
              </ListItem.AvatarView>
            }
            control={<ListItem.Navigation onClick={() => {}} />}
          />
        </div>
      )}
    </aside>
  );
}

export function CurrencyPage({ code, onNavigateAccount, accountType = 'personal', jar, onAdd, onConvert, onSend, onRequest, onPaymentLink }: Props) {
  const { t } = useLanguage();
  const txLabels = useTxLabels();
  const { consumerName, businessName } = usePrototypeNames();
  const [activeTab, setActiveTab] = useState('transactions');
  const personalTransactions = useMemo(() => buildTransactions(consumerName, businessName, txLabels), [consumerName, businessName, txLabels]);
  const businessTransactions = useMemo(() => buildBusinessTransactions(consumerName, txLabels), [consumerName, txLabels]);
  const isTaxes = jar === 'taxes';
  const activeCurrencies = isTaxes ? taxesCurrencies : (accountType === 'business' ? businessCurrencies : currencies);
  const activeTxList = isTaxes ? taxesTransactions : (accountType === 'business' ? businessTransactions : personalTransactions);
  const currency = activeCurrencies.find((c) => c.code === code);

  const interestReturns = useMemo(() => {
    const interestTxs = activeTxList.filter((tx) => tx.name === 'Wise Interest' && tx.isPositive && tx.currency === currency?.code);
    return interestTxs.reduce((sum, tx) => {
      const match = tx.amount.match(/([\d.]+)/);
      return sum + (match ? parseFloat(match[1]) : 0);
    }, 0);
  }, [activeTxList, currency?.code]);

  if (!currency) {
    return <div className="np-text-body-default">Currency not found.</div>;
  }

  const showRateCard = (currency.hasStocks || currency.hasInterest) && accountType === 'personal';

  const menuItems = [
    { label: t('common.statementsAndReports') },
    { label: t('currencyPage.directDebits') },
    { label: t('currencyPage.getProof') },
    { label: t('currencyPage.removeCurrency') },
  ];

  return (
    <div className="currency-page">
      <AccountPageHeader
        type="currency"
        currencyCode={currency.code}
        label={currency.code}
        balance={currency.formattedBalance}
        availableBalance={currency.hasStocks ? `${(currency.balance * 0.95).toFixed(2)} ${currency.code}` : undefined}
        hasStocks={currency.hasStocks}
        accountDetails={currency.accountDetails}
        menuItems={menuItems}
        onBreadcrumbClick={onNavigateAccount}
        accountType={accountType}
        hideGetPaid={false}
        sendSecondary={currency.balance === 0}
        onAdd={onAdd}
        onConvert={onConvert}
        onSend={onSend}
        onRequest={onRequest}
        onPaymentLink={onPaymentLink}
      />

      {/* Desktop: two-column layout (60/40), no tabs */}
      <div className="currency-page__desktop">
        <div className="currency-page__desktop-main">
          <TransactionsSection currency={currency} txList={activeTxList} />
        </div>
        <Sidebar currency={currency} accountType={accountType} interestReturns={interestReturns} />
      </div>

      {/* Mobile/Tablet: segmented control tabs */}
      <div className="currency-page__mobile">
        {showRateCard && (
          <div className="currency-page__mobile-rate-card">
            <InterestRateCard currency={currency} interestReturns={interestReturns} />
            <p className="np-text-body-small currency-page__disclaimer" style={{ margin: '12px 0 0', color: 'var(--color-content-secondary)', textAlign: 'center' }}>
              {t('currencyPage.disclaimerInterest')}
            </p>
          </div>
        )}
        <div className="currency-page__tabs">
          <SegmentedControl
            name="currency-tabs"
            mode="input"
            segments={[
              { id: 'ctab-transactions', value: 'transactions', label: t('currencyPage.tab.transactions') },
              { id: 'ctab-options', value: 'options', label: t('currencyPage.tab.options') },
            ]}
            value={activeTab}
            onChange={setActiveTab}
          />
        </div>

        {activeTab === 'transactions' && <TransactionsSection currency={currency} isMobile txList={activeTxList} />}
        {activeTab === 'options' && <OptionsContent currency={currency} accountType={accountType} interestReturns={interestReturns} />}
      </div>
    </div>
  );
}
