import { useState, useCallback, useEffect } from 'react';
import { Logo, SnackbarProvider } from '@transferwise/components';
import { Agentation } from 'agentation';
import { LanguageProvider, useLanguage } from './context/Language';
import { PrototypeNamesProvider, usePrototypeNames } from './context/PrototypeNames';
import { LiveRatesProvider } from './context/LiveRates';
import { ShimmerProvider } from './context/Shimmer';
import { SideNav } from './components/SideNav';
import { TopBar } from './components/TopBar';
import { SidebarOverlay } from './components/SidebarOverlay';
import { MobileNav } from './components/MobileNav';
import { PrototypeSettings } from './components/PrototypeSettings';
import { SpecViewer } from './components/SpecViewer';
import './spec-viewer.css';
import { Home } from './pages/Home';
import { Cards } from './pages/Cards';
import { Transactions } from './pages/Transactions';
import { Payments } from './pages/Payments';
import { Recipients } from './pages/Recipients';
import { Insights } from './pages/Insights';
import { Account } from './pages/Account';
import { CurrentAccount } from './pages/CurrentAccount';
import { CurrencyPage } from './pages/CurrencyPage';
import { Team } from './pages/Team';
import { AddMoneyFlow } from './flows/AddMoneyFlow';
import { ConvertFlow } from './flows/ConvertFlow';
import { SendFlow } from './flows/SendFlow';
import { RequestFlow } from './flows/RequestFlow';
import { PaymentLinkFlow } from './flows/PaymentLinkFlow';
import { CriticalBannerProvider, CriticalBannerBar } from './components/CriticalBanner';
import { personalNav, businessNav } from './data/nav';
import { currencies } from './data/currencies';
import { businessCurrencies } from './data/business-currencies';
import { taxesCurrencies } from './data/taxes-data';

export type AccountType = 'personal' | 'business';

type SubPage =
  | { type: 'account' }
  | { type: 'taxes-account' }
  | { type: 'currency'; code: string; from?: 'account' | 'home' | 'taxes-account'; jar?: 'taxes' }
  | null;

function getInitials(name: string): string {
  return name.split(/\s+/).map((w) => w[0] || '').join('').toUpperCase();
}

type SendRecipient = {
  name: string;
  subtitle: string;
  avatarUrl?: string;
  initials?: string;
  hasFastFlag: boolean;
  badgeFlagCode?: string;
};

type ActiveFlow =
  | { type: 'add-money'; defaultCurrency: string; accountLabel: string; jar?: 'taxes' }
  | { type: 'convert'; fromCurrency: string; toCurrency: string; accountLabel: string; toAccountLabel?: string; jar?: 'taxes' }
  | { type: 'send'; defaultCurrency: string; accountLabel: string; jar?: 'taxes'; recipient?: SendRecipient; prefillAmount?: number; prefillReceiveAmount?: number; startStep?: 'recipient' | 'amount'; forcedReceiveCurrency?: string }
  | { type: 'request'; defaultCurrency: string; accountLabel: string; jar?: 'taxes' }
  | { type: 'payment-link'; defaultCurrency: string; accountLabel: string; jar?: 'taxes' }
  | null;

