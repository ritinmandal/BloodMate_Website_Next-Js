'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

type ComponentType = 'Whole Blood' | 'PRBC' | 'Plasma' | 'Platelets';
type BloodGroup = 'O+' | 'O-' | 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-';

type StockRow = {
  group: BloodGroup;
  units: number;          
  capacity: number;       
};

type UrgentReq = {
  id: string;
  hospital: string;
  city: string;
  group: BloodGroup;
  component: ComponentType;
  units: number;
  by: string; 
  priority: 'High' | 'Medium' | 'Low';
};

const components: ComponentType[] = ['Whole Blood', 'PRBC', 'Plasma', 'Platelets'];

const seedStocks: Record<ComponentType, StockRow[]> = {
  'Whole Blood': [
    { group: 'O+', units: 120, capacity: 200 },
    { group: 'O-', units: 25,  capacity: 60  },
    { group: 'A+', units: 95,  capacity: 180 },
    { group: 'A-', units: 20,  capacity: 60  },
    { group: 'B+', units: 80,  capacity: 160 },
    { group: 'B-', units: 18,  capacity: 50  },
    { group: 'AB+', units: 30, capacity: 80  },
    { group: 'AB-', units: 8,  capacity: 40  },
  ],
  PRBC: [
    { group: 'O+', units: 90,  capacity: 160 },
    { group: 'O-', units: 22,  capacity: 50  },
    { group: 'A+', units: 70,  capacity: 140 },
    { group: 'A-', units: 15,  capacity: 45  },
    { group: 'B+', units: 64,  capacity: 140 },
    { group: 'B-', units: 14,  capacity: 40  },
    { group: 'AB+', units: 24, capacity: 70  },
    { group: 'AB-', units: 6,  capacity: 30  },
  ],
  Plasma: [
    { group: 'O+', units: 60,  capacity: 160 },
    { group: 'O-', units: 16,  capacity: 40  },
    { group: 'A+', units: 55,  capacity: 140 },
    { group: 'A-', units: 11,  capacity: 35  },
    { group: 'B+', units: 46,  capacity: 120 },
    { group: 'B-', units: 10,  capacity: 30  },
    { group: 'AB+', units: 20, capacity: 60  },
    { group: 'AB-', units: 5,  capacity: 25  },
  ],
  Platelets: [
    { group: 'O+', units: 34,  capacity: 80  },
    { group: 'O-', units: 10,  capacity: 24  },
    { group: 'A+', units: 28,  capacity: 70  },
    { group: 'A-', units: 8,   capacity: 20  },
    { group: 'B+', units: 26,  capacity: 64  },
    { group: 'B-', units: 7,   capacity: 18  },
    { group: 'AB+', units: 12, capacity: 30  },
    { group: 'AB-', units: 3,  capacity: 12  },
  ],
};

const urgentSeed: UrgentReq[] = [
  { id: 'R-101', hospital: 'Apollo Multispeciality', city: 'Kolkata', group: 'O-',  component: 'PRBC',     units: 6, by: 'Today 6:30 PM', priority: 'High' },
  { id: 'R-102', hospital: 'Tata Medical Center',    city: 'New Town', group: 'AB-', component: 'Platelets', units: 4, by: 'Today 9:00 PM', priority: 'High' },
  { id: 'R-103', hospital: 'NRS Medical College',    city: 'Kolkata', group: 'A-',  component: 'Whole Blood', units: 3, by: 'Tomorrow 10:00 AM', priority: 'Medium' },
  { id: 'R-104', hospital: 'AMRI Dhakuria',          city: 'Kolkata', group: 'B+',  component: 'Plasma',    units: 8, by: 'Tomorrow 2:00 PM', priority: 'Low' },
];

