"use client";



import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import type { PropsWithChildren } from "react";
import {
  HeartPulse,
  Droplet,
  Users,
  ShieldCheck,
  Stethoscope,
  HandHeart,
  Building2,
  Sparkles,
  Globe2,
  Cpu,
  CalendarCheck,
  Smile,
  Star,
  Headphones,
  UserPlus,
  Newspaper,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Badge,

  Separator,
} from "@/components/ui";

const chips = [
  { id: "mission", label: "Mission" },
  { id: "impact", label: "Impact" },
  { id: "how-it-works", label: "How it works" },
  { id: "safety", label: "Safety" },
  { id: "tech", label: "Tech" },
  { id: "values", label: "Values" },
  { id: "team", label: "Team" },
  { id: "timeline", label: "Timeline" },
  { id: "partners", label: "Partners" },
  { id: "stories", label: "Stories" },
  { id: "faq", label: "FAQ" },
  { id: "careers", label: "Careers" },
  { id: "contact", label: "Contact" },
] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

type SectionProps = PropsWithChildren<{ id: string; className?: string }>;
const Section = ({ id, className = "", children }: SectionProps) => (
  <section id={id} className={`scroll-mt-24 ${className}`}>{children}</section>
);

export default function AboutPage() {
  return (
    <div className="relative min-h-screen w-full mt-20 bg-gradient-to-b from-rose-50 to-white">
      <header className="relative isolate">
        <div
          className="pointer-events-none absolute inset-x-0 -top-24 -z-10 transform-gpu overflow-hidden blur-3xl"
          aria-hidden
        >
          <div className="mx-auto h-[300px] w-[80%] rotate-6 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-rose-200 via-rose-100 to-transparent opacity-70" />
        </div>
        <div className="mx-auto max-w-7xl px-4 pt-16 pb-10 sm:pt-24">
          <motion.div
            className="mx-auto max-w-3xl text-center"
          >
            <Badge className="rounded-full bg-rose-100/80 text-rose-700 hover:bg-rose-100 px-3 py-1">
              BloodMate
            </Badge>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Connecting India’s Donors, Hospitals & Patients—
              <span className="text-rose-600"> the BloodMate way</span>
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              We are building a trusted, tech‑first blood management platform—
              real‑time availability, verified donors, and streamlined requests.
            </p>
            <div className="mt-6 flex items-center justify-center gap-3">
              <Button  className="rounded-2xl">
                <Link href="#contact">Contact us</Link>
              </Button>
              <Button
            
                variant="outline"
                className="rounded-2xl border-rose-200"
              >
                <Link href="#how-it-works">How it works</Link>
              </Button>
            </div>
          </motion.div>

          <div className="sticky top-0 z-20 mt-10 border-y bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/40">
            <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-3">
              {chips.map((c) => (
                <a key={c.id} href={`#${c.id}`} className="shrink-0">
                  <span className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white px-4 py-2 text-sm text-rose-700 hover:bg-rose-50">
                    <Droplet className="h-4 w-4" /> {c.label}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 pb-28">
        <Section id="mission" className="mt-16">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <div className="grid gap-6 md:grid-cols-3">
              <Card className="rounded-2xl">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-gray-900">
                    <HeartPulse className="h-5 w-5 text-rose-600" /> Our Mission
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-gray-600">
                  Ensure no patient waits for blood. We unite donors, hospitals,
                  and communities with transparent, real‑time tools.
                </CardContent>
              </Card>
              <Card className="rounded-2xl">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-gray-900">
                    <ShieldCheck className="h-5 w-5 text-rose-600" /> Our Promise
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-gray-600">
                  Safety first: verified donors, privacy‑aware workflows,
                  audit trails, and role‑based access.
                </CardContent>
              </Card>
              <Card className="rounded-2xl">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-gray-900">
                    <Stethoscope className="h-5 w-5 text-rose-600" /> Who we serve
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-gray-600">
                  Hospitals, blood banks, NGOs, and everyday heroes who step up
                  to donate and save lives.
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </Section>

        <Section id="impact" className="mt-16">
          <div className="grid gap-6 md:grid-cols-4">
            {[
              { icon: Users, label: "Registered Donors", value: "12,500+" },
              { icon: Building2, label: "Partner Hospitals", value: "85+" },
              { icon: CalendarCheck, label: "Requests Fulfilled", value: "9,200+" },
              { icon: Globe2, label: "Cities Covered", value: "40+" },
            ].map((s, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
              >
                <Card className="rounded-2xl border-rose-100">
                  <CardContent className="flex flex-col gap-1 p-6">
                    <s.icon className="h-5 w-5 text-rose-600" />
                    <span className="text-3xl font-semibold text-gray-900">
                      {s.value}
                    </span>
                    <span className="text-sm text-gray-600">{s.label}</span>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </Section>

        <Section id="how-it-works" className="mt-20">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold text-gray-900">How BloodMate works</h2>
            <p className="mt-2 text-gray-600">Three simple steps from need to help.</p>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {[
              {
                icon: HandHeart,
                title: "Request",
                desc: "Hospitals/NGOs raise a verified request with urgency & component details.",
              },
              {
                icon: UserPlus,
                title: "Match",
                desc: "Our engine finds compatible donors nearby and alerts them instantly.",
              },
              {
                icon: Sparkles,
                title: "Fulfil",
                desc: "Secure handoff + confirmations, with status tracking and receipts.",
              },
            ].map((step, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
              >
                <Card className="rounded-2xl">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2">
                      <step.icon className="h-5 w-5 text-rose-600" /> {step.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-gray-600">{step.desc}</CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </Section>

        <Section id="safety" className="mt-20">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="rounded-2xl">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-rose-600" /> Safety & Compliance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-gray-600">
                <p>Role‑based access, activity logs, and data minimization by default.</p>
                <p>Encryption in transit & at rest. Consent‑first donor workflows.</p>
                <p>Configurable to align with national DLT/SMS rules and blood bank SOPs.</p>
              </CardContent>
            </Card>
            <Card className="rounded-2xl">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <Headphones className="h-5 w-5 text-rose-600" /> Support you can trust
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-gray-600">
                <p>Priority hospital/NGO channels with SLAs.</p>
                <p>Incident playbooks, test sandboxes, and transparent status pages.</p>
                <p>Accessible UI with WCAG‑aware color contrast and keyboard support.</p>
              </CardContent>
            </Card>
          </div>
        </Section>

        <Section id="tech" className="mt-20">
          <Card className="rounded-2xl">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Cpu className="h-5 w-5 text-rose-600" /> Our Technology
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-3">
                {[
                  { k: "Realtime", v: "Supabase/WS for live stock & request feeds" },
                  { k: "Search/Match", v: "Geo + eligibility rules, smart throttles" },
                  { k: "Frontend", v: "Next.js, Tailwind, shadcn/ui, Framer Motion" },
                  { k: "Compliance", v: "Audit trails, consent, encryption" },
                  { k: "Observability", v: "Structured logs, metrics, alerts" },
                  { k: "Scalability", v: "Database‑first design, edge caching" },
                ].map((t, i) => (
                  <div key={i} className="rounded-xl border border-rose-100 p-4">
                    <div className="text-sm text-rose-700">{t.k}</div>
                    <div className="text-gray-800">{t.v}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </Section>

        <Section id="values" className="mt-20">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold text-gray-900">Our Values</h2>
            <p className="mt-2 text-gray-600">What anchors every decision we make.</p>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {[
              { icon: HandHeart, title: "Human first", desc: "Design with empathy for donors & patients." },
              { icon: ShieldCheck, title: "Trust by default", desc: "Transparent systems and verifiable actions." },
              { icon: Sparkles, title: "Practical innovation", desc: "Solve yesterday’s bottlenecks with today’s tools." },
            ].map((v, i) => (
              <Card key={i} className="rounded-2xl">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <v.icon className="h-5 w-5 text-rose-600" /> {v.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-gray-600">{v.desc}</CardContent>
              </Card>
            ))}
          </div>
        </Section>

        <Section id="team" className="mt-20">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold text-gray-900">Meet the Team</h2>
            <p className="mt-2 text-gray-600">Tiny team, huge obsession with details.</p>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="rounded-2xl">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 overflow-hidden rounded-2xl bg-rose-100">
                      <Image
                        src="/images/member.jpg"
                        alt={`Team member `}
                        width={160}
                        height={160}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Member {i}</div>
                      <div className="text-sm text-gray-600">Role Ceo / Founder</div>
                    </div>
                  </div>
                  <Separator className="my-4" />
                  <p className="text-sm text-gray-600">
                    Focused on reliability, safety, and delightful UI flows.
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </Section>

        <Section id="timeline" className="mt-20">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold text-gray-900">Our Journey</h2>
            <p className="mt-2 text-gray-600">Milestones that shaped BloodMate.</p>
          </div>
          <div className="mx-auto mt-8 max-w-3xl">
            <ol className="relative border-l border-rose-200">
              {[
                { t: "2023", h: "Prototype", d: "Early MVP to validate donor‑hospital flows." },
                { t: "2024", h: "Pilot", d: "Partnered with hospitals and NGOs across cities." },
                { t: "2025", h: "Scale", d: "Realtime inventory & request orchestration." },
              ].map((e, i) => (
                <li key={i} className="ml-4 pb-8">
                  <span className="absolute -left-[9px] mt-1 inline-flex h-4 w-4 items-center justify-center rounded-full border border-white bg-rose-600" />
                  <div className="text-xs uppercase tracking-wide text-rose-700">{e.t}</div>
                  <div className="text-lg font-semibold text-gray-900">{e.h}</div>
                  <div className="text-gray-600">{e.d}</div>
                </li>
              ))}
            </ol>
          </div>
        </Section>

        <Section id="partners" className="mt-20">
          <Card className="rounded-2xl">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-rose-600" /> Trusted by
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-6">
                {["AstraCare", "LifeLine", "RedCross+", "CareCity", "PulseHub", "HealWorks"].map(
                  (n) => (
                    <div
                      key={n}
                      className="rounded-xl border border-rose-100 p-4 text-center text-sm text-gray-700"
                    >
                      {n}
                    </div>
                  )
                )}
              </div>
            </CardContent>
          </Card>
        </Section>

        {/* Community Stories */}
        <Section id="stories" className="mt-20">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold text-gray-900">Community Stories</h2>
            <p className="mt-2 text-gray-600">Real people. Real impact.</p>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="rounded-2xl">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 text-rose-700">
                    <Smile className="h-4 w-4" />
                    <span className="text-sm font-medium">Story #{i}</span>
                  </div>
                  <p className="mt-2 text-gray-600 text-sm">
                    “The alert reached us in minutes. We coordinated and fulfilled the request the same evening.”
                  </p>
                  <div className="mt-3 flex items-center gap-1 text-amber-500">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star key={idx} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </Section>

        <Section id="faq" className="mt-20">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold text-gray-900">Frequently Asked Questions</h2>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {[
              {
                q: "Is my data safe?",
                a: "Yes. We encrypt data in transit and at rest, and only collect what’s essential.",
              },
              {
                q: "How fast are matches?",
                a: "Urgent requests trigger instant alerts to compatible donors nearby.",
              },
              {
                q: "Do you support components (PRBC/Platelets)?",
                a: "Yes. Requests include component type and urgency.",
              },
              { q: "Can I volunteer?", a: "Absolutely—join as a donor or help our outreach." },
            ].map((f, i) => (
              <Card key={i} className="rounded-2xl">
                <CardHeader className="pb-2">
                  <CardTitle>{f.q}</CardTitle>
                </CardHeader>
                <CardContent className="text-gray-600">{f.a}</CardContent>
              </Card>
            ))}
          </div>
        </Section>

        

        

       
        <Section id="components" className="mt-20">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold text-gray-900">Blood Components We Support</h2>
            <p className="mt-2 text-gray-600">Request and match at component level—right unit, right time.</p>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {["Whole Blood", "PRBC", "Plasma", "Platelets"].map((c) => (
              <div key={c} className="rounded-2xl border border-rose-100 p-5">
                <div className="flex items-center gap-2 text-rose-700">
                  <Droplet className="h-4 w-4" />
                  <span className="font-medium">{c}</span>
                </div>
                <p className="mt-2 text-sm text-gray-600">Stock view, eligibility rules, and request routing are component‑aware.</p>
              </div>
            ))}
          </div>
        </Section>

        <Section id="for-donors" className="mt-20">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="rounded-2xl">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <HandHeart className="h-5 w-5 text-rose-600" /> For Donors
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-gray-600">
                <ul className="list-inside list-disc space-y-2">
                  <li>Smart alerts when a compatible request needs you nearby.</li>
                  <li>Privacy‑first: share only what’s essential for eligibility & matching.</li>
                  <li>Donation history & deferral reminders to keep you eligible.</li>
                </ul>
              </CardContent>
            </Card>
            <Card className="rounded-2xl">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-rose-600" /> For Hospitals & Blood Banks
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-gray-600">
                <ul className="list-inside list-disc space-y-2">
                  <li>Request triage by urgency, component, and blood group with audit trails.</li>
                  <li>Realtime donor pool visibility with eligibility filters.</li>
                  <li>Printable confirmations and optional EHR‑friendly exports.</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </Section>

        <Section id="trust" className="mt-20">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold text-gray-900">Built for Trust</h2>
            <p className="mt-2 text-gray-600">Consent‑first flows, least‑privilege access, and transparent logs.</p>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {[
              { t: "Consent & Privacy", d: "Granular consent gates and easy revocation." },
              { t: "Security", d: "TLS in transit, encryption at rest, role‑based permissions." },
              { t: "Integrity", d: "End‑to‑end activity logs for requests and fulfilments." },
            ].map((x, i) => (
              <Card key={i} className="rounded-2xl">
                <CardHeader className="pb-2"><CardTitle>{x.t}</CardTitle></CardHeader>
                <CardContent className="text-gray-600">{x.d}</CardContent>
              </Card>
            ))}
          </div>
        </Section>

        <Section id="dlt" className="mt-20">
          <Card className="rounded-2xl border-amber-200/60">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Headphones className="h-5 w-5 text-amber-600" /> SMS & Voice
                Compliance (DLT)
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-700">
              We support DLT‑friendly templates and sender IDs. Where SMS is
              constrained, we fall back to in‑app, email, or call‑assist cues—so
              urgent requests still move.
            </CardContent>
          </Card>
        </Section>

        <Section id="press" className="mt-20">
          <Card className="rounded-2xl">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Newspaper className="h-5 w-5 text-rose-600" /> Press & Updates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-3">
                {[1,2,3].map((i) => (
                  <div key={i} className="rounded-xl border border-rose-100 p-4">
                    <div className="text-sm text-rose-700">Aug 2025</div>
                    <div className="font-semibold text-gray-900">BloodMate v2 goes realtime</div>
                    <p className="text-sm text-gray-600">Inventory sync & request orchestration made faster.</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </Section>

        <Section id="cta" className="mt-24">
          <div className="relative overflow-hidden rounded-3xl border border-rose-200 bg-gradient-to-r from-red-600 to-rose-500 p-8 sm:p-12">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-rose-400/40 blur-2xl" />
            <div className="relative z-10 grid gap-6 md:grid-cols-2 md:items-center">
              <div>
                <h3 className="text-2xl font-semibold text-white">Join the BloodMate network</h3>
                <p className="mt-1 text-rose-50/90">Become a donor or onboard your hospital—save time, save lives.</p>
              </div>
              <div className="flex gap-3 md:justify-end">
                <Button className="rounded-2xl border text-rose-700 hover:bg-rose-50">
                  <Link href="#">Become a donor</Link>
                </Button>
                <Button variant="outline" className="rounded-2xl border-white text-white hover:bg-white/10">
                  <Link href="#">Onboard hospital</Link>
                </Button>
              </div>
            </div>
          </div>
        </Section>
      </main>
    </div>
  );
}
