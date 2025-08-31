"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Droplet, Phone, AtSign } from "lucide-react";
import Image from "next/image";



const LOGO_SRC = "/images/logo2.png"; 

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    await new Promise((r) => setTimeout(r, 800));

    setLoading(false);
    setPopup(true);
    setTimeout(() => setPopup(false), 2400);
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br mt-20 from-rose-50 via-red-50 to-rose-100">
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-rose-200/60 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 top-36 h-80 w-80 rounded-full bg-red-200/50 blur-3xl" />

      {popup && (
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          className="fixed left-1/2 top-6 z-50 -translate-x-1/2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-medium text-white shadow-xl"
          role="status"
          aria-live="polite"
        >
          ✅ Message sent successfully!
        </motion.div>
      )}

      <div className="mx-auto grid min-h-screen max-w-6xl grid-cols-1 items-center gap-10 px-5 py-12 md:grid-cols-2 md:py-16">
        <motion.div
          initial={{ opacity: 0, x: -18 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="relative flex flex-col items-center gap-4 text-center md:items-start md:text-left"
        >
          <motion.div
            className="absolute -left-6 -top-6 hidden h-24 w-24 rounded-full bg-rose-400/20 md:block"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
          />

          <Image
            src={LOGO_SRC}
            width={100}
            height={100}
            alt="BloodMate Logo"
            className="mb-2 h-40 mx-30 w-auto drop-shadow md:h-56"
          />

          <h1 className="bg-gradient-to-r from-rose-700 via-red-600 to-rose-600 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent md:text-5xl">
            Contact BloodMate
          </h1>
          <p className="max-w-md text-slate-700">
            We’re here for donation queries, urgent requests, and collaboration opportunities.
            Your message helps us connect donors and recipients faster.
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-rose-700/90">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1.5 shadow-sm ring-1 ring-rose-200">
              <Droplet className="h-4 w-4" /> Donation Support
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1.5 shadow-sm ring-1 ring-rose-200">
              <Phone className="h-4 w-4" /> +91‑98765‑43210
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1.5 shadow-sm ring-1 ring-rose-200">
              <AtSign className="h-4 w-4" /> help@bloodmate.in
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 18 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full"
        >
          <div className="rounded-3xl border border-rose-100 bg-white/90 p-6 shadow-xl backdrop-blur md:p-8">
            <h2 className="text-xl font-semibold text-slate-900">Send us a message</h2>
            <p className="mt-1 text-sm text-slate-600">
              We typically respond within 24–48 hours.
            </p>

            <form onSubmit={onSubmit} className="mt-6 space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field label="Your Name">
                  <input required name="name" className="input" placeholder="Enter Name" />
                </Field>
                <Field label="Email">
                  <input required type="email" name="email" className="input" placeholder="you@example.com" />
                </Field>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field label="Phone (optional)">
                  <input name="phone" className="input" placeholder="+91‑XXXXXXXXXX" />
                </Field>
                <Field label="Topic">
                  <select name="topic" className="input">
                    <option value="donation">Blood Donation</option>
                    <option value="request">Blood Request</option>
                    <option value="partnership">Partnership</option>
                    <option value="general">General Query</option>
                  </select>
                </Field>
              </div>

              <Field label="Subject">
                <input required name="subject" className="input" placeholder="How can we help?" />
              </Field>

              <Field label="Message">
                <textarea
                  required
                  cols={55}
                  rows={5}
                  name="message"
                  className="input h-36 resize-none"
                  placeholder="Write your message here..."
                />
              </Field>

              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="group inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 px-6 py-3 font-semibold text-white shadow-lg shadow-red-200 transition disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? (
                  "Sending..."
                ) : (
                  <>
                    Send Message
                    <Send className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-left">
      <span className="mb-1 block text-xs font-semibold tracking-wide text-rose-800/90">{label}</span>
      {children}
    </label>
  );
}

