'use client';

import Image from 'next/image';

export default function AboutUsBloodBank() {
  return (
    <section className="relative overflow-hidden mt-20 w-full">
      <div className="pointer-events-none absolute -left-12 top-5 h-40 w-50 rounded-full bg-gradient-to-r from-rose-100 to-red-50 opacity-60 sm:-left-16 sm:top-8 sm:h-56 sm:w-56 md:-left-24 md:top-10 md:h-80 md:w-100" />
      <div className="pointer-events-none absolute -right-8 bottom-5 h-32 w-32 rotate-12 rounded-full bg-gradient-to-r from-red-50 to-rose-100 opacity-60 sm:-right-12 sm:bottom-8 sm:h-48 sm:w-48 md:-right-16 md:bottom-10 md:h-64 md:w-64" />

      <div className="mx-auto mb-10 text-center sm:mb-12">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-black-700">
          About Our Blood Bank
        </h1>
        <div className="mx-auto mt-3 h-1 w-24 rounded-full bg-red-600/80" />
        <p className="mx-auto mt-3 max-w-2xl text-sm sm:text-base text-slate-600">
          Learn more about our mission, volunteers, and how we ensure every unit
          of blood is handled with care and safety.
        </p>
      </div>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-8 sm:gap-10 sm:px-6 sm:py-12 md:grid-cols-2 md:gap-12 md:py-15 lg:gap-14 lg:px-8 lg:py-20 xl:gap-16 xl:py-10">
        
        <div className="relative order-2 ">
          <div className="relative mx-auto mt-2 w-[88%] max-w-[280px] -translate-y-3 sm:mt-8 sm:w-[90%] sm:max-w-[360px] sm:-translate-y-4 md:mt-10 md:w-full md:max-w-[380px] md:mx-8 md:translate-x-[90px] md:translate-y-0 lg:max-w-[400px] lg:translate-x-[70px] xl:max-w-[440px]">
            <div className="relative">
              <Image
                src="/images/blood_about_1.png"
                alt="Donor giving blood in a safe environment"
                width={1040}
                height={700}
                className="h-auto w-full rounded-2xl object-cover shadow-lg sm:rounded-3xl md:rounded-[28px]"
                priority
                sizes="(max-width: 640px) 88vw, (max-width: 768px) 90vw, (max-width: 1024px) 45vw, 400px"
              />
              <span className="pointer-events-none absolute inset-0 rounded-2xl ring-4 ring-white sm:rounded-3xl sm:ring-6 md:rounded-[28px] md:ring-8" />
            </div>
          </div>

          <div className="relative -mt-4 w-[92%] rounded-2xl ring-4 ring-white shadow-xl sm:-mt-6 sm:w-[88%] sm:rounded-3xl sm:ring-6 md:-mt-[40px] md:ml-4 md:w-[78%] md:rounded-[28px] md:ring-8 lg:-mt-[50px] lg:ml-6 lg:w-[81%]">
            <Image
              src="/images/blood_about_2.png"
              alt="Community volunteers supporting the blood bank"
              width={1200}
              height={800}
              className="h-auto w-full rounded-2xl object-cover sm:rounded-3xl md:rounded-[28px]"
              sizes="(max-width: 640px) 92vw, (max-width: 768px) 88vw, (max-width: 1024px) 35vw, 320px"
            />
          </div>

          <div className="absolute right-1 -bottom-2 rounded-2xl bg-red-900 px-3 py-3 text-white shadow-lg ring-4 ring-white sm:right-2 sm:-bottom-4 sm:rounded-3xl sm:px-4 sm:py-9 sm:shadow-xl sm:ring-6 md:-bottom-1 md:right-3 md:rounded-[36px] md:px-6 md:py-5 md:ring-8 lg:-bottom-10 lg:right-4 lg:px-8 lg:py-6 lg:h-[120px]">
            <p className="text-sm font-bold leading-tight sm:text-base sm:font-extrabold md:text-lg lg:text-[18px]">
              <span className="block text-base font-extrabold sm:text-lg md:text-xl lg:text-2xl">75,000+</span>
              <span className="text-xs sm:text-sm md:text-base">Units Safely Managed</span>
            </p>
            <a
              href="#become-volunteer"
              className="mt-1 inline-block text-[10px] font-medium underline underline-offset-2 transition-colors hover:text-red-200 sm:mt-1.5 sm:text-xs sm:font-semibold sm:underline-offset-4 md:mt-2 md:text-sm lg:mt-3 lg:text-[15px]"
            >
              Become A Volunteer
            </a>
          </div>
        </div>

        <div className="flex flex-col justify-center order-1 md:order-2 md:w-full ">
          <div className="mb-3 flex items-center gap-2 sm:mb-4">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-rose-300 sm:h-6 sm:w-6">
              <svg viewBox="0 0 24 24" className="h-3 w-3 text-rose-500 sm:h-4 sm:w-4">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78Z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            <p className="text-xs font-medium text-rose-600 sm:text-sm sm:font-semibold">About Us</p>
          </div>

          <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl sm:font-extrabold md:text-2xl lg:text-3xl xl:text-4xl">
            Give Blood, Change Lives
            <br className="hidden sm:block" /> 
            <span className="text-xl sm:text-2xl md:text-xl lg:text-2xl xl:text-3xl">Volunteer Opportunities</span>
          </h2>

          <p className="mt-4 max-w-2xl text-sm text-slate-600 sm:mt-5 sm:text-base md:text-sm lg:text-base xl:text-lg">
            Our secure blood bank platform lets you donate, schedule, or run a camp
            with ease. Your support keeps emergency care ready and communities safe.
          </p>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:mt-8 sm:gap-6 md:grid-cols-1 lg:grid-cols-2 xl:gap-8">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="mt-0.5 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-red-100 sm:mt-1 sm:h-12 sm:w-12 sm:rounded-2xl">
                <svg viewBox="0 0 24 24" className="h-5 w-5 text-red-700 sm:h-6 sm:w-6">
                  <path d="M12 3v6l4 2 4-2V3M3 12h7l4 2-4 5H3z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-base font-semibold text-slate-900 sm:text-lg">12+ Years of Experience</p>
                <p className="mt-1 text-xs text-slate-600 sm:text-sm">Trained phlebotomists, validated cold-chain, NABH-style SOPs.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 sm:gap-4">
              <div className="mt-0.5 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-rose-100 sm:mt-1 sm:h-12 sm:w-12 sm:rounded-2xl">
                <svg viewBox="0 0 24 24" className="h-5 w-5 text-rose-700 sm:h-6 sm:w-6">
                  <path d="M12 3S6 11 6 15a6 6 0 1 0 12 0c0-4-6-12-6-12z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-base font-semibold text-slate-900 sm:text-lg">99.8% Traceability</p>
                <p className="mt-1 text-xs text-slate-600 sm:text-sm">End-to-end unit tracking, screening, compatibility checks.</p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4 md:mt-10 lg:gap-6">
            <a 
              href="#about-more" 
              className="group inline-flex items-center justify-center rounded-xl bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:bg-rose-700 hover:shadow-lg sm:rounded-2xl sm:px-6 sm:py-3 sm:text-base md:text-sm lg:text-base"
            >
              About More
              <svg viewBox="0 0 24 24" className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5 sm:h-5 sm:w-5" aria-hidden>
                <path d="M5 12h14M13 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
            <p className="text-xs text-slate-500 sm:text-sm md:max-w-xs lg:max-w-none">
              Join our monthly donor program for consistent support.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
