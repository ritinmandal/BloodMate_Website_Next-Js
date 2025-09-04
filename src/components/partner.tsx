'use client';

import { useEffect, useRef, ReactElement } from 'react';


type Partner = {
  title: string;
  desc: string;
  bullets: string[];
  badges: string[];
  cta: string;
  icon: ReactElement;
  color: string; 
};

const partners: Partner[] = [
  {
    title: 'Hospitals',
    desc: 'Realtime requisitions, crossmatch status, unit traceability, and SLAs.',
    bullets: ['HL7/FHIR Orders', 'Bedside Scan & Issue', 'Cold-chain Audit', 'Auto-billing'],
    badges: ['HL7', 'FHIR', 'NABH'],
    cta: 'Request Hospital Access',
    icon: (
      <path
        d="M3 21V8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v13M12 2v6M9 4h6M8 12h8M8 16h8M6 21v-3a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v3"
        fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"
      />
    ),
    color: 'from-rose-50 to-red-50',
  },
  {
    title: 'Diagnostic Labs',
    desc: 'Plasma/platelet workflows, component reservations',
    bullets: ['PRBC/FFP Tickets', 'QC & Quarantine', 'Expiry Watchlist', 'CSV/API Export'],
    badges: ['ISO 15189', 'LIS API'],
    cta: 'Connect Lab',
    icon: (
      <path d="M6 2v6l6 10 6-10V2M4 20h16"
        fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"
      />
    ),
    color: 'from-emerald-50 to-teal-50',
  },
  {
    title: 'NGOs & CSR',
    desc: 'Plan donation camps, manage volunteers, and verify',
    bullets: ['Camp Planner', 'Volunteer Roster', 'Impact Reports', 'CSR Branding'],
    badges: ['MoU', 'GST'],
    cta: 'Partner With Us',
    icon: (
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z"
        fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"
      />
    ),
    color: 'from-amber-50 to-orange-50',
  },
  {
    title: 'Logistics & Ambulance',
    desc: 'Cold-chain routing, e-POD, and courier assignment with live ETA.',
    bullets: ['Temperature Logs', 'Route Optimizer', 'e-POD & OTP', 'Recall Handling'],
    badges: ['GDP', 'Webhooks'],
    cta: 'Enable Logistics',
    icon: (
      <path d="M3 7h11l4 4v6H3zM18 17a3 3 0 1 0 6 0M6 17a3 3 0 1 0 6 0"
        fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"
      />
    ),
    color: 'from-indigo-50 to-sky-50',
  },
];

export default function PartnersHub() {
  const cardsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) {
          (e.target as HTMLElement).classList.add('opacity-100', 'translate-y-0');
          io.unobserve(e.target);
        }
      }),
      { threshold: 0.2 }
    );
    cardsRef.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section id="partners" className="relative bg-white mt-20">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-20 lg:py-24">
 
        <header className="mx-auto max-w-3xl text-center">
          <p className="mb-1 inline-block text-xs font-semibold uppercase tracking-wide text-rose-600 sm:text-sm">
            Partners Hub
          </p>
          <h2 className="text-2xl font-extrabold leading-tight text-slate-900 sm:text-3xl lg:text-4xl">
            Connect Hospitals, Labs, NGOs & Logistics
          </h2>
          <p className="mt-3 text-sm text-slate-600 sm:text-base">
            One platform for requests, inventory, compliance and fulfillment—secure, auditable, and fast.
          </p>
        </header>

  
        <div className="mt-8 grid grid-cols-1 gap-5 sm:gap-6 md:mt-10 md:grid-cols-2 lg:grid-cols-4">
          {partners.map((p, i) => (
            <div
              key={p.title}
              ref={(el) => { if (el) cardsRef.current[i] = el; }}
              className="
                group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm
                opacity-0 translate-y-4 transition-all duration-700
                hover:-translate-y-1 hover:shadow-2xl sm:p-6
              "
            >
              <span
                className={`pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-gradient-to-br ${p.color}`}
              />

              <div className="relative mb-3 grid h-12 w-12 place-items-center rounded-xl bg-white text-rose-600 ring-1 ring-slate-200 transition-all duration-300 group-hover:rotate-3 group-hover:scale-110">
                <svg viewBox="0 0 24 24" className="h-6 w-6">{p.icon}</svg>
              </div>

              <h3 className="relative text-base font-semibold text-slate-900">{p.title}</h3>
              <p className="relative mt-1 text-sm text-slate-600">{p.desc}</p>

              <ul className="relative mt-3 space-y-2">
                {p.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2 text-sm text-slate-700">
                    <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-rose-500/70" />
                    {b}
                  </li>
                ))}
              </ul>

              <div className="relative mt-4 flex flex-wrap items-center gap-2">
                {p.badges.map((b) => (
                  <span key={b} className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700">
                    {b}
                  </span>
                ))}
              </div>

              <div className="relative mt-5">
                <a
                  href="#partner-contact"
                  className="
                    group/btn inline-flex items-center rounded-xl bg-rose-600 px-3.5 py-2 text-sm font-semibold text-white shadow
                    transition-all duration-300 hover:bg-rose-700 hover:shadow-rose-200/60
                  "
                >
                  {p.cta}
                  <svg viewBox="0 0 24 24" className="ml-2 h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-0.5">
                    <path d="M5 12h14M13 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
