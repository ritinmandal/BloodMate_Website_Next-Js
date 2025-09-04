'use client';

import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { useMemo } from 'react';
import Image from 'next/image';

gsap.registerPlugin(ScrollTrigger);

type Item = {
  title: string;
  desc: string;
  iconSrc: string;
};

export default function WhyChooseUsRed() {
  const rootRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<HTMLDivElement[]>([]);
  const iconRefs = useRef<HTMLDivElement[]>([]);
  const arcRefs  = useRef<HTMLDivElement[]>([]);

  const setCard = (el: HTMLDivElement | null, i: number) => { if (el) cardRefs.current[i] = el; };
  const setIcon = (el: HTMLDivElement | null, i: number) => { if (el) iconRefs.current[i] = el; };
  const setArc  = (el: HTMLDivElement | null, i: number) => { if (el) arcRefs.current[i]  = el; };


  const items: Item[] = useMemo(() => [
    {
      title: 'Verified Requests',
      desc: 'All blood requests are validated with hospitals. Donate with confidence.',
      iconSrc: '/images/blood-test1.png',
    },
    {
      title: 'Fast Matching',
      desc: 'We alert nearby compatible donors instantly to save critical minutes.',
      iconSrc: '/images/blood-test2.png',
    },
    {
      title: 'Privacy First',
      desc: 'Minimal data, encryption at rest, and full control over sharing.',
      iconSrc: '/images/blood-test3.png',
    },
  ], []);

  useLayoutEffect(() => {
    if (!rootRef.current) return;

    const preloaders = items.map((it) => {
      const im = new (window.Image)(40, 40); // width, height optional
      im.decoding = 'async';
      im.fetchPriority = 'high';
      im.src = it.iconSrc;
      return im;
    });

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dur = prefersReduced ? 0.001 : 1;

    const ctx = gsap.context(() => {
      gsap.set(['.wcu-kicker', '.wcu-title', '.wcu-sub'], { willChange: 'transform, opacity' });
      gsap.from(['.wcu-kicker', '.wcu-title', '.wcu-sub'], {
        scrollTrigger: {
          trigger: '.wcu-head',
          start: 'top 80%',
          toggleActions: 'play reverse play reverse',
          once: false,
          invalidateOnRefresh: true,
        },
        y: 24,
        autoAlpha: 0,
        duration: dur,
        ease: 'power3.out',
        stagger: 0.15,
      });

    
      gsap.set(cardRefs.current, { y: 64, opacity: 0, rotate: 0, scale: 0.99, willChange: 'transform, opacity' });

      gsap.to(cardRefs.current, {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: prefersReduced ? 0.001 : 1.2,
        ease: 'power2.out',
        stagger: 0.18,
        scrollTrigger: {
          trigger: gridRef.current!,
          start: 'top 85%',
          end: 'top 20%',
          scrub: 0.5,          
          once: false,             
        },
      });

      cardRefs.current.forEach((_, i) => {
        const icon = iconRefs.current[i];
        const arc  = arcRefs.current[i];
        if (!icon || !arc) return;

        gsap.set(icon, { y: -8, autoAlpha: 0, rotateY: -30, scale: 0.92, transformPerspective: 800, willChange: 'transform, opacity' });
        gsap.set(arc,  { autoAlpha: 0, scale: 0.92, y: -12, transformOrigin: '50% 100%', willChange: 'transform, opacity' });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: cardRefs.current[i],
            start: 'top 88%',
            end: 'top 60%',
            scrub: 0.5,
            once: false,
          },
          defaults: { ease: 'power3.out' },
        });

        tl.to(arc,  { autoAlpha: 1, y: 0, scale: 1, duration: 0.6 }, 0.05)
          .to(icon, { autoAlpha: 1, y: 0, rotateY: 0, scale: 1, duration: 0.6 }, 0.12);
      });
    }, rootRef);

    return () => {
      ctx.revert();
      preloaders.length = 0;
    };
  }, [items]);

  return (
    <section ref={rootRef} className="relative w-full mt-[170px]" >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="wcu-head text-center mb-12 sm:mb-16">
          <div className="wcu-kicker inline-flex items-center gap-3 text-red-500 font-semibold tracking-wide">
            <span className="h-[2px] w-8 bg-red-500 rounded-full" />
            Why Choose Us?
            <span className="h-[2px] w-8 bg-red-500 rounded-full" />
          </div>
          <h2 className="wcu-title mt-4 text-3xl sm:text-4xl md:text-5xl font-bold text-neutral-900">
            Reliable, Fast & Privacy-Respecting
          </h2>
          <p className="wcu-sub mt-4 max-w-2xl mx-auto text-neutral-600">
            Built for real emergencies—verified requests, rapid donor matching, and a strong community.
          </p>
         
        </div>

  
        <div
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 z-20 mt-40 gap-6 lg:gap-8"
        >
          {items.map((it, i) => (
            <>
              <div
                key={it.title}
                ref={(el) => setCard(el, i)}
                className="group relative overflow-visible rounded-3xl bg-white/95 backdrop-blur-sm border border-black/5
                           shadow-[0_14px_30px_rgba(0,0,0,0.10)] p-6 sm:p-7 md:p-8 z-10
                           transition-transform duration-500 will-change-transform
                           hover:-translate-y-2 hover:shadow-[0_24px_60px_rgba(239,68,68,0.18)]
                           [transform-style:preserve-3d]"
              >
                <div
                  ref={(el) => setArc(el, i)}
                  aria-hidden
                  className="pointer-events-none absolute -top-12 left-1/2 -translate-x-1/2
                             h-28 w-28 z-[-10] rounded-full border-[12px] border-red-500/80"
                />

                <div
                  ref={(el) => setIcon(el, i)}
                  className="absolute -top-8 left-40 -translate-x-1/2
                             inline-flex h-16 w-16 items-center justify-center
                             rounded-2xl bg-white text-red-600 ring-1 z-0 ring-black/5 shadow-md
                             transition-transform duration-500 ease-out
                             [transform-style:preserve-3d]"
                >
                    <Image
                      src={it.iconSrc}
                      alt=""
                      width={40}
                      height={40}
                      priority
                      className="absolute inset-0 h-10 w-10 object-contain [backface-visibility:hidden]"
                    />
                    {/* back */}
                    <Image
                      src={it.iconSrc}
                      alt=""
                      width={40}
                      height={40}
                      priority
                      className="absolute inset-0 h-10 w-10 object-contain opacity-90
                                 [transform:rotateY(180deg)] [backface-visibility:hidden]"
                    />
                </div>

                <span className="pointer-events-none absolute -inset-2 rounded-3xl opacity-0
                                   group-hover:opacity-100 transition
                                   bg-[radial-gradient(60%_60%_at_50%_50%,rgba(239,68,68,0.22),transparent_70%)]" />
                <h3 className="mt-12 text-lg sm:text-xl font-semibold text-neutral-900 text-center">
                  {it.title}
                </h3>
                <p className="mt-2 text-neutral-600 leading-relaxed text-center">
                  {it.desc}
                </p>

                <div className="mt-5 flex justify-center">
                  <a
                    href="#learn"
                    className="inline-flex items-center gap-2 rounded-full bg-red-500 text-white px-4 py-2
                               text-sm font-medium transition-all duration-300
                               hover:-translate-y-0.5 hover:shadow-[0_14px_40px_rgba(239,68,68,0.35)]"
                  >
                    Learn More
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <path d="M7 12h10M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    </svg>
                  </a>
                </div>

                <div className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition
                                bg-[radial-gradient(70%_40%_at_50%_0%,rgba(239,68,68,0.12),transparent_70%)]" />
              </div>
            </>
          ))}
        </div>
        
      </div>
    </section>
  );
}
