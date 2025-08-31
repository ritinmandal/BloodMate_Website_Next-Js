'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Footer() {
  const [year, setYear] = useState<number>(new Date().getFullYear());

  useEffect(() => setYear(new Date().getFullYear()), []);
  

  return (
    <footer className="relative bg-[#220606] text-[#ffecec]  w-[100%]">

       
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-12 h-12 bg-[radial-gradient(80%_100%_at_50%_-20%,rgba(255,255,255,0.08),transparent)]"
      />

      <section className="mx-auto w-full max-w-7xl px-4 pt-20">
        <h2 className="text-3xl font-extrabold tracking-tight">
          Stay Updated, Save Lives
        </h2>
        <p className="mt-2 max-w-xl text-sm/6 text-[#f2bcbc]">
          Subscribe for alerts, donor camps, and blood donation drives.
        </p>

        <div className="mt-6 flex w-full max-w-3xl items-center gap-3">
          <label htmlFor="newsletter" className="sr-only">
            Email address
          </label>
          <input
            id="newsletter"
            type="email"
            placeholder="Enter Email Address"
            className="h-12 w-full rounded-full bg-white/95 px-5 text-[#400909] placeholder:text-[#a67c7c] outline-none ring-0 focus:outline-none"
          />
          <button
            aria-label="Subscribe"
            className="grid h-12 w-12 place-items-center rounded-full bg-[#e63946] transition hover:brightness-95 active:brightness-90"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-white">
              <path d="M21.426 2.574a1.5 1.5 0 0 1 .3 1.64l-7.5 18a1.5 1.5 0 0 1-2.768-.139l-2.471-6.178-6.178-2.47A1.5 1.5 0 0 1 2.7 10.66l18-7.5a1.5 1.5 0 0 1 .726-.087Z" />
            </svg>
          </button>
        </div>
      </section>

      <div className="mx-auto mt-10 w-full max-w-7xl border-t border-white/10" />

      <section className="mx-auto w-full max-w-7xl px-4 pb-12 pt-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-[1.1fr_1fr_1.1fr]">
        
          <div>
            <div className="flex items-center gap-2 text-3xl font-extrabold text-white">
              <BloodDropIcon className="h-7 w-7 text-red-500" />
              <span>BloodMate</span>
            </div>

            <p className="mt-4 max-w-md text-sm text-[#f2bcbc]">
              BloodMate connects donors, hospitals, and patients with
              real-time availability and safe transfusion practices.
            </p>

            <Link
              href="#donate"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-95"
            >
              <HeartIcon className="h-4 w-4" />
              Donate Blood
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div>
              <FooterHeading>Quick Links</FooterHeading>
              <ul className="mt-3 space-y-2 text-sm text-[#ffdcdc]">
                <FooterLink href="#about">About Us</FooterLink>
                <FooterLink href="#donor">Find Donors</FooterLink>
                <FooterLink href="#camps">Blood Camps</FooterLink>
                <FooterLink href="#privacy">Privacy Policy</FooterLink>
                <FooterLink href="#contact">Contact Us</FooterLink>
              </ul>
            </div>

            <div>
              <FooterHeading>Our Services</FooterHeading>
              <ul className="mt-3 space-y-2 text-sm text-[#ffdcdc]">
                <FooterLink href="#donate">Donate Blood</FooterLink>
                <FooterLink href="#request">Request Blood</FooterLink>
                <FooterLink href="#inventory">Check Inventory</FooterLink>
                <FooterLink href="#emergency">Emergency Help</FooterLink>
                <FooterLink href="#volunteer">Become Volunteer</FooterLink>
              </ul>
            </div>
          </div>

          <div className="lg:pl-8">
            <FooterHeading>Contact Us</FooterHeading>

            <div className="mt-4 flex items-center gap-3">
              <IconBadge>
                <PhoneIcon />
              </IconBadge>
              <div className="text-sm">
                <p className="text-[#f28b82]">Emergency Hotline:</p>
                <a className="font-semibold text-white" href="tel:+911234567890">
                  +91 12345 67890
                </a>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <IconBadge>
                <MailIcon />
              </IconBadge>
              <div className="text-sm">
                <p className="text-[#f28b82]">Write to us:</p>
                <a className="font-semibold text-white" href="mailto:help@bloodmate.org">
                  help@bloodmate.org
                </a>
              </div>
            </div>

            <div className="mt-6">
              <div className="inline-flex items-center gap-3 rounded-full bg-white/5 px-3 py-2">
                <SocialCircle href="https://facebook.com" label="Facebook">
                  <FacebookIcon />
                </SocialCircle>
                <SocialCircle href="https://twitter.com" label="Twitter / X">
                  <TwitterIcon />
                </SocialCircle>
                <SocialCircle href="https://youtube.com" label="YouTube">
                  <YoutubeIcon />
                </SocialCircle>
                <SocialCircle href="https://linkedin.com" label="LinkedIn">
                  <LinkedinIcon />
                </SocialCircle>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="bg-[#400909]">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 text-sm text-[#f2bcbc]">
          <p>
            © {year} <span className="font-semibold text-red-400">BloodMate</span>. All Rights Reserved.
          </p>

          <a
            href="#top"
            aria-label="Back to top"
            className="grid h-10 w-10 place-items-center rounded-full bg-red-600 text-white transition hover:brightness-95"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <ArrowUpIcon />
          </a>
        </div>
      </div>
    </footer>
  );
}


