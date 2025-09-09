'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

function Icon({
  path,
  className = '',
  strokeColor = 'currentColor',
}: { path: string; className?: string; strokeColor?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
      fill="none" stroke={strokeColor} className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={path} />
    </svg>
  );
}

export default function NavBar() {
  const [navOpen, setNavOpen] = useState(false);
  const [hideTop, setHideTop] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 1280) setNavOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    const onScroll = () => setHideTop((window.scrollY || 0) > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setNavOpen(false); }, [pathname]);

  const handleHash = (e: React.MouseEvent<HTMLAnchorElement>, hash: string) => {
    if (!hash.startsWith('#')) return;
    if (pathname === '/') {
      e.preventDefault();
      const el = document.querySelector(hash);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setNavOpen(false);
    }
  };

  const linkBase =
    "relative group rounded-full px-3 py-1 text-white/90 transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-primary";
  const linkHover =
    "hover:text-white hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(255,255,255,0.15)] after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-white after:transition-transform after:duration-300 after:ease-out hover:after:scale-x-100";

  return (
    <nav suppressHydrationWarning className="fixed inset-x-0 top-0 z-50 pointer-events-none">
      <div className={[
        'pointer-events-auto bg-white shadow transition-all duration-300 ease-in-out',
        hideTop ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100',
      ].join(' ')}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between py-2">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <Image src="/images/logo.png" alt="BloodMate Logo" width={45} height={40} priority />
              <span className="font-bold text-xl text-black">BloodMate</span>
            </div>

            <div className="hidden xl:flex items-center gap-6 text-black text-sm">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-black/5">
                  <Icon path="M12 11a2 2 0 100-4 2 2 0 000 4zm0-9a7 7 0 017 7c0 4.9-7 12-7 12S5 13.9 5 9a7 7 0 017-7z" className="w-4 h-4" strokeColor="red" />
                </div>
                <span className="font-medium">Locate Address:</span>
                <span>Howrah, WB</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-black/5">
                  <Icon path="M2 8l10 6 10-6M4 18h16a2 2 0 002-2V8a2 2 0 00-1-1.732L12 2 3 6.268A2 2 0 002 8v8a2 2 0 002 2z" className="w-4 h-4" strokeColor="red" />
                </div>
                <span className="font-medium">Email us any time:</span>
                <span>support@bloodmate.com</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-black/5">
                  <Icon path="M3 5a2 2 0 012-2h2l2 4-3 3a16 16 0 007 7l3-3 4 2v2a2 2 0 01-2 2h-1C10.82 20.8 3.2 13.18 3 5z" className="w-4 h-4" strokeColor="red" />
                </div>
                <span className="font-medium">Call us any time:</span>
                <span>+91&nbsp;123&nbsp;456&nbsp;7890</span>
              </div>
            </div>
          </div>

          <div className="hidden xl:flex items-center gap-3 text-red-600">
            <button suppressHydrationWarning aria-label="Facebook" className="p-1 rounded">
              <Icon path="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" className="w-5 h-5" strokeColor="red" />
            </button>
            <button suppressHydrationWarning aria-label="Twitter" className="p-1 rounded">
              <Icon path="M23 3a10.9 10.9 0 01-3.14 1.53A4.48 4.48 0 0012.26 6v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" className="w-5 h-5" strokeColor="red" />
            </button>
            <button suppressHydrationWarning aria-label="YouTube" className="p-1 rounded">
              <Icon path="M10 15l5.19-3L10 9v6zm10-6.5A2.5 2.5 0 0017.5 6h-11A2.5 2.5 0 004 8.5v7A2.5 2.5 0 006.5 18h11a2.5 2.5 0 002.5-2.5v-7z" className="w-5 h-5" strokeColor="red" />
            </button>
            <button suppressHydrationWarning aria-label="LinkedIn" className="p-1 rounded">
              <Icon path="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2c-1.054 0-2 .695-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2zM4 4a2 2 0 110 4 2 2 0 010-4z" className="w-5 h-5" strokeColor="red" />
            </button>
          </div>
        </div>
      </div>

      <div className={[
        'pointer-events-auto fixed left-1/2 -translate-x-1/2 w-[98%] sm:w-[95%] xl:w-[92%] 2xl:w-[88%] px-5 sm:px-6 xl:px-9',
        'transition-all duration-300 ease-in-out bg-red-600 shadow rounded-full',
        hideTop ? 'top-2' : 'top-[56px]',
      ].join(' ')}>
        <div className="text-white rounded-full shadow">
          <div className="max-w-6xl mx-auto px-5 sm:px-6 xl:px-0 flex items-center justify-between py-0 rounded-full">
            <div className="hidden xl:flex items-center gap-2">
              <Link href="/" prefetch className={`${linkBase} ${linkHover} flex items-center gap-1`}>
                <span>Home</span>
              </Link>

              <Link
                href="/aboutus"
                className={`${linkBase} ${linkHover} flex items-center gap-1`}
              >
                <span>About</span>
              </Link>

              <Link
                href="/map"
                className={`${linkBase} ${linkHover} flex items-center gap-1`}
              >
                <span>Donors</span>
              </Link>

              <Link
                href="/hospital"
                className={`${linkBase} ${linkHover} flex items-center gap-1`}
                onClick={(e) => handleHash(e , '#pages')}
              >
                <span>Hospitals</span>
              </Link>

              <Link
                href="/campaign"
                className={`${linkBase} ${linkHover} flex items-center gap-1`}
                onClick={(e) => handleHash(e , '#blog')}
              >
                <span>Campaign</span>
              </Link>

              <Link
                href="/contact"
                className={`${linkBase} ${linkHover} flex items-center gap-1`}
                onClick={(e) => handleHash(e , '#contact')}
              >
                <span>Contact</span>
              </Link>
            </div>

            <div className="hidden 2xl:flex items-center bg-white/10 rounded-full px-4 py-2 text-sm">
              <Icon path="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21.682 4.318 12.682a4.5 4.5 0 010-6.364z" className="w-4 h-4" strokeColor="white" />
              <span className="ml-2">Are you ready to help them? Let’s become a volunteer…</span>
            </div>

            <div className="hidden xl:flex items-center gap-3">
              <button suppressHydrationWarning aria-label="Search" className="p-2 rounded-full bg-white text-primary">
                <Icon path="M21 21l-4.35-4.35M15 10a5 5 0 11-10 0 5 5 0 0110 0z" strokeColor="red" className="w-5 h-5" />
              </button>
              
              <Link href="/login" className="group flex items-center px-4 py-2 rounded-full bg-white text-red-600">
                <Icon path="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21.682 4.318 12.682a4.5 4.5 0 010-6.364z" className="w-4 h-4 mr-2" strokeColor="red" />
                Sign&nbsp;In
              </Link>
              <Link href="/signup" className="group flex items-center px-4 py-2 rounded-full bg-white text-red-600">
                <Icon path="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21.682 4.318 12.682a4.5 4.5 0 010-6.364z" className="w-4 h-4 mr-2" strokeColor="red" />
                Donate&nbsp;Now
              </Link>
            </div>

          
            <button
              type="button"
              className="xl:hidden inline-flex items-center justify-center p-2 rounded-md text-white"
              onClick={() => setNavOpen(!navOpen)}
              aria-label="Toggle navigation menu"
              aria-expanded={navOpen}
            >
              {navOpen
                ? <Icon path="M6 18L18 6M6 6l12 12" className="w-6 h-6" strokeColor="white" />
                : <Icon path="M4 6h16M4 12h16M4 18h16" className="w-6 h-6" strokeColor="white" />
              }
            </button>
          </div>
        </div>
      </div>

  
      <div
        className={["xl:hidden fixed inset-0 z-[80]", navOpen ? "pointer-events-auto" : "pointer-events-none"].join(" ")}
        aria-hidden={!navOpen}
        onKeyDown={(e) => e.key === 'Escape' && setNavOpen(false)}
        tabIndex={-1}
      >
        <div
          className={["absolute inset-0 bg-black/60 backdrop-blur-[8px] transition-opacity duration-300", navOpen ? "opacity-100" : "opacity-0"].join(" ")}
          onClick={() => setNavOpen(false)}
        />
        <div
          className={["absolute inset-0 flex items-center justify-center px-4", "transition-all duration-300", navOpen ? "opacity-90 translate-y-0 scale-100" : "opacity-0 -translate-y-2 scale-95"].join(" ")}
        >
          <nav className="relative w-[88%] max-w-sm rounded-2xl bg-white/90 shadow-2xl p-6">
            <button
              aria-label="Close menu"
              className="absolute -top-3 -right-3 h-10 w-10 rounded-full bg-red-600 text-white grid place-items-center shadow-lg"
              onClick={() => setNavOpen(false)}
            >
              <Icon path="M6 18L18 6M6 6l12 12" className="w-6 h-6" strokeColor="white" />
            </button>

            <ul className="mt-1 flex flex-col items-center gap-2 w-full">
              <li className="w-full">
                <Link href="/" className="block w-full text-center rounded-xl px-4 py-3 text-lg font-semibold text-black hover:bg-black/5 transition">
                  Home
                </Link>
              </li>

              <li className="w-full">
                <Link
                  href="/aboutus"
                  onClick={(e) => handleHash(e , '#about')}
                  className="block w-full text-center rounded-xl px-4 py-3 text-lg font-semibold text-black hover:bg-black/5 transition"
                >
                  About
                </Link>
              </li>

              <li className="w-full">
                <Link
                  href="/map"
                  className="block w-full text-center rounded-xl px-4 py-3 text-lg font-semibold text-black hover:bg-black/5 transition"
                >
                  Donors
                </Link>
              </li>

              <li className="w-full">
                <Link
                  href="/hospital"
                  onClick={(e) => handleHash(e , '#pages')}
                  className="block w-full text-center rounded-xl px-4 py-3 text-lg font-semibold text-black hover:bg-black/5 transition"
                >
                  Hospitals
                </Link>
              </li>

              <li className="w-full">
                <Link
                  href="/campaign"
                  onClick={(e) => handleHash(e , '#blog')}
                  className="block w-full text-center rounded-xl px-4 py-3 text-lg font-semibold text-black hover:bg-black/5 transition"
                >
                  Campaigns
                </Link>
              </li>

              <li className="w-full">
                <Link
                  href="/contact"
                  onClick={(e) => handleHash(e, '#contact')}
                  className="block w-full text-center rounded-xl px-4 py-3 text-lg font-semibold text-black hover:bg-black/5 transition"
                >
                  Contact
                </Link>
              </li>
            </ul>

            <div className="mt-4 flex items-center justify-center gap-3">
              <Link
                href="/signup"
                className="inline-flex items-center rounded-full bg-red-600 px-5 py-2.5 text-white font-semibold"
              >
                <Icon path="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21.682 4.318 12.682a4.5 4.5 0 010-6.364z" className="w-4 h-4 mr-2" strokeColor="white" />
                Donate
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center rounded-full bg-red-600 px-5 py-2.5 text-white font-semibold"
              >
                <Icon path="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21.682 4.318 12.682a4.5 4.5 0 010-6.364z" className="w-4 h-4 mr-2" strokeColor="white" />
                Login
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </nav>
  );
}

export function NavSpacer() {
  return <div className="h-[124px] xl:h-[120px]" />;
}
