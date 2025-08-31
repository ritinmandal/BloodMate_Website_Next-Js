'use client';

import { useEffect, useRef } from 'react';

type Step = {
  n: number;
  title: string;
  text: string;
  icon: JSX.Element;
};

const steps: Step[] = [
  {
    n: 1,
    title: 'Register',
    text: 'Create your profile and pick a convenient slot at a nearby camp/blood bank.',
    icon: (
      <path
        d="M16 21v-1a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v1M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M20 8v6M23 11h-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    n: 2,
    title: 'Screening',
    text: 'Quick vitals & eligibility check to ensure your and recipient’s safety.',
    icon: (
      <path
        d="M6 2v6a4 4 0 1 0 8 0V2M6 10v3a6 6 0 0 0 12 0v-1M20 17a3 3 0 1 1-3 3"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    n: 3,
    title: 'Donate',
    text: '8–12 minutes on a comfy chair. Monitored by trained phlebotomists.',
    icon: (
      <path
        d="M12 3S6 11 6 15a6 6 0 1 0 12 0c0-4-6-12-6-12z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    n: 4,
    title: 'Track & Share',
    text: 'Get your unit ID and updates. Share to inspire friends & family.',
    icon: (
      <path
        d="M22 11.08A10 10 0 1 1 12 2a10 10 0 0 1 10 9.08M9 12l2 2 4-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
];

export default function HowItWorks() {
  const itemsRef = useRef<HTMLLIElement[]>([]);
  const btnRippleRef = useRef<HTMLAnchorElement | null>(null);


  useEffect(() => {
    const io = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('opacity-100', 'translate-y-0');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.25 }
    );
    itemsRef.current.forEach(el => el && io.observe(el));
    return () => io.disconnect();
  }, []);


  const handleMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    el.style.setProperty('--x', `${x}%`);
    el.style.setProperty('--y', `${y}%`);
  };

  return (
    <section id="how-it-works" className="relative bg-white mt-20">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-20 lg:py-24">
     
        <header className="mx-auto max-w-2xl text-center">
          <p className="mb-1 inline-block text-xs font-semibold uppercase tracking-wide text-rose-600 sm:text-sm">
            How it works
          </p>
          <h2 className="text-2xl font-extrabold leading-tight text-slate-900 sm:text-3xl lg:text-4xl">
            From Sign-up to Saving Lives
          </h2>
          <p className="mt-3 text-sm text-slate-600 sm:text-base">
            Simple, safe, and fast. Follow these four steps to make a real impact.
          </p>
        </header>

 
        <ol
          className="
            relative mt-8 grid grid-cols-1 gap-6
            md:mt-10 md:grid-cols-2
            lg:grid-cols-4 lg:gap-8
            lg:before:absolute lg:before:content-[''] lg:before:left-[6%] lg:before:right-[6%] lg:before:top-[84px]
            lg:before:h-px lg:before:bg-gradient-to-r lg:before:from-rose-100 lg:before:to-red-200
          "
          aria-label="Donation process in four steps"
        >
          {steps.map((s, i) => (
            <li
              key={s.n}
              ref={el => {
                if (el) itemsRef.current[i] = el;
              }}
              style={{ transitionDelay: `${i * 90}ms` }}
              className="
                group relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm
                transition-all duration-700 ease-out
                opacity-0 translate-y-4
                hover:shadow-2xl hover:-translate-y-1 hover:border-rose-200
              "
            >
          
              <span className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-[radial-gradient(160px_160px_at_30%_0%,rgba(244,63,94,0.08),transparent_60%)]" />

       
              <div
                className="
                  absolute -top-3 -left-3 z-10 grid h-9 w-9 place-items-center rounded-full
                  border border-slate-200 bg-white text-rose-600 shadow-sm
                  transition-transform duration-300 group-hover:-translate-y-1 group-hover:rotate-6
                "
              >
                <span className="text-sm font-extrabold">{s.n}</span>
              </div>

        
              <div
                className="
                  mb-3 grid h-20 w-20 place-items-center rounded-2xl bg-rose-50 text-rose-600 mx-auto
                  transition-all duration-300 group-hover:scale-110 group-hover:rotate-3
                "
                aria-hidden
              >
                <svg viewBox="0 0 24 24" className="h-10 w-10">
                  {s.icon}
                </svg>
              </div>

              <h3 className="text-lg font-bold text-center text-slate-900">{s.title}</h3>

              <p className="mt-2 text-sm text-slate-600 text-center">{s.text}</p>

              <svg
                viewBox="0 0 24 24"
                className="absolute right-4 bottom-4 h-5 w-5 translate-x-0 opacity-0 text-rose-500 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100"
                aria-hidden
              >
                <path
                  d="M5 12h14M13 5l7 7-7 7"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </li>
          ))}
        </ol>

    
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4 md:mt-10">
          <a
            ref={btnRippleRef}
            onMouseMove={handleMove}
            href="#donate"
            className="
              group relative inline-flex items-center overflow-hidden rounded-2xl bg-rose-600 px-6 py-3
              text-sm font-semibold text-white shadow-lg transition-all duration-300
              hover:-translate-y-0.5 hover:bg-rose-700 hover:shadow-rose-200/60
            "
            style={
              {
                
                '--x': '50%',
                '--y': '50%',
              } as React.CSSProperties
            }
          >
            <span
              className="
                pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300
                group-hover:opacity-100
                [background:radial-gradient(180px_180px_at_var(--x)_var(--y),rgba(255,255,255,.35),transparent_45%)]
              "
            />
            Donate Now
            <svg viewBox="0 0 24 24" className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5">
              <path
                d="M5 12h14M13 5l7 7-7 7"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>

          <a
            href="#request"
            className="
              inline-flex items-center rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-900
              shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-rose-200 hover:shadow-md
            "
          >
            Request Blood
          </a>

          <a
            href="#organize"
            className="
              inline-flex items-center rounded-2xl bg-slate-50 px-6 py-3 text-sm font-semibold text-slate-900
              shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md
            "
          >
            Organize a Camp
          </a>
        </div>
      </div>
    </section>
  );
}