function AppInner() {
  const { consumerName, businessName, consumerHomeCurrency, businessHomeCurrency } = usePrototypeNames();
  const { t } = useLanguage();
  const [activeNavItem, setActiveNavItem] = useState('Home');
  const [previousNavItem, setPreviousNavItem] = useState('Home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [subPage, setSubPage] = useState<SubPage>(null);
  const [accountType, setAccountType] = useState<AccountType>('personal');
  const [activeFlow, setActiveFlow] = useState<ActiveFlow>(null);

  // Remove preload class to enable transitions after mount
  useEffect(() => {
    document.body.classList.remove('preload');
  }, []);

  const activeName = accountType === 'business' ? businessName : consumerName;
  const activeInitials = getInitials(activeName);
  const avatarUrl = accountType === 'business' ? '/berry-design-logo.png' : 'https://www.tapback.co/api/avatar/connor-berry.webp';

  const handleOpenAddMoney = useCallback((defaultCurrency: string, accountLabel?: string, jar?: 'taxes') => {
    setActiveFlow({ type: 'add-money', defaultCurrency, accountLabel: accountLabel ?? t('home.currentAccount'), jar });
  }, [t]);

  const handleOpenConvert = useCallback((fromCurrency: string, toCurrency: string, accountLabel?: string, jar?: 'taxes', toAccountLabel?: string) => {
    setActiveFlow({ type: 'convert', fromCurrency, toCurrency, accountLabel: accountLabel ?? t('home.currentAccount'), toAccountLabel, jar });
  }, [t]);

  const handleOpenSend = useCallback((defaultCurrency: string, accountLabel?: string, jar?: 'taxes', recipient?: SendRecipient, prefillAmount?: number) => {
    setActiveFlow({
      type: 'send',
      defaultCurrency,
      accountLabel: accountLabel ?? t('home.currentAccount'),
      jar,
      recipient,
      prefillAmount,
      startStep: recipient ? 'amount' : 'recipient',
    });
  }, [t]);

  const handleOpenRequest = useCallback((defaultCurrency: string, accountLabel?: string, jar?: 'taxes') => {
    setActiveFlow({ type: 'request', defaultCurrency, accountLabel: accountLabel ?? t('home.currentAccount'), jar });
  }, [t]);

  const handleOpenPaymentLink = useCallback((defaultCurrency: string, accountLabel?: string, jar?: 'taxes') => {
    setActiveFlow({ type: 'payment-link', defaultCurrency, accountLabel: accountLabel ?? t('home.currentAccount'), jar });
  }, [t]);

  const handleCloseFlow = useCallback(() => {
    setActiveFlow(null);
  }, []);

  const handleSwitchAccount = useCallback((type: AccountType) => {
    setAccountType(type);
    setActiveNavItem('Home');
    setPreviousNavItem('Home');
    setSubPage(null);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const handleNavigate = useCallback((label: string) => {
    setPreviousNavItem(activeNavItem);
    setActiveNavItem(label);
    setSubPage(null);
    document.getElementById('main')?.scrollIntoView({ behavior: 'instant' });
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [activeNavItem]);

  const handleAccountClick = () => {
    setPreviousNavItem(activeNavItem);
    setActiveNavItem('Account');
    setSubPage(null);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleAccountBack = () => {
    setActiveNavItem(previousNavItem);
    setSubPage(null);
  };

  const handleNavigateSubAccount = useCallback(() => {
    setSubPage({ type: 'account' });
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const handleNavigateCurrencyFromAccount = useCallback((code: string) => {
    setSubPage({ type: 'currency', code, from: 'account' });
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const handleNavigateTaxesAccount = useCallback(() => {
    setSubPage({ type: 'taxes-account' });
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const handleNavigateCurrencyFromTaxes = useCallback((code: string) => {
    setSubPage({ type: 'currency', code, from: 'taxes-account', jar: 'taxes' });
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const handleNavigateTaxesCurrencyFromHome = useCallback((code: string) => {
    setSubPage({ type: 'currency', code, from: 'home', jar: 'taxes' });
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const handleNavigateCurrencyFromHome = useCallback((code: string) => {
    setSubPage({ type: 'currency', code, from: 'home' });
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const handleSubPageBack = useCallback(() => {
    if (subPage?.type === 'currency' && subPage.from === 'account') {
      setSubPage({ type: 'account' });
    } else if (subPage?.type === 'currency' && subPage.from === 'taxes-account') {
      setSubPage({ type: 'taxes-account' });
    } else {
      setSubPage(null);
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [subPage]);

  const showBack = activeNavItem === 'Account' || ['Transactions', 'Insights'].includes(activeNavItem) || subPage !== null;
  const showBackClass = (activeNavItem === 'Account' || activeNavItem === 'Transactions' || subPage !== null) ? ' column-layout-main--show-back' : '';
  const mobileBackClass = ['Insights'].includes(activeNavItem) && !subPage ? ' column-layout-main--mobile-back' : '';

  const handleBack = () => {
    if (subPage !== null) {
      handleSubPageBack();
    } else if (activeNavItem === 'Account') {
      handleAccountBack();
    } else {
      handleNavigate('Home');
    }
  };

  const sideNavContent = (
    <>
      <div className="nav-sidebar__top">
        <div className="nav-sidebar-brand">
          <a href="/home" onClick={(e) => { e.preventDefault(); setSubPage(null); setActiveNavItem('Home'); }}>
            <Logo />
          </a>
        </div>
      </div>
      <div className="nav-sidebar__body">
        <SideNav items={accountType === 'business' ? businessNav : personalNav} activeItem={subPage ? '' : activeNavItem} onSelect={(label) => { handleNavigate(label); setIsMobileMenuOpen(false); }} />
      </div>
    </>
  );

  const renderContent = () => {
    if (subPage) {
      if (subPage.type === 'account') {
        const activeCurrencies = accountType === 'business' ? businessCurrencies : currencies;
        return <CurrentAccount onNavigateCurrency={handleNavigateCurrencyFromAccount} onNavigateCards={() => handleNavigate('Cards')} accountType={accountType} onAdd={() => handleOpenAddMoney(activeCurrencies[0]?.code ?? 'GBP')} onConvert={() => handleOpenConvert(activeCurrencies[0]?.code ?? 'GBP', activeCurrencies[1]?.code ?? activeCurrencies[0]?.code ?? 'GBP')} onSend={() => handleOpenSend(activeCurrencies[0]?.code ?? 'GBP')} onRequest={() => handleOpenRequest(activeCurrencies[0]?.code ?? 'GBP')} onPaymentLink={() => handleOpenPaymentLink(activeCurrencies[0]?.code ?? 'GBP')} />;
      }
      if (subPage.type === 'taxes-account') {
        return <CurrentAccount onNavigateCurrency={handleNavigateCurrencyFromTaxes} onNavigateCards={() => handleNavigate('Cards')} accountType={accountType} jar="taxes" onAdd={() => handleOpenAddMoney('GBP', t('home.taxes'), 'taxes')} onConvert={() => handleOpenConvert('GBP', 'EUR', t('home.taxes'), 'taxes', t('home.currentAccount'))} onSend={() => handleOpenSend('GBP', t('home.taxes'), 'taxes')} onRequest={() => handleOpenRequest('GBP', t('home.taxes'), 'taxes')} onPaymentLink={() => handleOpenPaymentLink('GBP', t('home.taxes'), 'taxes')} />;
      }
      if (subPage.type === 'currency') {
        const currencyList = subPage.jar === 'taxes' ? taxesCurrencies : (accountType === 'business' ? businessCurrencies : currencies);
        const secondCurrency = currencyList.find((c) => c.code !== subPage.code)?.code ?? subPage.code;
        return (
          <CurrencyPage
            code={subPage.code}
            onNavigateAccount={subPage.jar === 'taxes' ? handleNavigateTaxesAccount : handleNavigateSubAccount}
            accountType={accountType}
            jar={subPage.jar}
            onAdd={() => handleOpenAddMoney(subPage.code, subPage.jar === 'taxes' ? t('home.taxes') : undefined, subPage.jar as 'taxes' | undefined)}
            onConvert={() => handleOpenConvert(subPage.code, secondCurrency, subPage.jar === 'taxes' ? t('home.taxes') : undefined, subPage.jar as 'taxes' | undefined, subPage.jar === 'taxes' ? t('home.currentAccount') : undefined)}
            onSend={() => handleOpenSend(subPage.code, subPage.jar === 'taxes' ? t('home.taxes') : undefined, subPage.jar as 'taxes' | undefined)}
            onRequest={() => handleOpenRequest(subPage.code, subPage.jar === 'taxes' ? t('home.taxes') : undefined, subPage.jar as 'taxes' | undefined)}
            onPaymentLink={() => handleOpenPaymentLink(subPage.code, subPage.jar === 'taxes' ? t('home.taxes') : undefined, subPage.jar as 'taxes' | undefined)}
          />
        );
      }
    }

    switch (activeNavItem) {
      case 'Account': return <Account onBack={handleAccountBack} accountType={accountType} onSwitchAccount={handleSwitchAccount} />;
      case 'Cards': return <Cards accountType={accountType} />;
      case 'Transactions': return <Transactions accountType={accountType} />;
      case 'Payments': return <Payments accountType={accountType} onSend={() => handleOpenSend(accountType === 'business' ? businessHomeCurrency : consumerHomeCurrency)} onRequest={() => handleOpenRequest(accountType === 'business' ? businessHomeCurrency : consumerHomeCurrency)} onPaymentLink={() => handleOpenPaymentLink(accountType === 'business' ? businessHomeCurrency : consumerHomeCurrency)} />;
      case 'Recipients': return <Recipients accountType={accountType} />;
      case 'Insights': return <Insights accountType={accountType} />;
      case 'Team': return <Team />;
      default: return (
        <Home
          onNavigate={handleNavigate}
          onNavigateAccount={handleNavigateSubAccount}
          onNavigateCurrency={handleNavigateCurrencyFromHome}
          onNavigateTaxesAccount={handleNavigateTaxesAccount}
          onNavigateTaxesCurrency={handleNavigateTaxesCurrencyFromHome}
          accountType={accountType}
          onAddMoney={() => handleOpenAddMoney(accountType === 'business' ? businessHomeCurrency : consumerHomeCurrency)}
          onSend={() => handleOpenSend(accountType === 'business' ? businessHomeCurrency : consumerHomeCurrency)}
          onSendWithCurrency={(sourceCurrency: string, targetCurrency: string, sourceAmount?: string, targetAmount?: string) => {
            const parseSendAmt = (s?: string) => s ? parseFloat(s.replace(/,/g, '')) || undefined : undefined;
            setActiveFlow({
              type: 'send',
              defaultCurrency: sourceCurrency,
              accountLabel: t('home.currentAccount'),
              forcedReceiveCurrency: targetCurrency,
              prefillAmount: parseSendAmt(sourceAmount),
              prefillReceiveAmount: parseSendAmt(targetAmount),
              startStep: 'recipient',
            });
          }}
          onSendAgain={(recipient, amountStr) => {
            const homeCurrency = accountType === 'business' ? businessHomeCurrency : consumerHomeCurrency;
            const parsedCurrency = amountStr ? amountStr.split(' ').pop() ?? homeCurrency : (recipient.badgeFlagCode ?? homeCurrency);
            const parsedAmount = amountStr ? parseFloat(amountStr.replace(/,/g, '')) || undefined : undefined;
            handleOpenSend(parsedCurrency, undefined, undefined, recipient, parsedAmount);
          }}
          onRequest={() => handleOpenRequest(accountType === 'business' ? businessHomeCurrency : consumerHomeCurrency)}
          onPaymentLink={() => handleOpenPaymentLink(accountType === 'business' ? businessHomeCurrency : consumerHomeCurrency)}
        />
      );
    }
  };

  const flowBanner = <CriticalBannerBar placement="flow" />;

  return (
    <SnackbarProvider>
    {activeFlow ? (
      <>
        {import.meta.env.DEV && <Agentation />}
        <SpecViewer />
        {activeFlow.type === 'add-money' && (
          <AddMoneyFlow
            defaultCurrency={activeFlow.defaultCurrency}
            accountLabel={activeFlow.accountLabel}
            jar={activeFlow.jar}
            onClose={handleCloseFlow}
            accountType={accountType}
            avatarUrl={avatarUrl}
            initials={activeInitials}
            banner={flowBanner}
          />
        )}
        {activeFlow.type === 'convert' && (
          <ConvertFlow
            fromCurrency={activeFlow.fromCurrency}
            toCurrency={activeFlow.toCurrency}
            accountLabel={activeFlow.accountLabel}
            toAccountLabel={activeFlow.toAccountLabel}
            jar={activeFlow.jar}
            onClose={handleCloseFlow}
            accountType={accountType}
            avatarUrl={avatarUrl}
            initials={activeInitials}
            banner={flowBanner}
          />
        )}
        {activeFlow.type === 'send' && (
          <SendFlow
            defaultCurrency={activeFlow.defaultCurrency}
            accountLabel={activeFlow.accountLabel}
            jar={activeFlow.jar}
            onClose={handleCloseFlow}
            accountType={accountType}
            avatarUrl={avatarUrl}
            initials={activeInitials}
            recipient={activeFlow.recipient}
            prefillAmount={activeFlow.prefillAmount}
            prefillReceiveAmount={activeFlow.prefillReceiveAmount}
            startStep={activeFlow.startStep}
            forcedReceiveCurrency={activeFlow.forcedReceiveCurrency}
            banner={flowBanner}
          />
        )}
        {activeFlow.type === 'request' && (
          <RequestFlow
            defaultCurrency={activeFlow.defaultCurrency}
            accountLabel={activeFlow.accountLabel}
            jar={activeFlow.jar}
            onClose={handleCloseFlow}
            accountType={accountType}
            avatarUrl={avatarUrl}
            initials={activeInitials}
            banner={flowBanner}
          />
        )}
        {activeFlow.type === 'payment-link' && (
          <PaymentLinkFlow
            defaultCurrency={activeFlow.defaultCurrency}
            accountLabel={activeFlow.accountLabel}
            jar={activeFlow.jar}
            onClose={handleCloseFlow}
            accountType={accountType}
            avatarUrl={avatarUrl}
            initials={activeInitials}
            banner={flowBanner}
          />
        )}
        <PrototypeSettings />
      </>
    ) : (
      <div className="page-layout">
          <CriticalBannerBar placement="page" />
          {import.meta.env.DEV && <Agentation />}
          <div className="column-layout">
            <div className="sidebar-container column-layout-left">
              <div className="nav-sidebar">
                {sideNavContent}
              </div>
            </div>
            <div className={`column-layout-main${showBackClass}${mobileBackClass}`}>
              <div className="container container--fluid">
                <TopBar name={activeName} initials={activeInitials} avatarUrl={avatarUrl} onMenuToggle={() => setIsMobileMenuOpen(true)} onAccountClick={handleAccountClick} showBack={showBack} onBack={handleBack} hideAccountSwitcher={activeNavItem === "Account"} />
              </div>
              <main className="container-content" id="main">
                <div className="container container--standard">
                  {renderContent()}
                </div>
              </main>
            </div>
          </div>

          <SidebarOverlay isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)}>
            <div className="nav-sidebar">
              {sideNavContent}
            </div>
          </SidebarOverlay>

          <MobileNav activeItem={activeNavItem} onSelect={handleNavigate} />
          <PrototypeSettings />
          <SpecViewer />
        </div>
    )}
    </SnackbarProvider>
  );
}

function App() {
  return (
    <LanguageProvider>
      <PrototypeNamesProvider>
        <LiveRatesProvider>
          <ShimmerProvider>
            <CriticalBannerProvider>
              <AppInner />
            </CriticalBannerProvider>
          </ShimmerProvider>
        </LiveRatesProvider>
      </PrototypeNamesProvider>
    </LanguageProvider>
  );
}

export default App;
