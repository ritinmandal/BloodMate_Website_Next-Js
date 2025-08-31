"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { CalendarClock, MapPin, ChevronLeft, ChevronRight } from "lucide-react";

const campaigns = [
  {
    id: 1,
    date: "14 JUNE, 2017",
    title: "WORLD BLOOD DONORS DAY",
    description:
      "Every year, on 14 June, countries around the world celebrate World Blood Donor Day. The event serves to thank voluntary.",
    time: "10.00am - 3.00pm",
    location: "California, USA",
    image: "/images/c1.jpg",
  },
  {
    id: 2,
    date: "20 SEP, 2017",
    title: "O- BLOOD DONORS NEEDED",
    description:
      "O Negative blood cells are called “universal” meaning they can be transfused to almost any patient in need and blood cells are safest.",
    time: "10.00am - 3.00pm",
    location: "California, USA",
    image: "/images/c2.jpg",
  },
  {
    id: 3,
    date: "20 SEP, 2017",
    title: "YOU ARE SOMEBODY’S TYPE",
    description:
      "Many people has same blood group like you. So donate now and bring smiles in their face and encourage others to donate blood.",
    time: "10.00am - 3.00pm",
    location: "California, USA",
    image: "/images/c3.jpg",
  },
  {
    id: 4,
    date: "20 SEP, 2017",
    title: "DONATION – FEEL REAL PEACE",
    description:
      "You're the real hero because you can gift a new life for patient. So donate your blood and enjoy a precious life. Don't fear, it's really easy.",
    time: "10.00am - 3.00pm",
    location: "California, USA",
    image: "/images/c4.jpg",
  },
];

const gallery = [
  "/images/c1.jpg",
  "/images/c2.jpg",
  "/images/c3.jpg",
  "/images/c4.jpg",
  "/images/c5.jpg",
  "/images/c6.jpg",
  "/images/c7.jpg",
];

export default function CampaignsPage() {
  return (
    <main className="min-h-mt-20 py-30 screen bg-white">
      <div className="mx-auto max-w-6xl px-4 pt-12">
        <HeaderBlock
          title="DONATION CAMPAIGNS"
          subtitle="Campaigns to encourage new donors to join and existing to continue to give blood."
        />

        <div className="mt-12 grid gap-12 md:grid-cols-2">
          {campaigns.map((c) => (
            <CampaignCard key={c.id} campaign={c} />
          ))}
        </div>
      </div>

      <div className="mx-auto mt-16 max-w-6xl px-4 pb-16">
        <HeaderBlock
          title="PHOTO GALLERY"
          subtitle="Campaign photos of different parts of world and our prestigious voluntary work"
        />
        <GallerySlider images={gallery} />
      </div>
    </main>
  );
}

function CampaignCard({
  campaign: c,
}: {
  campaign: {
    id: number;
    date: string;
    title: string;
    description: string;
    time: string;
    location: string;
    image: string;
  };
}) {
  const [broken, setBroken] = useState(false);

  return (
    <article className="overflow-hidden rounded-sm">
      <div className="grid grid-cols-1 md:grid-cols-[300px,1fr]">
        <div className="relative h-[244px] mx-auto w-[300px] bg-gray-200">
          {!broken ? (
            <Image
              src={c.image}
              alt={c.title}
              fill
              className="object-fill"
              onError={() => setBroken(true)}
              priority
            />
          ) : (
            <Image
              src={c.image}
              alt={c.title}
              className="absolute inset-0 h-full w-full "
            />
          )}
        </div>

        <div className="bg-gray-50 px-6 py-6 ring-1 ring-gray-200">
          <div className="inline-block bg-gray-800 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
            {c.date}
          </div>

          <h3 className="mt-3 text-[22px] leading-7 font-semibold uppercase tracking-wide text-rose-600">
            {c.title}
          </h3>

          <p className="mt-3 text-[15px] leading-7 text-gray-700">
            {c.description}
          </p>

          <div className="mt-4 flex items-center gap-5 text-[13px] text-gray-500">
            <span className="inline-flex items-center gap-2">
              <CalendarClock className="h-4 w-4" />
              {c.time}
            </span>
            <span className="inline-flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              {c.location}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}

function HeaderBlock({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="text-center">
      <h1 className="text-3xl md:text-4xl font-extrabold uppercase tracking-wide">
        {title}
      </h1>

      <div className="mt-4 inline-flex items-center gap-3">
        <span className="h-[2px] w-20 bg-rose-500/50" />
        <span className="grid h-7 w-7 place-items-center rounded-full border border-rose-400 text-rose-600">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 2C12 2 5 9.5 5 14a7 7 0 1 0 14 0C19 9.5 12 2 12 2z" />
          </svg>
        </span>
        <span className="h-[2px] w-20 bg-rose-500/50" />
      </div>

      <p className="mx-auto mt-3 max-w-3xl text-[15px] text-gray-600">
        {subtitle}
      </p>
    </div>
  );
}

function GallerySlider({ images }: { images: string[] }) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(2); 

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setVisible(mq.matches ? 5 : 2);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const onScroll = () => {
      const cardW = el.clientWidth / visible;
      setIndex(Math.round(el.scrollLeft / cardW));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [visible]);

  function scrollTo(i: number) {
    const el = trackRef.current;
    if (!el) return;
    const cardW = el.clientWidth / visible;
    el.scrollTo({ left: i * cardW, behavior: "smooth" });
    setIndex(i);
  }

  const maxIndex = Math.max(0, images.length - visible);
  const prev = () => scrollTo(Math.max(0, index - 1));
  const next = () => scrollTo(Math.min(maxIndex, index + 1));

  return (
    <div className="relative mt-10">
      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth gap-4 no-scrollbar"
        style={{ touchAction: "pan-x" }}
      >
        {images.map((src, i) => (
          <div
            key={src + i}
            className="relative h-44 snap-start shrink-0 overflow-hidden rounded shadow"
            style={{ width: `calc((100% - ${visible === 5 ? "64px" : "16px"}) / ${visible})` }}
          >
            <Image src={src} alt={`Gallery ${i + 1}`} fill className="object-cover" />
          </div>
        ))}
      </div>

      <button
        onClick={prev}
        className="absolute -left-2 top-1/2 -translate-y-1/2 grid h-9 w-9 place-items-center rounded bg-rose-500 text-white shadow hover:bg-rose-600"
        aria-label="Previous"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={next}
        className="absolute -right-2 top-1/2 -translate-y-1/2 grid h-9 w-9 place-items-center rounded bg-rose-500 text-white shadow hover:bg-rose-600"
        aria-label="Next"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      <div className="mt-6 flex justify-center gap-2">
        {Array.from({ length: maxIndex + 1 }).map((_, i) => (
          <button
            key={i}
            onClick={() => scrollTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-2.5 w-2.5 rounded-full transition ${
              i === index ? "bg-rose-600" : "bg-rose-300 hover:bg-rose-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

