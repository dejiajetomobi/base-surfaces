import { useState, useRef, useEffect, createContext, useContext, type ReactNode } from 'react';
import { ActionPrompt } from '@transferwise/components';

import './CriticalBanner.css';

const useIsMobile = () => {
    const [isMobile, setIsMobile] = useState(() => window.matchMedia('(max-width: 767px)').matches);
    useEffect(() => {
        const mq = window.matchMedia('(max-width: 767px)');
        const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
        mq.addEventListener('change', handler);
        return () => mq.removeEventListener('change', handler);
    }, []);
    return isMobile;
};

/* ---- Shared state context ---- */

type BannerState = {
    collapsed: boolean;
    setCollapsed: (v: boolean) => void;
    hasAnimated: boolean;
};

const BannerContext = createContext<BannerState>({
    collapsed: false,
    setCollapsed: () => {},
    hasAnimated: false,
});

export const CriticalBannerProvider = ({ children }: { children: ReactNode }) => {
    const [collapsed, setCollapsed] = useState(false);
    const [hasAnimated, setHasAnimated] = useState(false);

    // Mark animation as complete after the initial reveal
    useEffect(() => {
        const timer = setTimeout(() => setHasAnimated(true), 1000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <BannerContext.Provider value={{ collapsed, setCollapsed, hasAnimated }}>
            {children}
        </BannerContext.Provider>
    );
};

/* ---- Banner bar (rendered in multiple places, shares state via context) ---- */

type BannerBarProps = {
    /** 'page' = root pages (sticky), 'flow' = inside a flow div */
    placement: 'page' | 'flow';
};

export const CriticalBannerBar = ({ placement }: BannerBarProps) => {
    const { collapsed, setCollapsed, hasAnimated } = useContext(BannerContext);
    const bannerRef = useRef<HTMLDivElement>(null);
    const isMobile = useIsMobile();

    // Reveal animation on first mount (only for 'page' placement, and only once)
    useEffect(() => {
        if (placement !== 'page' || hasAnimated) return;
        const banner = bannerRef.current;
        if (!banner) return;

        banner.style.height = '0px';
        banner.style.overflow = 'hidden';

        const timer = setTimeout(() => {
            const fullHeight = banner.scrollHeight;
            banner.style.transition = 'height 400ms cubic-bezier(0.3, 0, 0.1, 1)';
            banner.style.height = `${fullHeight}px`;

            const onEnd = () => {
                banner.style.height = '';
                banner.style.overflow = '';
                banner.style.transition = '';
                banner.removeEventListener('transitionend', onEnd);
            };
            banner.addEventListener('transitionend', onEnd);
        }, 500);

        return () => clearTimeout(timer);
    }, [placement, hasAnimated]);

    // Track banner height (page only) so sidebar can offset itself
    useEffect(() => {
        if (placement !== 'page') return;
        const banner = bannerRef.current;
        if (!banner) return;

        const update = () => {
            const h = banner.getBoundingClientRect().height;
            document.documentElement.style.setProperty('--critical-banner-height', `${h}px`);
        };

        const ro = new ResizeObserver(update);
        ro.observe(banner);
        update();

        return () => {
            ro.disconnect();
            document.documentElement.style.setProperty('--critical-banner-height', '0px');
        };
    }, [placement]);

    // Mobile only: apply sentiment bg to the parent container (page-layout or flow div)
    useEffect(() => {
        if (!isMobile) return;
        const banner = bannerRef.current;
        if (!banner) return;

        const surface = banner.querySelector('.wds-sentiment-surface') as HTMLElement;
        if (!surface) return;

        const bg = getComputedStyle(surface).getPropertyValue('--color-sentiment-background-surface').trim();
        if (!bg) return;

        const target = placement === 'page'
            ? banner.closest('.page-layout') as HTMLElement
            : banner.parentElement as HTMLElement;

        if (target) target.style.background = bg;

        return () => {
            if (target) target.style.background = '';
        };
    }, [placement, isMobile]);

    return (
        <div
            ref={bannerRef}
            className={`critical-banner-bar critical-banner-bar--${placement}`}
        >
            <ActionPrompt
                sentiment="negative"
                className={`critical-banner wds-sentiment-surface-negative-elevated${collapsed ? ' critical-banner--collapsed' : ''}`}
                title="Your account is restricted."
                description="Review your personal details to get your account active again. "
                action={{ label: 'Review details', onClick: () => {} }}
                onDismiss={isMobile ? () => {
                    setCollapsed(!collapsed);
                } : undefined}
            />
        </div>
    );
};
