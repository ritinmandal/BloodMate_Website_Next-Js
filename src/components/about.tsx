'use client';

import Image from 'next/image';

export default function AboutUsBloodBank() {
  return (
    <section className="relative w-full overflow-hidden mt-20">
      <div className="pointer-events-none absolute -left-14 top-6 h-40 w-40 rounded-full bg-gradient-to-r from-rose-100 to-red-50 opacity-60 sm:-left-16 sm:top-8 sm:h-56 sm:w-56 md:-left-24 md:top-10 md:h-72 md:w-72 lg:h-80 lg:w-80" />
      <div className="pointer-events-none absolute -right-10 bottom-6 h-32 w-32 rotate-12 rounded-full bg-gradient-to-r from-red-50 to-rose-100 opacity-60 sm:-right-12 sm:bottom-8 sm:h-44 sm:w-44 md:-right-16 md:bottom-10 md:h-56 md:w-56 lg:h-64 lg:w-64" />

      <div className="mx-auto mb-10 text-center sm:mb-12">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-800">
          About Our Blood Bank
        </h1>
        <div className="mx-auto mt-3 h-1 w-24 rounded-full bg-red-600/80" />
        <p className="mx-auto mt-3 max-w-2xl text-sm sm:text-base text-slate-600">
          Learn more about our mission, volunteers, and how we ensure every unit
          of blood is handled with care and safety.
        </p>
      </div>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 pb-14 sm:px-6 md:grid-cols-2 lg:gap-14 lg:px-8">
        <div className="relative order-2 md:order-1">
          <div className="relative mx-auto w-full max-w-[520px] md:max-w-none md:w-[88%] lg:w-[84%]">
            <div
              className="
                relative mx-auto w-[86%] sm:w-[88%] md:w-[78%] lg:w-[86%]
                -translate-y-2 sm:-translate-y-3 md:translate-y-0
                md:ml-[14%] lg:ml-[16%]
              "
            >
              <Image
                src="/images/blood_about_1.png"
                alt="Donor giving blood in a safe environment"
                width={1040}
                height={700}
                className="w-full h-auto rounded-2xl sm:rounded-3xl md:rounded-[28px] object-cover shadow-lg"
                priority
                sizes="(max-width: 768px) 86vw, (max-width: 1024px) 44vw, 38vw"
              />
              <span className="pointer-events-none absolute inset-0 rounded-2xl ring-4 ring-white sm:rounded-3xl sm:ring-6 md:rounded-[28px] md:ring-8" />
            </div>

            <div
              className="
                relative
                -mt-3 sm:-mt-5 md:-mt-8 lg:-mt-10
                w-[92%] sm:w-[90%] md:w-[74%] lg:w-[72%]
                md:ml-[4%] lg:ml-[6%]
                rounded-2xl sm:rounded-3xl md:rounded-[28px]
                shadow-xl ring-4 sm:ring-6 md:ring-8 ring-white
              "
            >
              <Image
                src="/images/blood_about_2.png"
                alt="Community volunteers supporting the blood bank"
                width={1200}
                height={800}
                className="w-full h-auto rounded-2xl sm:rounded-3xl md:rounded-[28px] object-cover"
                sizes="(max-width: 768px) 92vw, (max-width: 1024px) 38vw, 34vw"
              />
            </div>

            <div
              className="
                absolute
                right-2 -bottom-4
                sm:right-3 sm:-bottom-6
                md:right-[6%] md:-bottom-2
                lg:right-[8%] lg:-bottom-10
                rounded-2xl sm:rounded-3xl md:rounded-[36px]
                bg-red-900 text-white
                px-3 py-2.5 sm:px-4 sm:py-3.5 md:px-6 md:py-4 lg:px-7 lg:py-5
                shadow-lg ring-4 sm:ring-6 md:ring-8 ring-white
              "
            >
              <p className="text-sm font-bold leading-tight sm:text-base md:text-lg lg:text-[18px]">
                <span className="block text-base font-extrabold sm:text-lg md:text-xl lg:text-2xl">
                  75,000+
                </span>
                <span className="text-xs sm:text-sm md:text-base">Units Safely Managed</span>
              </p>
              <a
                href="#become-volunteer"
                className="mt-1 inline-block text-[10px] sm:text-xs md:text-sm lg:text-[15px] font-medium sm:font-semibold underline underline-offset-2 sm:underline-offset-4 hover:text-red-200 transition-colors"
              >
                Become A Volunteer
              </a>
            </div>
          </div>
        </div>

        <div className="order-1 md:order-2 flex flex-col justify-center">
          <div className="mb-3 sm:mb-4 flex items-center gap-2">
            <span className="inline-flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full border border-rose-300">
              <svg viewBox="0 0 24 24" className="h-3 w-3 sm:h-4 sm:w-4 text-rose-500">
                <path
                  d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <p className="text-xs sm:text-sm font-medium sm:font-semibold text-rose-600">
              About Us
            </p>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-2xl lg:text-3xl xl:text-4xl font-bold sm:font-extrabold tracking-tight text-slate-900">
            Give Blood, Change Lives
            <br className="hidden sm:block" />
            <span className="text-xl sm:text-2xl md:text-xl lg:text-2xl xl:text-3xl">
              {' '}Volunteer Opportunities
            </span>
          </h2>

          <p className="mt-4 sm:mt-5 max-w-2xl text-sm sm:text-base md:text-sm lg:text-base xl:text-lg text-slate-600">
            Our secure blood bank platform lets you donate, schedule, or run a camp
            with ease. Your support keeps emergency care ready and communities safe.
          </p>

          <div className="mt-6 sm:mt-8 grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 xl:gap-8">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="mt-0.5 sm:mt-1 flex h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0 items-center justify-center rounded-xl sm:rounded-2xl bg-red-100">
                <svg viewBox="0 0 24 24" className="h-5 w-5 sm:h-6 sm:w-6 text-red-700">
                  <path
                    d="M12 3v6l4 2 4-2V3M3 12h7l4 2-4 5H3z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-base sm:text-lg font-semibold text-slate-900">
                  12+ Years of Experience
                </p>
                <p className="mt-1 text-xs sm:text-sm text-slate-600">
                  Trained phlebotomists, validated cold-chain, NABH-style SOPs.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 sm:gap-4">
              <div className="mt-0.5 sm:mt-1 flex h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0 items-center justify-center rounded-xl sm:rounded-2xl bg-rose-100">
                <svg viewBox="0 0 24 24" className="h-5 w-5 sm:h-6 sm:w-6 text-rose-700">
                  <path
                    d="M12 3S6 11 6 15a6 6 0 1 0 12 0c0-4-6-12-6-12z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-base sm:text-lg font-semibold text-slate-900">
                  99.8% Traceability
                </p>
                <p className="mt-1 text-xs sm:text-sm text-slate-600">
                  End-to-end unit tracking, screening, compatibility checks.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 md:mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4 lg:gap-6">
            <a
              href="#about-more"
              className="group inline-flex items-center justify-center rounded-xl sm:rounded-2xl bg-rose-600 px-5 py-2.5 sm:px-6 sm:py-3 text-sm sm:text-base md:text-sm lg:text-base font-semibold text-white shadow-md transition-all duration-200 hover:bg-rose-700 hover:shadow-lg"
            >
              About More
              <svg
                viewBox="0 0 24 24"
                className="ml-2 h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:translate-x-0.5"
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
            </a>
            <p className="text-xs sm:text-sm text-slate-500 md:max-w-xs lg:max-w-none">
              Join our monthly donor program for consistent support.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
