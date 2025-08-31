'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';

type Partner = {
  name: string;
  domain: string; 
};


const PARTNERS: Partner[] = [
  { name: 'Apollo Multispeciality Hospitals, Kolkata', domain: 'apollohospitals.com' },
  { name: 'Fortis Hospital, Anandapur', domain: 'fortishealthcare.com' },
  { name: 'AMRI Hospitals', domain: 'amrihospitals.in' },
  { name: 'Medica Superspecialty Hospital', domain: 'medicahospitals.in' },
  { name: 'Narayana Superspeciality Hospital, Howrah', domain: 'narayanahealth.org' },
  { name: 'Peerless Hospital', domain: 'peerlesshospital.com' },
  { name: 'CMRI (CK Birla Hospitals)', domain: 'ckbirlahospitals.com' },
  { name: 'Belle Vue Clinic', domain: 'bellevueclinic.com' },
  { name: 'Woodlands Multispeciality Hospital', domain: 'woodlandshospital.in' },
  { name: 'ILS Hospitals', domain: 'ilshospitals.com' },
  { name: 'Apollo Hospitals, Kolkata', domain: 'apollohospitals.com' },];

export default function PartnersMarquee() {
  const [paused, setPaused] = useState(false);


  const loop = useMemo(() => [...PARTNERS, ...PARTNERS], []);

  return (
    <div className="mt-10 rounded-2xl border border-slate-200 bg-white mb-40 p-4 sm:p-6">
      <div className="mb-8 relative">
  <h2 className="text-center text-3xl sm:text-4xl font-extrabold  text-rose-600">
    Our Partners
  </h2>

  <a
    href="#all-partners"
    className="absolute right-0 top-1/2 -translate-y-1/2 text-xs sm:text-sm font-semibold text-rose-600 hover:text-rose-700"
  >
    View all
  </a>

  <div className="mx-auto mt-2 h-1 w-24 mb-25 rounded-full bg-rose-200/70" />
</div>

      <div
        className="relative overflow-hidden"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
 
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white" />

        <div
          className="flex min-w-max gap-6 opacity-90 will-change-transform"
          style={{
            animation: 'marquee 22s linear infinite',
            animationPlayState: paused ? 'paused' : 'running',
          }}
        >
          {loop.map((p, i) => (
            <LogoCard key={`${p.domain}-${i}`} partner={p} />
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}

function LogoCard({ partner }: { partner: Partner }) {
  const src = `https://logo.clearbit.com/${partner.domain}`;

  return (
    <figure
      className="
        flex h-28 w-40 flex-col items-center justify-center
        rounded-xl   px-3 py-2 
        text-center"
      aria-label={partner.name}
      title={partner.name}
    >
    
      <div className="flex h-14 items-center justify-center">
        <Image
          src={src}
          alt={partner.name}
          width={140}
          height={40}
          className="max-h-14 w-auto object-contain"
          onError={(e) => {
            const el = e.currentTarget as HTMLImageElement;
            
            el.style.display = 'none';
            const parent = el.parentElement?.parentElement;
            if (parent && !parent.querySelector('[data-fallback]')) {
              const span = document.createElement('span');
              span.dataset.fallback = 'true';
              span.className =
                'text-xs font-semibold uppercase tracking-wide text-slate-400';
              span.textContent = partner.domain.replace(/^www\./, '');
              parent.querySelector('.logo-caption')?.before(span);
            }
          }}
        />
      </div>

 
      <figcaption className="logo-caption mt-2 line-clamp-2 text-xs font-medium text-slate-700">
        {partner.name}
      </figcaption>
    </figure>
  );
}
