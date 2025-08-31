
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Heart, Stethoscope, Users, Building2 } from 'lucide-react';
import { Playfair_Display } from 'next/font/google';

const playfair = Playfair_Display({ subsets: ['latin'], weight: ['700'] });

type Stat = {
  label: string;
  value: number;
  icon: React.ReactNode;
};

export default function StatsCounterSection() {
  const stats: Stat[] = [
    { label: 'SUCCESS SMILE', value: 2578, icon: <Heart className="w-8 h-8 text-gray-500" /> },
    { label: 'HAPPY DONORS', value: 3235, icon: <Stethoscope className="w-8 h-8 text-gray-500" /> },
    { label: 'HAPPY RECIPIENT', value: 3568, icon: <Users className="w-8 h-8 text-gray-500" /> },
    { label: 'TOTAL AWARDS', value: 1364, icon: <Building2 className="w-8 h-8 text-gray-500" /> },
  ];

  const [start, setStart] = useState(false);
  const sectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) setStart(true);
        else setStart(false);
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative bg-fixed bg-center bg-cover min-h-screen flex items-center"
      style={{ backgroundImage: "url('/images/banner1.png')" }}
    >
      <div className="absolute inset-0 bg-black/40" /> {/* dark overlay */}
      <div className="relative mx-auto max-w-6xl px-4 w-full">
    
        <h2
          className={`${playfair.className} mb-12 text-center text-3xl sm:text-4xl font-extrabold tracking-tight text-white`}
        >
          Impact in Numbers
        </h2>

        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {stats.map((s, i) => (
            <li key={i} className="bg-white shadow-lg rounded-md py-10 px-6">
              <div className="flex justify-center mb-4">{s.icon}</div>
              <CountUp
                start={start}
                end={s.value}
                durationMs={3000}
                className={`${playfair.className} text-4xl font-bold  text-red-500`}
              />
              <p className={`${playfair.className} mt-2 text-lg  font-semibold text-gray-800 uppercase tracking-wide`}>
                {s.label}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function CountUp({
  start,
  end,
  durationMs = 3000,
  className,
}: {
  start: boolean;
  end: number;
  durationMs?: number;
  className?: string;
}) {
  const [display, setDisplay] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!start) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      setDisplay(0);
      return;
    }
    const t0 = performance.now();
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    const loop = (now: number) => {
      const elapsed = now - t0;
      const p = Math.min(1, elapsed / durationMs);
      const eased = easeOutCubic(p);
      const current = Math.round(end * eased);
      setDisplay(current);
      if (p < 1) rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [start, end, durationMs]);

  return <div className={className}>{display}</div>;
}