export default function StockAndRequests() {
  const [active, setActive] = useState<ComponentType>('Whole Blood');
  const [cityFilter, setCityFilter] = useState('');
  const [search, setSearch] = useState('');
  const [unitMode, setUnitMode] = useState<'units' | 'percent'>('units');

  const filteredUrgent = useMemo(() => {
    return urgentSeed.filter((r) => {
      const byCity = cityFilter ? r.city.toLowerCase().includes(cityFilter.toLowerCase()) : true;
      const byText = search
        ? (r.hospital + r.city + r.group + r.component).toLowerCase().includes(search.toLowerCase())
        : true;
      return byCity && byText;
    });
  }, [cityFilter, search]);

  
  const cardsRef = useRef<HTMLDivElement[]>([]);
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('opacity-100', 'translate-y-0');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    cardsRef.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, [active]);

  const stocks = seedStocks[active];

  return (
    <section id="stock-requests" className="relative bg-rose mb-10">
      <div className="">
      
        <div className="mb-6 flex flex-col items-start justify-between sm:mb-8 md:flex-row md:items-end">
          <div>
            <p className="mb-1 inline-block text-xs font-semibold uppercase tracking-wide text-rose-600 sm:text-sm">
              Operations Hub
            </p>
            <h2 className="text-2xl font-extrabold leading-tight text-slate-900 sm:text-3xl lg:text-4xl">
              Live Stock & Urgent Requests
            </h2>
            <p className="mt-2 text-sm text-slate-600 sm:text-base">
              Track inventory, fulfill hospital needs, and plan collections in real time.
            </p>
          </div>
          <div className="text-xs text-slate-500 sm:text-sm">Last updated: just now</div>
        </div>

      
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {components.map((c) => (
              <button
                key={c}
                onClick={() => setActive(c)}
                className={`rounded-full px-3.5 py-2 text-sm font-semibold transition ${
                  active === c
                    ? 'bg-rose-600 text-white shadow'
                    : 'border border-slate-200 bg-white text-slate-800 hover:border-rose-200'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Display:</span>
            <div className="inline-flex overflow-hidden rounded-full border border-slate-200">
              <button
                className={`px-3 py-1.5 text-xs font-semibold ${
                  unitMode === 'units' ? 'bg-slate-900 text-white' : 'bg-white text-slate-700'
                }`}
                onClick={() => setUnitMode('units')}
              >
                Units
              </button>
              <button
                className={`px-3 py-1.5 text-xs font-semibold ${
                  unitMode === 'percent' ? 'bg-slate-900 text-white' : 'bg-white text-slate-700'
                }`}
                onClick={() => setUnitMode('percent')}
              >
                %
              </button>
            </div>
          </div>
        </div>

        
        <div className="mt-6 grid grid-cols-1 gap-8 lg:mt-8 lg:grid-cols-3">
        
          <div className="lg:col-span-2">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {stocks.map((s, i) => {
                const pct = Math.min(100, Math.round((s.units / s.capacity) * 100));
                const low = pct < 25;
                const med = pct >= 25 && pct < 60;
                const bar = low ? 'bg-amber-500' : med ? 'bg-emerald-400' : 'bg-emerald-600';
                return (
                  <div
                    key={s.group}
                    ref={(el) => el && (cardsRef.current[i] = el)}
                    className="
                      group relative rounded-2xl border border-slate-200 bg-white p-4 shadow-sm
                      opacity-0 translate-y-3 transition-all duration-700 hover:-translate-y-0.5 hover:shadow-lg
                    "
                  >
                
                    <span className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition group-hover:opacity-100 bg-[radial-gradient(120px_120px_at_0%_0%,rgba(244,63,94,0.08),transparent_60%)]" />

                    <div className="flex items-center justify-between">
                      <span className="rounded-lg bg-rose-50 px-2.5 py-1 text-sm font-bold text-rose-600">
                        {s.group}
                      </span>
                      <span className={`text-xs font-semibold ${low ? 'text-amber-600' : 'text-slate-500'}`}>
                        {low ? 'Low' : 'OK'}
                      </span>
                    </div>

                    <div className="mt-3 flex items-end justify-between">
                      <div className="text-2xl font-extrabold text-slate-900">
                        {unitMode === 'units' ? s.units : `${pct}%`}
                      </div>
                      <div className="text-xs text-slate-500">Cap {s.capacity}</div>
                    </div>

                    <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={`h-full ${bar} transition-all duration-700`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>

                    <div className="mt-3 flex items-center gap-2">
                      <button className="rounded-lg border border-slate-200 px-2 py-1 text-xs font-semibold text-slate-700 transition hover:border-rose-200 hover:text-rose-600">
                        Add Units
                      </button>
                      <button className="rounded-lg border border-slate-200 px-2 py-1 text-xs font-semibold text-slate-700 transition hover:border-rose-200 hover:text-rose-600">
                        Move to Quarantine
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

          
            <div className="mt-4 flex items-center gap-4 text-xs text-slate-500">
              <div className="flex items-center gap-1">
                <span className="inline-block h-2 w-3 rounded bg-emerald-600" /> ≥ 60%
              </div>
              <div className="flex items-center gap-1">
                <span className="inline-block h-2 w-3 rounded bg-emerald-400" /> 25–59%
              </div>
              <div className="flex items-center gap-1">
                <span className="inline-block h-2 w-3 rounded bg-amber-500" /> &lt; 25%
              </div>
            </div>
          </div>

        
          <aside
            className="
              group relative rounded-2xl border border-slate-200 bg-white p-4 shadow-sm
              hover:-translate-y-0.5 hover:shadow-lg transition
            "
          >
            <div className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition group-hover:opacity-100 bg-[radial-gradient(140px_120px_at_100%_0%,rgba(16,185,129,.08),transparent_60%)]" />

          
            <div className="flex items-center gap-2">
              <input
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                placeholder="Filter by city"
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-rose-300"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search hospital / group"
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-rose-300"
              />
            </div>

            <h3 className="mt-4 text-base font-semibold text-slate-900">Urgent Requests</h3>

            <div className="mt-2 space-y-2">
              {filteredUrgent.map((r) => (
                <div
                  key={r.id}
                  className="group/item flex items-start justify-between rounded-xl border border-slate-200 bg-white p-3 transition hover:border-rose-200"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700">
                        {r.hospital}
                      </span>
                      <span className="text-xs text-slate-500">• {r.city}</span>
                    </div>
                    <div className="mt-1 text-xs text-slate-500">
                      {r.component} — <span className="font-semibold text-slate-700">{r.group}</span> &middot; {r.units} units
                    </div>
                    <div className="mt-1 text-xs text-slate-500">Needed by: {r.by}</div>
                  </div>

                  <div className="flex flex-col items-end">
                    <span
                      className={`mb-2 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        r.priority === 'High'
                          ? 'bg-rose-100 text-rose-700'
                          : r.priority === 'Medium'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      {r.priority}
                    </span>
                    <div className="flex items-center gap-2">
                      <button className="rounded-lg bg-rose-600 px-2.5 py-1 text-xs font-semibold text-white shadow transition hover:bg-rose-700">
                        Fulfil
                      </button>
                      <button className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700 transition hover:border-rose-200 hover:text-rose-600">
                        View
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {filteredUrgent.length === 0 && (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-center text-sm text-slate-600">
                  No requests match the filters.
                </div>
              )}
            </div>

      
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <button className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-rose-200 hover:text-rose-600">
                Post Urgent Need
              </button>
              <button className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-rose-200 hover:text-rose-600">
                Assign Courier
              </button>
              <button className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-rose-200 hover:text-rose-600">
                Export CSV
              </button>
            </div>
          </aside>
        </div>

        
      </div>
    </section>
  );
}
