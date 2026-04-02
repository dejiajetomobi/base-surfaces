import { useState, useRef, useEffect } from 'react';
import { ActionPrompt } from '@transferwise/components';

import './CriticalBanner.css';

export const CriticalBanner = () => {
    const [collapsed, setCollapsed] = useState(false);
    const bannerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!bannerRef.current) return;
        const banner = bannerRef.current;
        const surface = banner.querySelector('.wds-sentiment-surface') as HTMLElement;

        // Propagate the banner's sentiment background-surface to .page-layout
        if (surface) {
            const bg = getComputedStyle(surface).getPropertyValue('--color-sentiment-background-surface').trim();
            const pageLayout = banner.closest('.page-layout') as HTMLElement;
            if (pageLayout && bg) {
                pageLayout.style.setProperty('--critical-banner-bg', bg);
            }
        }

        // Start with banner collapsed (0 height)
        banner.style.height = '0px';
        banner.style.overflow = 'hidden';

        // After 500ms, animate to full height
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
    }, []);

    return (
        <div ref={bannerRef}>
            <ActionPrompt
                sentiment="negative"
                className={`critical-banner wds-sentiment-surface-negative-elevated${collapsed ? ' critical-banner--collapsed' : ''}`}
                title="Your account is restricted."
                description="Review your personal details to get your account active again. "
                action={{ label: 'Review details', onClick: () => {} }}
                onDismiss={() => setCollapsed(!collapsed)}
            />
        </div>
    );
}