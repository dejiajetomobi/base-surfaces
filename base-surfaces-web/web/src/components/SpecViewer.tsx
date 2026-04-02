import { useState, useEffect } from 'react';

// Persistent state stored on window
declare global {
  interface Window {
    __specsVisible?: boolean;
  }
}

export function SpecViewer() {
  const [isVisible, setIsVisible] = useState(() => window.__specsVisible || false);
  const [bounds, setBounds] = useState({
    viewport: { width: 0, height: 0 },
    isFlowPage: false,
    nav: null as DOMRect | null,
    main: null as DOMRect | null,
    topBar: null as DOMRect | null,
    fluidContainer: null as DOMRect | null,
    standardContainer: null as DOMRect | null,
    narrowContainer: null as DOMRect | null,
    compactContainer: null as DOMRect | null,
  });

  // Keep window state in sync and notify listeners
  useEffect(() => {
    window.__specsVisible = isVisible;
    window.dispatchEvent(new CustomEvent('specsvisibilitychange', { detail: isVisible }));
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    let rafId: number;

    const updateBounds = () => {
      // Check if we're on a flow page (different structure)
      const isFlowPage = document.querySelector('.np-flow-navigation') !== null;

      const nav = document.querySelector('.column-layout-left');
      const main = isFlowPage ? document.body : document.querySelector('.column-layout-main');
      const topBar = isFlowPage
        ? document.querySelector('.np-flow-navigation')
        : document.querySelector('.top-bar');
      const fluidContainer = isFlowPage
        ? document.querySelector('.np-flow-header')
        : document.querySelector('.container--fluid');
      const standardContainer = document.querySelector('.container--standard');
      const narrowContainer = document.querySelector('.container--narrow');
      // For compact, find the first one that's visible in the viewport (flow pages can have multiple off-screen)
      const compactEls = Array.from(document.querySelectorAll('.container--compact'));
      const visibleCompact = compactEls.find(el => {
        const r = el.getBoundingClientRect();
        return r.width > 0 && r.right > 0 && r.left < window.innerWidth;
      }) || document.querySelector('.payment-link-flow__body');
      const compactContainer = visibleCompact;

      setBounds({
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight,
        },
        isFlowPage,
        nav: nav?.getBoundingClientRect() || null,
        main: main?.getBoundingClientRect() || null,
        topBar: topBar?.getBoundingClientRect() || null,
        fluidContainer: fluidContainer?.getBoundingClientRect() || null,
        standardContainer: standardContainer?.getBoundingClientRect() || null,
        narrowContainer: narrowContainer?.getBoundingClientRect() || null,
        compactContainer: compactContainer?.getBoundingClientRect() || null,
      });

      // Continuously update to stay in sync with DOM
      rafId = requestAnimationFrame(updateBounds);
    };

    // Start continuous update loop
    rafId = requestAnimationFrame(updateBounds);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [isVisible]);

  // Expose toggle function globally so TopBar can access it
  useEffect(() => {
    (window as any).__toggleSpecs = () => setIsVisible(v => !v);
    return () => {
      delete (window as any).__toggleSpecs;
    };
  }, []);

  if (!isVisible) return null;

  const isFlowPage = bounds.isFlowPage;

  // For regular pages, we need nav/main. For flow pages, we just need the standard container
  if (!isFlowPage && (!bounds.nav || !bounds.main)) return null;
  if (isFlowPage && !bounds.compactContainer && !bounds.standardContainer && !bounds.narrowContainer) return null;

  const navWidth = bounds.nav ? Math.round(bounds.nav.width) : 0;
  const viewportWidth = window.innerWidth;
  const isXL = viewportWidth >= 1160;
  const visibleWidth = document.documentElement.clientWidth;

  // Get fluid container padding (header)
  let fluidPaddingLeft = 0;
  let fluidPaddingRight = 0;
  if (bounds.fluidContainer) {
    const fluidEl = isFlowPage
      ? document.querySelector('.np-flow-header')
      : document.querySelector('.container--fluid');
    if (fluidEl) {
      const styles = window.getComputedStyle(fluidEl);
      fluidPaddingLeft = Math.round(parseFloat(styles.paddingLeft));
      fluidPaddingRight = Math.round(parseFloat(styles.paddingRight));
    }
  }

  // Get content container — prefer standard, fall back to compact (flow pages), then narrow
  const contentContainer = bounds.standardContainer || bounds.compactContainer || bounds.narrowContainer;
  const contentContainerType: 'standard' | 'narrow' | 'compact' | null =
    bounds.standardContainer ? 'standard' :
    bounds.narrowContainer ? 'narrow' :
    bounds.compactContainer ? 'compact' : null;
  const containerTypeLabel = contentContainerType === 'standard' ? 'Standard container (1160)' :
    contentContainerType === 'narrow' ? 'Narrow container (840)' :
    contentContainerType === 'compact' ? 'Compact container (600)' : '';
  const containerTypeBg = contentContainerType === 'standard' ? '#FFD7EF' :
    contentContainerType === 'narrow' ? '#FFEB69' :
    contentContainerType === 'compact' ? '#FFC091' : '';
  const compactEls2 = Array.from(document.querySelectorAll('.container--compact'));
  const visibleCompactEl = compactEls2.find(el => {
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.right > 0 && r.left < window.innerWidth;
  });
  const contentContainerEl = document.querySelector('.container--standard') || visibleCompactEl || document.querySelector('.container--narrow');

  // Get standard container padding (content)
  let standardPaddingLeft = 0;
  let standardPaddingRight = 0;
  if (contentContainer && contentContainerEl) {
    const styles = window.getComputedStyle(contentContainerEl);
    standardPaddingLeft = Math.round(parseFloat(styles.paddingLeft));
    standardPaddingRight = Math.round(parseFloat(styles.paddingRight));
  }

  const contentWidth = contentContainer
    ? Math.round(contentContainer.width - standardPaddingLeft - standardPaddingRight)
    : 0;

  // On flow pages, clamp content lines/bg to start at topBar.bottom (header is fixed)
  const contentLineTop = isFlowPage && bounds.topBar
    ? Math.max(contentContainer ? contentContainer.top : 0, bounds.topBar.bottom)
    : (contentContainer ? contentContainer.top : 0);
  const contentLineHeight = contentContainer
    ? contentContainer.height - (contentLineTop - contentContainer.top)
    : 0;

  // Pin content spec row 24px from container top, sticky at 24px from viewport top when scrolled
  // On flow pages the top bar is fixed so use topBar.bottom as anchor, on root pages use 24 (top bar scrolls)
  const contentSpecPinTop = isFlowPage && bounds.topBar ? bounds.topBar.bottom + 24 : 24;
  const contentSpecTop = contentContainer
    ? Math.max(contentContainer.top + 24, contentSpecPinTop)
    : 0;

  return (
    <>
    {/* Dim overlay - sits between content and specs */}
    <div className="spec-dim-overlay" />

    {/* Container background overlays */}
    {bounds.fluidContainer && (
      <div className="spec-container-bg spec-container-bg--fluid" style={{
        left: bounds.fluidContainer.left,
        top: bounds.topBar ? bounds.topBar.top : bounds.fluidContainer.top,
        width: bounds.fluidContainer.width,
        height: bounds.topBar ? bounds.topBar.height : bounds.fluidContainer.height,
      }} />
    )}
    {bounds.standardContainer && (
      <div className="spec-container-bg spec-container-bg--standard" style={{
        left: bounds.standardContainer.left,
        top: bounds.standardContainer.top,
        width: bounds.standardContainer.width,
        height: bounds.standardContainer.height,
      }} />
    )}
    {bounds.narrowContainer && (
      <div className="spec-container-bg spec-container-bg--narrow" style={{
        left: bounds.narrowContainer.left,
        top: bounds.narrowContainer.top,
        width: bounds.narrowContainer.width,
        height: bounds.narrowContainer.height,
      }} />
    )}
    {bounds.compactContainer && (() => {
      const clampTop = isFlowPage && bounds.topBar ? bounds.topBar.bottom : bounds.compactContainer.top;
      const clampedTop = Math.max(bounds.compactContainer.top, clampTop);
      const clampedHeight = bounds.compactContainer.height - (clampedTop - bounds.compactContainer.top);
      return clampedHeight > 0 ? (
        <div className="spec-container-bg spec-container-bg--compact" style={{
          left: bounds.compactContainer.left,
          top: clampedTop,
          width: bounds.compactContainer.width,
          height: clampedHeight,
        }} />
      ) : null;
    })()}

    <div className="spec-viewer">
      {/* Viewport left boundary */}
      <div
        className="spec-line spec-line--solid spec-line--vertical"
        style={{
          left: 0,
          top: 0,
          height: '100%',
        }}
      />

      {/* Viewport right boundary */}
      <div
        className="spec-line spec-line--solid spec-line--vertical"
        style={{
          left: visibleWidth - 1,
          top: 0,
          height: '100%',
        }}
      />

      {/* Sidebar (XL only) */}
      {isXL && bounds.nav && (
        <>
          <div
            className="spec-line spec-line--solid spec-line--vertical"
            style={{
              left: bounds.nav.right,
              top: 0,
              height: '100%',
            }}
          />

          <div
            className="spec-arrow"
            style={{
              left: bounds.nav.left,
              top: bounds.nav.top + bounds.nav.height / 2,
              width: bounds.nav.width,
            }}
          />

          <div
            className="spec-badge spec-badge--component"
            style={{
              left: bounds.nav.left + bounds.nav.width / 2,
              top: bounds.nav.top + bounds.nav.height / 2,
              transform: 'translate(-50%, -50%)',
            }}
          >
            Sidebar: {navWidth}
          </div>
        </>
      )}

      {/* Header (Fluid Container) */}
      {bounds.topBar && bounds.fluidContainer && bounds.main && (
        <>
          {/* Header bottom solid line */}
          <div
            className="spec-line spec-line--solid spec-line--horizontal"
            style={{
              left: bounds.main.left,
              top: bounds.topBar.bottom,
              width: bounds.main.width,
            }}
          />

          {/* Header measurement arrow - excludes padding */}
          <div
            className="spec-arrow"
            style={{
              left: bounds.fluidContainer.left + fluidPaddingLeft,
              top: bounds.topBar.top + 24,
              width: bounds.fluidContainer.width - fluidPaddingLeft - fluidPaddingRight,
            }}
          />

          {/* Header label - on top of arrow */}
          <div
            className="spec-badge spec-badge--component"
            style={{
              left: bounds.fluidContainer.left + fluidPaddingLeft + (bounds.fluidContainer.width - fluidPaddingLeft - fluidPaddingRight) / 2,
              top: bounds.topBar.top + 24,
              transform: 'translate(-50%, -50%)',
            }}
          >
            Header: {Math.round(bounds.fluidContainer.width - fluidPaddingLeft - fluidPaddingRight)}
          </div>

          {/* Container type badge - below header label */}
          <div
            className="spec-badge spec-badge--component"
            style={{
              left: bounds.fluidContainer.left + fluidPaddingLeft + (bounds.fluidContainer.width - fluidPaddingLeft - fluidPaddingRight) / 2,
              top: bounds.topBar.top + 24 + 32,
              transform: 'translate(-50%, -50%)',
              background: '#A0E1E1',
              color: '#0E0F0C',
            }}
          >
            Fluid container (100%)
          </div>

          {/* Header left padding - outer + inner dotted lines */}
          {fluidPaddingLeft > 0 && (
            <>
              <div
                className="spec-line spec-line--dotted spec-line--vertical"
                style={{
                  left: bounds.fluidContainer.left,
                  top: bounds.topBar.top,
                  height: bounds.topBar.height,
                }}
              />
              <div
                className="spec-line spec-line--dotted spec-line--vertical"
                style={{
                  left: bounds.fluidContainer.left + fluidPaddingLeft,
                  top: bounds.topBar.top,
                  height: bounds.topBar.height,
                }}
              />
              <div
                className="spec-badge spec-badge--margin"
                style={{
                  left: bounds.fluidContainer.left + fluidPaddingLeft / 2,
                  top: bounds.topBar.top + 24,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                {fluidPaddingLeft}
              </div>
            </>
          )}

          {/* Header right padding - outer + inner dotted lines */}
          {fluidPaddingRight > 0 && (
            <>
              <div
                className="spec-line spec-line--dotted spec-line--vertical"
                style={{
                  left: bounds.fluidContainer.right - fluidPaddingRight,
                  top: bounds.topBar.top,
                  height: bounds.topBar.height,
                }}
              />
              <div
                className="spec-line spec-line--dotted spec-line--vertical"
                style={{
                  left: bounds.fluidContainer.right,
                  top: bounds.topBar.top,
                  height: bounds.topBar.height,
                }}
              />
              <div
                className="spec-badge spec-badge--margin"
                style={{
                  left: bounds.fluidContainer.right - fluidPaddingRight / 2,
                  top: bounds.topBar.top + 24,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                {fluidPaddingRight}
              </div>
            </>
          )}
        </>
      )}

      {/* Content (Standard / Narrow / Compact Container) */}
      {contentContainer && (
        <>
          {/* Content top solid line */}
          <div
            className="spec-line spec-line--solid spec-line--horizontal"
            style={{
              left: contentContainer.left,
              top: contentLineTop,
              width: contentContainer.width,
              zIndex: isFlowPage ? 9997 : undefined,
            }}
          />

          {/* Content bottom solid line */}
          <div
            className="spec-line spec-line--solid spec-line--horizontal"
            style={{
              left: contentContainer.left,
              top: contentContainer.bottom,
              width: contentContainer.width,
              zIndex: isFlowPage ? 9997 : undefined,
            }}
          />

          {/* Content measurement arrow - excludes padding */}
          <div
            className="spec-arrow"
            style={{
              left: contentContainer.left + standardPaddingLeft,
              top: contentSpecTop,
              width: contentWidth,
              zIndex: isFlowPage ? 9997 : undefined,
            }}
          />

          {/* Content label - on top of arrow */}
          <div
            className="spec-badge spec-badge--component"
            style={{
              left: contentContainer.left + standardPaddingLeft + contentWidth / 2,
              top: contentSpecTop,
              transform: 'translate(-50%, -50%)',
              zIndex: isFlowPage ? 9997 : undefined,
            }}
          >
            Content: {contentWidth}
          </div>

          {/* Container type badge - 16px below content label */}
          {containerTypeLabel && (
            <div
              className="spec-badge spec-badge--component"
              style={{
                left: contentContainer.left + standardPaddingLeft + contentWidth / 2,
                top: contentSpecTop + 32,
                transform: 'translate(-50%, -50%)',
                background: containerTypeBg,
                color: '#0E0F0C',
                zIndex: isFlowPage ? 9997 : undefined,
              }}
            >
              {containerTypeLabel}
            </div>
          )}

          {/* Content left edge dotted line (container boundary - always shown when padding exists) */}
          {standardPaddingLeft > 0 && (
            <div
              className="spec-line spec-line--dotted spec-line--vertical"
              style={{
                left: contentContainer.left,
                top: contentLineTop,
                height: contentLineHeight,
                zIndex: isFlowPage ? 9997 : undefined,
              }}
            />
          )}

          {/* Content left padding dotted line (inner edge - always shown) */}
          {standardPaddingLeft > 0 && (
            <>
              <div
                className="spec-line spec-line--dotted spec-line--vertical"
                style={{
                  left: contentContainer.left + standardPaddingLeft,
                  top: contentLineTop,
                  height: contentLineHeight,
                  zIndex: isFlowPage ? 9997 : undefined,
                }}
              />
              <div
                className="spec-badge spec-badge--margin"
                style={{
                  left: contentContainer.left + standardPaddingLeft / 2,
                  top: contentSpecTop,
                  transform: 'translate(-50%, -50%)',
                  zIndex: isFlowPage ? 9997 : undefined,
                }}
              >
                {standardPaddingLeft}
              </div>
            </>
          )}

          {/* Content right padding dotted line (inner edge - always shown) */}
          {standardPaddingRight > 0 && (
            <>
              <div
                className="spec-line spec-line--dotted spec-line--vertical"
                style={{
                  left: contentContainer.right - standardPaddingRight,
                  top: contentLineTop,
                  height: contentLineHeight,
                  zIndex: isFlowPage ? 9997 : undefined,
                }}
              />
              <div
                className="spec-badge spec-badge--margin"
                style={{
                  left: contentContainer.right - standardPaddingRight / 2,
                  top: contentSpecTop,
                  transform: 'translate(-50%, -50%)',
                  zIndex: isFlowPage ? 9997 : undefined,
                }}
              >
                {standardPaddingRight}
              </div>
            </>
          )}

          {/* Content right edge dotted line (container boundary - always shown when padding exists) */}
          {standardPaddingRight > 0 && (
            <div
              className="spec-line spec-line--dotted spec-line--vertical"
              style={{
                left: contentContainer.right,
                top: contentLineTop,
                height: contentLineHeight,
                zIndex: isFlowPage ? 9997 : undefined,
              }}
            />
          )}
        </>
      )}

      {/* Breakpoint badge at bottom center */}
      <BreakpointBadge viewport={bounds.viewport} />
    </div>
    </>
  );
}

function BreakpointBadge({ viewport }: { viewport: { width: number; height: number } }) {

  const arrowTop = window.innerHeight - 24;
  const visibleWidth = document.documentElement.clientWidth;

  const breakpointName =
    viewport.width >= 1160 ? 'XL Breakpoint (≥1160px)' :
    viewport.width >= 840  ? 'LG Breakpoint (840–1159px)' :
    viewport.width >= 600  ? 'MD Breakpoint (600–839px)' :
                             'SM Breakpoint (<600px)';

  return (
    <>
      {/* Breakpoint arrow - spans full visible width (excludes scrollbar) */}
      <div
        className="spec-arrow"
        style={{
          left: 0,
          top: arrowTop,
          width: visibleWidth,
        }}
      />

      {/* Breakpoint badge - centered on arrow */}
      <div
        className="spec-badge spec-badge--component"
        style={{
          left: visibleWidth / 2,
          top: arrowTop,
          transform: 'translate(-50%, -50%)',
        }}
      >
        {breakpointName}: {viewport.width}px
      </div>
    </>
  );
}
