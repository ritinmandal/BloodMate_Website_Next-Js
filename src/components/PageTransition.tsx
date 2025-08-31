'use client';

import { useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

type Variant = 'horizontal' | 'vertical' | 'diagonal';

const COLOR_MAP: Record<string, string> = {
  '/': '#00000070',
  '/signup': '#00000070',
  '/donations': '#00000070',
  '/about': '#00000070',
  '/contact': '#00000070',
};

function getBrand(path: string) {
  if (COLOR_MAP[path]) return COLOR_MAP[path];
  const seg = '/' + (path.split('/')[1] ?? '');
  return COLOR_MAP[seg] ?? '#00000070';
}

export default function PageTransition({
  children,
  variant = 'horizontal',
  duration = 1,
}: {
  children: React.ReactNode;
  variant?: Variant;
  duration?: number;
}) {
  const pathname = usePathname();
  const brand = useMemo(() => getBrand(pathname), [pathname]);
  const reduced = useReducedMotion();
  if (reduced) return <>{children}</>;

  const ease = [0.8, 0, 0.2, 1] as const;
  const base =
    'pointer-events-none fixed inset-0 z-[10000] will-change-transform [transform:translateZ(0)] [contain:layout_paint_style]';

  const overlay =
    variant === 'horizontal' ? (
      <motion.div
        key={`${pathname}-h`}
        className={base}
        style={{ background: brand }}
        initial={{ x: '100%' }}
        animate={{ x: '100%' }}
        exit={{ x: '-100%' }}
        transition={{ duration, ease }}
      />
    ) : variant === 'vertical' ? (
      <motion.div
        key={`${pathname}-v`}
        className={base}
        style={{ background: brand }}
        initial={{ y: '-100%' }}
        animate={{ y: '-100%' }}
        exit={{ y: '100%' }}
        transition={{ duration, ease }}
      />
    ) : (
      <motion.div
        key={`${pathname}-d`}
        className={base}
        style={{ background: brand, transformOrigin: 'left center' }}
        initial={{ x: '120%', rotate: -8 }}
        animate={{ x: '120%', rotate: -8 }}
        exit={{ x: '-120%', rotate: -8 }}
        transition={{ duration, ease }}
      />
    );

  return (
    <div className="relative">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.28, ease: 'easeOut' } }}
          exit={{ opacity: 0, y: -4, transition: { duration: 0.2, ease: 'easeIn' } }}
        >
          {children}
        </motion.div>
      </AnimatePresence>


      <AnimatePresence initial={false}>{overlay}</AnimatePresence>
    </div>
  );
}
