import { FlowNavigation, Button } from '@transferwise/components';
import { Eye, EyeShut } from '@transferwise/icons';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { ReactNode } from 'react';

type Props = {
  activeStep: number;
  steps: readonly { label: string; onClick?: () => void }[];
  onClose: () => void;
  onGoBack?: () => void;
  avatar: ReactNode;
  logo: ReactNode;
};

export function FlowNavigationWithSpecs({ activeStep, steps, onClose, onGoBack, avatar, logo }: Props) {
  const [btnLeft, setBtnLeft] = useState<number | null>(null);
  const [btnTop, setBtnTop] = useState<number | null>(null);
  const [specsVisible, setSpecsVisible] = useState(() => window.__specsVisible || false);
  const rafRef = useRef<number>(0);
  const btnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: Event) => setSpecsVisible((e as CustomEvent<boolean>).detail);
    window.addEventListener('specsvisibilitychange', handler);
    return () => window.removeEventListener('specsvisibilitychange', handler);
  }, []);

  useEffect(() => {
    const update = () => {
      // Position button 16px to the left of the avatar (first child of __right)
      const rightEl = document.querySelector('.np-flow-header__right');
      if (rightEl) {
        const avatarEl = rightEl.firstElementChild;
        if (avatarEl) {
          const avatarRect = avatarEl.getBoundingClientRect();
          const btnWidth = btnRef.current?.offsetWidth ?? 0;
          setBtnLeft(avatarRect.left - 16 - btnWidth);
          setBtnTop(avatarRect.top + avatarRect.height / 2);
        }
      }
      rafRef.current = requestAnimationFrame(update);
    };
    rafRef.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <>
      <FlowNavigation
        activeStep={activeStep}
        steps={steps}
        onClose={onClose}
        onGoBack={onGoBack}
        avatar={avatar}
        logo={logo}
      />
      {createPortal(
        <div
          ref={btnRef}
          style={{
            position: 'fixed',
            left: btnLeft ?? -9999,
            top: btnTop ?? -9999,
            transform: 'translateY(-50%)',
            zIndex: 10001,
          }}
        >
          <Button
            v2
            size="sm"
            priority="secondary-neutral"
            onClick={() => (window as any).__toggleSpecs?.()}
            addonStart={{ type: 'icon', value: specsVisible ? <Eye size={16} /> : <EyeShut size={16} /> }}
          >
            Spec
          </Button>
        </div>,
        document.body
      )}
    </>
  );
}
