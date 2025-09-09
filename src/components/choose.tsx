"use client";

import { useMemo } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { JSX } from "react";
type Item = {
  title: string;
  desc: string;
  iconSrc: string;
};

const ease = [0.22, 1, 0.36, 1] as const;

const headContainer = {
  hidden: { opacity: 0, y: 24 },
  show: (instant: boolean) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: instant ? 0.001 : 0.7,
      ease,
      staggerChildren: instant ? 0 : 0.15,
    },
  }),
};

const headChild = {
  hidden: { opacity: 0, y: 16 },
  show: (instant: boolean) => ({
    opacity: 1,
    y: 0,
    transition: { duration: instant ? 0.001 : 0.6, ease },
  }),
};

const gridContainer = {
  hidden: {},
  show: (instant: boolean) => ({
    transition: { staggerChildren: instant ? 0 : 0.18 },
  }),
};

const cardVariant = {
  hidden: { opacity: 0, y: 64, scale: 0.99 },
  show: (instant: boolean) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: instant ? 0.001 : 0.9, ease },
  }),
};

const arcVariant = {
  hidden: { opacity: 0, y: -12, scale: 0.92 },
  show: (instant: boolean) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: instant ? 0.001 : 0.6,
      ease,
      delay: instant ? 0 : 0.05,
    },
  }),
};

const iconVariant = {
  hidden: { opacity: 0, y: -8, rotateY: -30, scale: 0.92 },
  show: (instant: boolean) => ({
    opacity: 1,
    y: 0,
    rotateY: 0,
    scale: 1,
    transition: {
      duration: instant ? 0.001 : 0.6,
      ease,
      delay: instant ? 0 : 0.12,
    },
  }),
};

export default function WhyChooseUsRed(): JSX.Element {
  const reduceMotion = useReducedMotion();

  const items: Item[] = useMemo(
    () => [
      {
        title: "Verified Requests",
        desc: "All blood requests are validated with hospitals. Donate with confidence.",
        iconSrc: "/images/blood-test1.png",
      },
      {
        title: "Fast Matching",
        desc: "We alert nearby compatible donors instantly to save critical minutes.",
        iconSrc: "/images/blood-test2.png",
      },
      {
        title: "Privacy First",
        desc: "Minimal data, encryption at rest, and full control over sharing.",
        iconSrc: "/images/blood-test3.png",
      },
    ],
    []
  );

  return (
    <section className="relative w-full mt-[170px]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        {/* --- Header --- */}
        <motion.div
          className="text-center mb-12 sm:mb-16"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "0px 0px -80px 0px" }}
          variants={headContainer}
          custom={reduceMotion}
        >
          <motion.div
            className="inline-flex items-center gap-3 font-semibold tracking-wide text-red-500"
            variants={headChild}
            custom={reduceMotion}
          >
            <span className="h-[2px] w-8 rounded-full bg-red-500" />
            Why Choose Us?
            <span className="h-[2px] w-8 rounded-full bg-red-500" />
          </motion.div>

          <motion.h2
            className="mt-4 text-3xl font-bold text-neutral-900 sm:text-4xl md:text-5xl"
            variants={headChild}
            custom={reduceMotion}
          >
            Reliable, Fast &amp; Privacy-Respecting
          </motion.h2>

          <motion.p
            className="mt-4 mx-auto max-w-2xl text-neutral-600"
            variants={headChild}
            custom={reduceMotion}
          >
            Built for real emergencies—verified requests, rapid donor matching,
            and a strong community.
          </motion.p>
        </motion.div>

        <motion.div
          className="z-20 mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:mt-25 lg:grid-cols-3 lg:gap-10 md:grid-cols-1"
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.2 }}
          variants={gridContainer}
          custom={reduceMotion}
        >
          {items.map((it) => (
            <motion.article
              key={it.title}
              className="group relative z-10 overflow-visible rounded-3xl border border-black/5 bg-white/95 p-6 shadow-[0_14px_30px_rgba(0,0,0,0.10)] backdrop-blur-sm transition-transform duration-500 will-change-transform hover:-translate-y-2 hover:shadow-[0_24px_60px_rgba(239,68,68,0.18)] sm:p-7 md:p-8"
              variants={cardVariant}
              custom={reduceMotion}
            >
              <motion.div
                aria-hidden
                className="
    pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2
    h-20 w-20 sm:h-24 sm:w-24 lg:h-28 lg:w-28
    rounded-full border-[8px] sm:border-[10px] lg:border-[12px] border-red-500/80
    z-[-10]
    lg:left-34 lg:translate-x-0 lg:mb-20
  "
                variants={arcVariant}
                custom={reduceMotion}
              />

              <motion.div
                className="
    absolute -top-8 left-1/2 -translate-x-1/2
    inline-flex h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16
    items-center justify-center rounded-2xl bg-white ring-1 ring-black/5 shadow-md
    [transform-style:preserve-3d]
    lg:left-40 lg:translate-x-0 lg:translate-y-3 md:translate-y-3
  "
                variants={iconVariant}
                custom={reduceMotion}
              >
                <Image
                  src={it.iconSrc}
                  alt=""
                  width={64}
                  height={64}
                  sizes="(min-width: 1024px) 4rem, (min-width: 640px) 3.5rem, 3rem"
                  priority
                  className="h-8 w-8 sm:h-10 sm:w-10 lg:h-10 lg:w-10 object-contain"
                />
              </motion.div>

              <span className="pointer-events-none absolute -inset-2 rounded-3xl opacity-0 transition group-hover:opacity-100 bg-[radial-gradient(60%_60%_at_50%_50%,rgba(239,68,68,0.22),transparent_70%)]" />

              <h3 className="mt-12 text-center text-lg font-semibold text-neutral-900 sm:text-xl">
                {it.title}
              </h3>
              <p className="mt-2 text-center leading-relaxed text-neutral-600">
                {it.desc}
              </p>

              <div className="mt-5 flex justify-center">
                <motion.a
                  href="#learn"
                  className="inline-flex items-center gap-2 rounded-full bg-red-500 px-4 py-2 text-sm font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_40px_rgba(239,68,68,0.35)]"
                  whileTap={{ scale: reduceMotion ? 1 : 0.98 }}
                  whileHover={reduceMotion ? {} : { y: -2 }}
                >
                  Learn More
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M7 12h10M13 6l6 6-6 6"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                  </svg>
                </motion.a>
              </div>

              <div className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition group-hover:opacity-100 bg-[radial-gradient(70%_40%_at_50%_0%,rgba(239,68,68,0.12),transparent_70%)]" />
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
