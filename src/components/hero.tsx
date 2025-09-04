'use client';

import { useLayoutEffect, useRef, type CSSProperties } from 'react';

interface CustomCSSProperties extends CSSProperties {
  '--reveal': string;
}
import { Great_Vibes } from 'next/font/google';
import { gsap } from 'gsap';
const greatVibes = Great_Vibes({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-cursive',
});

export default function HeroPremium() {
  const heroRef = useRef<HTMLDivElement>(null);
  const slidesRef = useRef<HTMLDivElement[]>([]);
  const dotsRef = useRef<HTMLButtonElement[]>([]);
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const penRef = useRef<HTMLDivElement>(null);
  const textMaskRef = useRef<HTMLDivElement>(null);

  const setSlideRef = (el: HTMLDivElement | null, i: number) => {
    if (el) slidesRef.current[i] = el;
  };
  const setDotRef = (el: HTMLButtonElement | null, i: number) => {
    if (el) dotsRef.current[i] = el;
  };

  const slides = [
    { src: '/videos/hero-1.mp4', alt: 'Donation drive' },
    { src: '/videos/hero-2.mp4', alt: 'Healthcare support' },
    { src: '/videos/hero-3.mp4', alt: 'Volunteers in action' },
  ];

  useLayoutEffect(() => {
    if (!heroRef.current || !slidesRef.current.length) return;

    const layers = slidesRef.current;
    let index = 0;
    const total = layers.length;

   
    layers.forEach((s, i) => {
      gsap.set(s, {
        opacity: i === 0 ? 1 : 0,
        scale: i === 0 ? 1 : 1.03,
        filter: i === 0 ? 'blur(0px)' : 'blur(6px)',
        zIndex: i === 0 ? 2 : 1,
      });
      const v = s.querySelector('video') as HTMLVideoElement | null;
      if (v) {
        v.muted = true;
        v.loop = true;
        if (v) {
          v.setAttribute('playsinline', '');
        }
        const tryPlay = () => v.play().catch(() => {});
        v.addEventListener('canplay', tryPlay, { once: false });
        if (i === 0) tryPlay();
      }
    });

    const markDots = () =>
      dotsRef.current.forEach((d, i) => {
        d?.classList.toggle('opacity-100', i === index);
        d?.classList.toggle('opacity-50', i !== index);
        d?.classList.toggle('scale-125', i === index);
      });
    markDots();

    const goTo = (next: number) => {
      if (next === index) return;
      const curr = layers[index];
      const nxt = layers[next];

      gsap.set([curr, nxt], { zIndex: (i) => (i === 0 ? 2 : 3) });
      const tl = gsap.timeline({
        defaults: { duration: 1.4, ease: 'power3.inOut' },
        onComplete: () => {
          gsap.set(curr, { zIndex: 1, opacity: 0, filter: 'blur(6px)', scale: 1.03 });
          gsap.set(nxt, { zIndex: 2, opacity: 1, filter: 'blur(0px)', scale: 1 });
          index = next;
          markDots();
        },
      });
      tl.to(nxt, { opacity: 1, filter: 'blur(0px)', scale: 1 }, 0)
        .to(curr, { opacity: 0, filter: 'blur(10px)', scale: 1.05 }, 0);
    };


    const auto = gsap.delayedCall(0, function cycle() {
      goTo((index + 1) % total);
      auto.restart(true).delay(5);
    });


    dotsRef.current.forEach((dot, i) =>
      dot?.addEventListener('click', () => {
        auto.pause();
        goTo(i);
      })
    );

    prevRef.current?.addEventListener('click', () => {
      auto.pause();
      goTo((index - 1 + total) % total);
    });
    nextRef.current?.addEventListener('click', () => {
      auto.pause();
      goTo((index + 1) % total);
    });

    const textEl = textMaskRef.current;
    const pen = penRef.current;
    if (textEl && pen) {
      textEl.style.setProperty('--reveal', '0%');
      const tlWrite = gsap.timeline({ defaults: { ease: 'power2.out' } });
      tlWrite
        .fromTo(
          textEl,
          { ['--reveal' as keyof CustomCSSProperties]: '0%' },
          { ['--reveal' as keyof CustomCSSProperties]: '100%', duration: 2.4, delay: 0.2 }
        )
        .fromTo(
          pen,
          { autoAlpha: 0, xPercent: 0 },
          {
            autoAlpha: 1,
            xPercent: 100,
            duration: 2.4,
            delay: 0.2,
            onComplete: () => { gsap.to(pen, { autoAlpha: 0, duration: 0.3 }); },
          },
          0
        )
        .from('.hero-sub', { y: 20, autoAlpha: 0, duration: 0.8 }, '-=0.8')
        .from('.hero-cta', { y: 24, autoAlpha: 0, duration: 0.8, stagger: 0.12 }, '-=0.6');
    }

    const unlock = () => {
      layers.forEach((s) => (s.querySelector('video') as HTMLVideoElement | null)?.play().catch(() => {}));
      window.removeEventListener('touchstart', unlock);
      window.removeEventListener('click', unlock);
    };
    window.addEventListener('touchstart', unlock, { once: true, passive: true });
    window.addEventListener('click', unlock, { once: true });

    return () => {
      auto.kill();
    };
  }, []);

  return (
    <section
      ref={heroRef}
    
      className={`${greatVibes.variable}  relative  overflow-hidden  `}
    >

      <div className="relative h-[70svh] mt-[12svh] sm:h-[80svh] md:h-[90svh] lg:h-[100svh]">

        <div className="pointer-events-none absolute inset-0 bg-black">
          {slides.map((s, i) => (
            <div
              key={s.src}
              ref={(el) => setSlideRef(el, i)}
              className="absolute inset-0 will-change-transform will-change-filter"
            >
              <video
                className="h-full w-full object-cover"
                src={s.src}
                autoPlay
                muted
                playsInline
                loop
                preload="metadata"
              />
       
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-black/55 via-black/25 to-black/65" />
            </div>
          ))}
        </div>

 
        <button
          ref={prevRef}
          aria-label="Previous slide"
          className="absolute left-4 top-1/2 -translate-y-1/2 z-30 h-12 w-12 rounded-full bg-white/15 hover:bg-white/25 text-white backdrop-blur ring-1 ring-white/20 transition"
        >
          ‹
        </button>
        <button
          ref={nextRef}
          aria-label="Next slide"
          className="absolute right-4 top-1/2 -translate-y-1/2 z-30 h-12 w-12 rounded-full bg-white/15 hover:bg-white/25 text-white backdrop-blur ring-1 ring-white/20 transition"
        >
          ›
        </button>

        <div className="pointer-events-auto absolute left-1/2 bottom-6 -translate-x-1/2 flex gap-3 z-30">
          {slides.map((_, i) => (
            <button
              key={i}
              ref={(el) => setDotRef(el, i)}
              className="h-2.5 w-2.5 rounded-full bg-white transition-all duration-300 opacity-50"
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

   
        <div className="relative z-20 h-full w-full flex items-center justify-center text-center px-0 md:px-6">
          <div className="max-w-5xl">
            <div className="relative inline-block">
              <div
                ref={textMaskRef}
                className="
                  relative inline-block
                  pt-[0.25em] pb-[0.15em]
                  [--reveal:0%]
                  [mask-size:100%_100%] [mask-repeat:no-repeat]
                "
                style={{
                  maskImage:
                    'linear-gradient(90deg,#000 0%,#000 var(--reveal),transparent var(--reveal))',
                  WebkitMaskImage:
                    'linear-gradient(90deg,#000 0%,#000 var(--reveal),transparent var(--reveal))',
                } as CSSProperties}
              >
                <h1
                  className="text-white font-normal drop-shadow-xl leading-tight"
                  style={{
                    fontFamily: 'var(--font-cursive)',
                    fontWeight: 400,
                    fontSize: 'clamp(40px, 7vw, 112px)',
                  }}
                >
                  Save Life. Donate Blood.
                </h1>
              </div>

      
              <div
                ref={penRef}
                className="absolute right-0 bottom-[0.4em] translate-x-1/2 h-3 w-3 rounded-full bg-white shadow-[0_0_24px_rgba(255,255,255,0.9)]"
              />
            </div>

            <p className="hero-sub mt-28 text-white/85 text-base sm:text-lg md:text-xl max-w-3xl mx-auto">
              Join a community of donors and volunteers saving lives every single day.
            </p>

      
            <div className="mt-8 flex items-center justify-center gap-3 sm:gap-4">
              <a
                href="#donate"
                className="hero-cta inline-flex items-center rounded-full bg-white text-black px-5 py-2.5 text-sm sm:text-base font-medium transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(255,255,255,0.45)]"
              >
                Donate Now
              </a>
              <a
                href="#learn"
                className="hero-cta inline-flex items-center rounded-full bg-white/10 text-white px-5 py-2.5 text-sm sm:text-base font-medium backdrop-blur-md ring-1 ring-white/20 transition-all duration-300 hover:bg-white/15 hover:-translate-y-0.5"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_120%_at_50%_10%,transparent_0%,transparent_55%,rgba(0,0,0,1)_100%)] z-10" />
        
      </div>
    </section>
  );
}