function FooterHeading({ children }: { children: React.ReactNode }) {
  return <h3 className="text-xl font-bold text-white">{children}</h3>;
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="group inline-flex items-center gap-2 hover:text-white">
        <ArrowTiny className="h-4 w-4 text-red-400 transition group-hover:translate-x-0.5" />
        <span>{children}</span>
      </Link>
    </li>
  );
}

function IconBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/5">
      <span className="grid h-8 w-8 place-items-center rounded-lg bg-red-600/20 text-red-400">
        {children}
      </span>
    </span>
  );
}

function SocialCircle({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      aria-label={label}
      target="_blank"
      rel="noreferrer"
      className="grid h-9 w-9 place-items-center rounded-full bg-white text-[#400909] transition hover:brightness-95"
    >
      {children}
    </a>
  );
}


function ArrowTiny(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path d="M5 12h14M13 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BloodDropIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2C10 6 5 11 5 16a7 7 0 0 0 14 0c0-5-5-10-7-14Z" />
    </svg>
  );
}

function HeartIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 21s-7.5-4.438-9.5-8.5C.9 9.1 2.7 5.9 6 5.3c2-.3 3.6.7 4.3 2 .7-1.3 2.3-2.3 4.3-2 3.3.6 5.1 3.8 3.5 7.2C19.5 16.6 12 21 12 21z" />
    </svg>
  );
}
function PhoneIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M6.6 10.8a15.2 15.2 0 0 0 6.6 6.6l2.2-2.2a1.2 1.2 0 0 1 1.2-.3c1.3.4 2.7.6 4.1.6a1.2 1.2 0 0 1 1.2 1.2V20a1.2 1.2 0 0 1-1.2 1.2A19.8 19.8 0 0 1 3 4.2 1.2 1.2 0 0 1 4.2 3H7a1.2 1.2 0 0 1 1.2 1.2c0 1.4.2 2.8.6 4.1.1.4 0 .8-.3 1.2l-2 2.3Z" />
    </svg>
  );
}
function MailIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M2 6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v.4l-10 6.25L2 6.4V6Zm0 3.2v8.8a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9.2l-9.38 5.86a2 2 0 0 1-2.24 0L2 9.2Z" />
    </svg>
  );
}
function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props} className='w-6 h-6'>
      <path d="M13 10h3l.5-4H13V4.5c0-1.1.3-1.9 2-1.9h1.7V.1C16.3 0 15 0 13.9 0 11 0 9 1.7 9 4.8V6H6v4h3v10h4V10Z" />
    </svg>
  );
}
function TwitterIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props} className='w-6 h-6'>
      <path d="M22 5.8c-.7.3-1.5.5-2.2.6.8-.5 1.4-1.3 1.7-2.2-.7.5-1.7.9-2.6 1A3.7 3.7 0 0 0 12 7.8c0 .3 0 .6.1.8-3-.1-5.7-1.6-7.5-3.9-.4.6-.5 1.3-.5 2 0 1.4.7 2.6 1.8 3.3-.6 0-1.2-.2-1.7-.5v.1c0 2 1.5 3.6 3.4 4-.4.1-.8.2-1.2.2-.3 0-.6 0-.8-.1.6 1.7 2.2 2.9 4.1 3A7.5 7.5 0 0 1 2 19.4 10.5 10.5 0 0 0 7.8 21c6.2 0 9.7-5.1 9.7-9.6v-.4c.7-.4 1.4-1.1 1.9-1.8Z" />
    </svg>
  );
}
function YoutubeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props} className='w-6 h-6'>
      <path d="M23.5 6.2a3 3 0 0 0-2.2-2.2C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.3.5A3 3 0 0 0 .5 6.2 31.2 31.2 0 0 0 0 12a31.2 31.2 0 0 0 .5 5.8 3 3 0 0 0 2.2 2.2c1.8.5 9.3.5 9.3.5s7.5 0 9.3-.5a3 3 0 0 0 2.2-2.2A31.2 31.2 0 0 0 24 12a31.2 31.2 0 0 0-.5-5.8ZM9.6 15.5v-7l6 3.5-6 3.5Z" />
    </svg>
  );
}
function LinkedinIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 28" fill="currentColor" {...props} className='w-8 h-8'>
      <path d="M4.98 3.5A2.5 2.5 0 1 1 5 8.5a2.5 2.5 0 0 1 0-5Zm.02 6.5H2V22h3V10ZM9 10H6v12h3v-6.5c0-3.6 4-3.9 4 0V22h3v-7.9c0-5.7-6.3-5.5-7-2.7V10Z" />
    </svg>
  );
}
function ArrowUpIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props} className='rounded-full w-8 h-8'>
      <path d="M12 3 4 11h5v10h6V11h5L12 3z" />
    </svg>
  );
}
