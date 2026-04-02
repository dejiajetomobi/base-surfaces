import { Button, AvatarView, IconButton } from '@transferwise/components';
import { ArrowLeft, ChevronRight, Eye, EyeShut, Menu } from '@transferwise/icons';
import { useState, useEffect } from 'react';
import { useLanguage } from '../context/Language';

export function TopBar({
  name,
  initials,
  avatarUrl,
  onMenuToggle,
  onAccountClick,
  showBack,
  onBack,
  hideAccountSwitcher,
}: {
  name: string;
  initials: string;
  avatarUrl?: string;
  onMenuToggle?: () => void;
  onAccountClick?: () => void;
  showBack?: boolean;
  onBack?: () => void;
  hideAccountSwitcher?: boolean;
}) {
  const { t } = useLanguage();
  const [specsVisible, setSpecsVisible] = useState(() => window.__specsVisible || false);

  useEffect(() => {
    const handler = (e: Event) => setSpecsVisible((e as CustomEvent<boolean>).detail);
    window.addEventListener('specsvisibilitychange', handler);
    return () => window.removeEventListener('specsvisibilitychange', handler);
  }, []);

  return (
    <header className="top-bar">
      <div className="top-bar__hamburger">
        <IconButton aria-label={t('topBar.openMenu')} priority="tertiary" onClick={onMenuToggle}>
          <Menu size={24} />
        </IconButton>
      </div>
      {showBack && (
        <div className="top-bar__back">
          <IconButton aria-label={t('topBar.goBack')} priority="tertiary" onClick={onBack}>
            <ArrowLeft size={24} />
          </IconButton>
        </div>
      )}
      <div className="top-bar__actions">
        <div style={{ position: 'relative', zIndex: 9999 }}>
          <Button
            v2
            size="sm"
            priority="secondary-neutral"
            onClick={() => (window as any).__toggleSpecs?.()}
            addonStart={{ type: 'icon', value: specsVisible ? <Eye size={16} /> : <EyeShut size={16} /> }}
          >
            Spec
          </Button>
        </div>
        {!hideAccountSwitcher && (
          <a href="/your-account" className="account-switcher" onClick={(e) => { e.preventDefault(); onAccountClick?.(); }}>
            {avatarUrl ? (
              <AvatarView size={48} profileName={name} imgSrc={avatarUrl} />
            ) : (
              <AvatarView size={48} profileName={name}>
                <span style={{ fontSize: 20 }}>{initials}</span>
              </AvatarView>
            )}
            <span className="account-switcher__name">{name}</span>
            <ChevronRight size={16} />
          </a>
        )}
      </div>
    </header>
  );
}
