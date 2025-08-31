"use client";

import Image from "next/image";
import { Autoplay, FreeMode } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";



export type Volunteer = {
  name: string;
  role?: string;
  img: string; 
};

const people: Volunteer[] = [
  {
    name: "Daniel Thomas",
    role: "Volunteer",
    img: "https://cdn.prod.website-files.com/6600e1eab90de089c2d9c9cd/6697274132daf24911799669_6635609f1211ec0f632803d6_fatzFxYM_ad86_raw.jpeg",
  },
  {
    name: "Michel Connor",
    role: "Volunteer",
    img: "https://d1v0ynld5x949x.cloudfront.net/Images/27546/10509799_image.jpg",
  },
  {
    name: "Joseph Alexander",
    role: "Volunteer",
    img: "https://images.ladbible.com/resize?type=webp&quality=70&width=3840&fit=contain&gravity=auto&url=https://images.ladbiblegroup.com/v3/assets/bltb5d92757ac1ee045/blt864986663773d3e0/665435935939380b65262cb8/AI-creates-what-the-average-person.png%3Fcrop%3D590%2C590%2Cx0%2Cy0",
  },
  {
    name: "Jessica Lane",
    role: "Volunteer",
    img: "https://ai-previews.123rf.com/ai-txt2img/600nwm/e94d524f-2c24-4242-a741-6030faa2d6c1.jpg",
  },
  
  {
    name: "Arjun Rao",
    role: "Volunteer",
    img: "https://d1v0ynld5x949x.cloudfront.net/Images/27546/10510371_image.jpg",
  },
];

function loop<T>(arr: T[], times = 3): T[] {
  return Array(times)
    .fill(null)
    .flatMap(() => arr);
}

export default function VolunteersSwiper() {
  const row1 = loop(people, 5);

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-16 md:py-20">
      <div className="mb-10 text-center md:mb-14">
        <div className="mb-3 flex items-center justify-center gap-4">
          <span className="h-px w-12 bg-red-400/80" />
          <span className="text-[15px] italic font-medium text-red-500">Our Volunteer</span>
          <span className="h-px w-12 bg-red-400/80" />
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
          Meet The Optimistic Volunteer
        </h2>
      </div>

      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-7 bg-gradient-to-r from-white to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-7 bg-gradient-to-l from-white to-transparent" />

        <RowSwiper items={row1} speed={4500} />
        
      </div>
    </section>
  );
}

function RowSwiper({
  items,
  speed = 6000,
  reverse = false,
  className = "",
}: {
  items: Volunteer[];
  speed?: number;
  reverse?: boolean;
  className?: string;
}) {
  return (
    <Swiper
      modules={[Autoplay, FreeMode]}
      freeMode={{ enabled: true, momentum: false }}
      slidesPerView="auto"
      spaceBetween={16}
      loop
      allowTouchMove
      speed={speed}
      autoplay={{ delay: 0, disableOnInteraction: false, reverseDirection: reverse }}
      className={className}
    >
      {items.map((v, i) => (
        <SwiperSlide key={`${v.name}-${i}`} className="!w-auto">
          <VolunteerCard v={v} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

function VolunteerCard({ v }: { v: Volunteer }) {
  return (
    <div className="mx-2 w-[260px] shrink-0 select-none overflow-hidden rounded-[28px] bg-rose-50 shadow-sm">
      <div className="relative h-56 w-full -mt-4 overflow-hidden  bg-rose-100">
        <div className="pointer-events-none absolute -bottom-25 left-1/2 z-[1] h-40 w-80 rounded-[899px] bg-rose-900" />

        <Image
          src={v.img}
          alt={v.name}
          fill
          unoptimized
          className="z-0 object-cover"
          sizes="(max-width: 768px) 260px, 260px"
        />
      </div>

      <div className="relative -mt-6 z-[2] flex justify-center">
        <div className="grid h-10 w-10 place-items-center rounded-full bg-rose-400 text-white shadow-lg ring-4 ring-rose-900">
          <span className="-mt-[1px] text-xl leading-none">+</span>
        </div>
      </div>

        <div className="relative z-[0] -mt-4 rounded-b-[28px] bg-rose-900 px-6 pb-6 pt-8 text-center text-white">
        <h3 className="text-lg font-semibold">{v.name}</h3>
        <p className="text-sm text-rose-200">{v.role ?? "Volunteer"}</p>
      </div>
    </div>
  );
}


