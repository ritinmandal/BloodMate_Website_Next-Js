// components/WaveSeparator.tsx
'use client';

import React from 'react';

type WaveSeparatorProps = {
  className?: string;
  primaryColor?: string;
  backgroundColor?: string; 
  height?: number; 
  position?: 'absolute' | 'static';
};

export default function WaveSeparator({
  className = '',
  primaryColor = '#E10000',
  backgroundColor = '#6c0303ff',
  height = 70,
  position = 'absolute',
}: WaveSeparatorProps) {
  const wrapperClasses =
    (position === 'absolute' ? 'wave-abs' : 'wave-static') +
    (className ? ` ${className}` : '');

  return (
    <div
      className={`wave-wrapper ${wrapperClasses}`}
      style={
        {
          ['--wave-color' as any]: primaryColor,
          ['--bg-color' as any]: backgroundColor,
          ['--wave-height' as any]: `${height}px`,
        } as React.CSSProperties
      }
      aria-hidden="true"
    >
      <svg
        className="editorial"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        viewBox="0 24 150 28"
        preserveAspectRatio="none"
      >
        <defs>
          <path
            id="gentle-wave"
            d="M-160 44c30 0 
                58-18 88-18s
                58 18 88 18 
                58-18 88-18 
                58 18 88 18
                v44h-352z"
          />
        </defs>

        <g className="parallax1">
          <use xlinkHref="#gentle-wave" x="50" y="3" className="fill-1" />
        </g>
        <g className="parallax2">
          <use xlinkHref="#gentle-wave" x="50" y="0" className="fill-2" />
        </g>
        <g className="parallax3">
          <use xlinkHref="#gentle-wave" x="50" y="9" className="fill-3" />
        </g>
        <g className="parallax4">
          <use xlinkHref="#gentle-wave" x="50" y="6" className="fill-4" />
        </g>
      </svg>

      <style jsx>{`
        .wave-wrapper {
          margin: 0;
          padding: 0;
        
          
    
          background-color: var(--bg-color);
          width: 100%;
        }

        .wave-abs {
          position: relative;
          height: var(--wave-height);
        }

        .wave-abs .editorial {
          position: absolute;
          bottom: 0;
          left: 0;
        }

        .wave-static .editorial {
          position: relative;
          left: 0;
        }

        .editorial {
          display: block;
          width: 100%;
          height: var(--wave-height);
          max-height: var(--wave-height);
          margin: 0;
          z-index: 5;
        }

        .fill-1 {
          fill: var(--wave-color);
          opacity: 0.9;
        }
        .fill-2 {
          fill: var(--wave-color);
          opacity: 0.65;
        }
        .fill-3 {
          fill: var(--wave-color);
          opacity: 0.45;
        }
        .fill-4 {
          fill: #ffffff;
        }

        .parallax1 > use {
          animation: move-forever1 10s linear infinite;
          animation-delay: -2s;
        }
        .parallax2 > use {
          animation: move-forever2 8s linear infinite;
          animation-delay: -2s;
        }
        .parallax3 > use {
          animation: move-forever3 6s linear infinite;
          animation-delay: -2s;
        }
        .parallax4 > use {
          animation: move-forever4 4s linear infinite;
          animation-delay: -2s;
        }

        @keyframes move-forever1 {
          0% {
            transform: translate(85px, 0%);
          }
          100% {
            transform: translate(-90px, 0%);
          }
        }
        @keyframes move-forever2 {
          0% {
            transform: translate(-90px, 0%);
          }
          100% {
            transform: translate(85px, 0%);
          }
        }
        @keyframes move-forever3 {
          0% {
            transform: translate(85px, 0%);
          }
          100% {
            transform: translate(-90px, 0%);
          }
        }
        @keyframes move-forever4 {
          0% {
            transform: translate(-90px, 0%);
          }
          100% {
            transform: translate(85px, 0%);
          }
        }
      `}</style>
    </div>
  );
}
