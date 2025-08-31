'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

export interface LoaderProps {
  bgSrc?: string;
  duration?: number;           
  bgImageClassName?: string;
  onFinish?: () => void;
  progress?: number;           
  dismissible?: boolean;       
}

const Loader: React.FC<LoaderProps> = ({
  bgSrc = '/images/banner1.png',
  duration = 4000,
  bgImageClassName = 'scale-110 blur-3xl',
  onFinish,
  progress,
  dismissible = true,
}) => {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);
  const fadeTimerRef = useRef<number | null>(null);
  const hideTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!visible) return;
    const root = document.documentElement;
    root.classList.add('overflow-hidden');
    return () => root.classList.remove('overflow-hidden');
  }, [visible]);

  useEffect(() => {
    if (!visible) return;
    if (typeof progress === 'number') return; 

    fadeTimerRef.current = window.setTimeout(() => setFading(true), Math.max(0, duration - 320));
    hideTimerRef.current = window.setTimeout(() => {
      setVisible(false);
      onFinish?.();
    }, duration);

    return () => {
      if (fadeTimerRef.current) window.clearTimeout(fadeTimerRef.current);
      if (hideTimerRef.current) window.clearTimeout(hideTimerRef.current);
    };
  }, [duration, onFinish, progress, visible]);

  useEffect(() => {
    if (!visible) return;
    if (typeof progress !== 'number') return;
    if (progress >= 1) {
      setFading(true);
      const t = window.setTimeout(() => {
        setVisible(false);
        onFinish?.();
      }, 300);
      return () => window.clearTimeout(t);
    }
  }, [progress, onFinish, visible]);

  useEffect(() => {
    if (!dismissible || !visible) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setFading(true);
        const t = window.setTimeout(() => {
          setVisible(false);
          onFinish?.();
        }, 300);
        return () => window.clearTimeout(t);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [dismissible, onFinish, visible]);

  if (!visible) return null;

  const barWidth =
    typeof progress === 'number'
      ? `${Math.min(100, Math.max(0, progress * 100))}%`
      : undefined;

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-black transition-opacity duration-300 ${
        fading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      aria-busy="true"
      aria-live="polite"
      role="status"
    >
      <div className="absolute inset-2">
        <Image
          src={bgSrc}
          alt=""
          fill
          priority
          sizes="100vw"
          className={`object-cover ${bgImageClassName}`}
        />
        <div className="absolute inset-0 bg-black/45" />
      </div>

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-[220px] h-[220px]">
          <div className="absolute -inset-6 rounded-full bg-[radial-gradient(circle,rgba(255,80,80,0.35),rgba(255,80,80,0)_60%)] blur-2xl animate-pulseGlow" />

          <svg className="absolute inset-0 m-auto w-full h-full animate-spinSlow" viewBox="0 0 200 200">
            <defs>
              <linearGradient id="ring" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#fff" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#fff" stopOpacity="0.2" />
              </linearGradient>
            </defs>
            <circle
              cx="100"
              cy="100"
              r="82"
              fill="none"
              stroke="url(#ring)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="60 24 16 12 8 6 4 2"
            />
          </svg>

          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              className="w-24 h-24 animate-floatDrop drop-shadow-[0_0_30px_rgba(255,90,90,0.65)]"
              viewBox="0 0 64 64"
            >
              <defs>
                <radialGradient id="dropGrad" cx="50%" cy="60%" r="65%">
                  <stop offset="0%" stopColor="#ff6a6a" />
                  <stop offset="60%" stopColor="#ff3838" />
                  <stop offset="100%" stopColor="#bb1111" />
                </radialGradient>
                <linearGradient id="spec" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#fff" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="#fff" stopOpacity="0.1" />
                </linearGradient>
              </defs>
              <path
                d="M32 6c8 12 18 20 18 32 0 9.941-8.059 18-18 18S14 47.941 14 38c0-12 10-20 18-32z"
                fill="url(#dropGrad)"
              />
              <path
                d="M25 19c4 3 7 7 7 12 0 6-5 10-10 10-3 0-6-2-7-5"
                fill="none"
                stroke="url(#spec)"
                strokeWidth="3"
                strokeLinecap="round"
                opacity="0.7"
              />
            </svg>
          </div>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-16 flex flex-col items-center gap-4 px-6">
        <p className="text-white/90 text-lg tracking-[0.25em]">BLOOD&nbsp;MATE</p>

        <div className="w-72 h-1.5 rounded-full bg-white/15 overflow-hidden" aria-hidden={typeof progress !== 'number'}>
          <div
            className={`h-full ${typeof progress === 'number' ? '' : 'animate-loaderBar'} bg-gradient-to-r from-white via-white to-white/60`}
            style={typeof progress === 'number' ? { width: barWidth } : undefined}
          />
        </div>

        <p className="text-white/70 text-sm">
          {typeof progress === 'number' ? `Loading ${Math.round((progress || 0) * 100)}%` : 'Matching donors'}
          <span className={typeof progress === 'number' ? '' : 'animate-dots'}>...</span>
        </p>

        {dismissible && (
          <p className="text-white/50 text-xs mt-1">(Press Esc to skip)</p>
        )}
      </div>

      <style jsx global>{`
        @media (prefers-reduced-motion: reduce) {
          .animate-spinSlow,
          .animate-pulseGlow,
          .animate-floatDrop,
          .animate-loaderBar {
            animation: none !important;
          }
        }

        @keyframes spinSlow { to { transform: rotate(360deg); } }
        .animate-spinSlow { animation: spinSlow 3.2s linear infinite; }

        @keyframes pulseGlow {
          0%, 100% { opacity: 0.7; transform: scale(0.98); }
          50% { opacity: 1; transform: scale(1.03); }
        }
        .animate-pulseGlow { animation: pulseGlow 1.8s ease-in-out infinite; }

        @keyframes floatDrop {
          0%, 100% { transform: translateY(0); filter: drop-shadow(0 0 30px rgba(255,90,90,0.65)); }
          50% { transform: translateY(-8px); filter: drop-shadow(0 0 45px rgba(255,100,100,0.8)); }
        }
        .animate-floatDrop { animation: floatDrop 2.6s ease-in-out infinite; }

        @keyframes loaderBar {
          0% { width: 0%; transform: translateX(-20%); }
          60% { width: 85%; transform: translateX(0%); }
          100% { width: 100%; transform: translateX(5%); }
        }
        .animate-loaderBar { animation: loaderBar 2.8s ease-in-out infinite; }

        @keyframes dots {
          0% { content: ''; }
          33% { content: '.'; }
          66% { content: '..'; }
          100% { content: '...'; }
        }
        .animate-dots::after {
          display: inline-block;
          width: 1.5em;
          text-align: left;
          animation: dots 1.2s steps(3, end) infinite;
          content: '';
        }
      `}</style>
    </div>
  );
};

export default Loader;
