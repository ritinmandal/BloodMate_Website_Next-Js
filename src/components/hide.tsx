'use client';
import { useEffect } from 'react';

export default function HideNextOverlay() {
  useEffect(() => {
    const hide = () => {
      const selectors = [
        // common Next dev indicators / overlays across versions
        '#__next-dev-indicator',
        '#nextjs__buildIndicator',
        '#nextjs__container',
        '#nextjs__overlay',
        '#nextjs__error-overlay',
        '#nextjs__toast',
        '[data-nextjs-toast]',
        '[data-nextjs-error-overlay]',
        '[data-nextjs-build-watcher]',
      ];
      document.querySelectorAll(selectors.join(',')).forEach((el) => {
        const e = el as HTMLElement;
        e.style.display = 'none';
        e.style.visibility = 'hidden';
        e.style.pointerEvents = 'none';
        e.style.opacity = '0';
        e.setAttribute('aria-hidden', 'true');
      });
    };

    hide(); // hide anything already mounted
    const obs = new MutationObserver(hide);
    obs.observe(document.documentElement, { childList: true, subtree: true });
    return () => obs.disconnect();
  }, []);

  return null;
}
