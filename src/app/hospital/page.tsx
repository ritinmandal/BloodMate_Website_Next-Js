"use client"
import dynamic from 'next/dynamic';

const HospitalsWithMapTailwind = dynamic(
  () => import('@/components/hospitalwithmap'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full px-4 md:px-6 lg:px-8 py-36">
        <div className="h-[620px] rounded-2xl border border-slate-200 bg-white/60 animate-pulse" />
      </div>
    ),
  }
);

export default function Page() {
  return <HospitalsWithMapTailwind />;
}
