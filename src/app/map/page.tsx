// components/DonorsWithMapTailwind.tsx
'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import L, { Map as LeafletMap, Marker as LeafletMarker, DivIcon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Search, RefreshCcw, Focus } from 'lucide-react';

import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';
L.Icon.Default.mergeOptions({ iconRetinaUrl, iconUrl, shadowUrl });

type Donor = {
  id: string;
  user_id: string;
  full_name: string | null;
  city: string | null;
  state: string | null;
  latitude: number | null;
  longitude: number | null;
  blood_group: string | null;
  phone: string | null;
  gender: string | null;
};

const INDIA_CENTER: [number, number] = [22.9734, 78.6569];
const STATE_MAP: Record<string, string> = {
  WB: 'West Bengal', 'West-Bengal': 'West Bengal', MH: 'Maharashtra', TN: 'Tamil Nadu', KA: 'Karnataka', GJ: 'Gujarat', RJ: 'Rajasthan',
  DL: 'Delhi', UP: 'Uttar Pradesh', KL: 'Kerala', MP: 'Madhya Pradesh', BR: 'Bihar', PB: 'Punjab', HR: 'Haryana', AS: 'Assam', TS: 'Telangana', AP: 'Andhra Pradesh',
  Maharastra: 'Maharashtra',
};
const normState = (s?: string | null) => (s ? STATE_MAP[s.trim()] ?? s.trim() : '');

const geocodeCache = new Map<string, { lat: number; lng: number }>();
async function geocode(city: string, st: string) {
  const state = normState(st);
  const key = `${city}|${state}`;
  if (geocodeCache.has(key)) return geocodeCache.get(key)!;
  const url = new URL('https://nominatim.openstreetmap.org/search');
  url.searchParams.set('q', `${city}, ${state}, India`);
  url.searchParams.set('format', 'json');
  url.searchParams.set('limit', '1');
  const res = await fetch(url.toString(), { headers: { 'User-Agent': 'bloodmate-app/1.0' }, cache: 'no-store' });
  if (!res.ok) throw new Error(`Geocoding failed (${res.status})`);
  const data: Array<{ lat: string; lon: string }> = await res.json();
  if (!data?.length) throw new Error('Location not found');
  const hit = { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
  geocodeCache.set(key, hit);
  return hit;
}

function pinIcon(blood: string | null | undefined): DivIcon {
  const label = (blood ?? '').toUpperCase();
  const html = `
    <svg width="44" height="56" viewBox="0 0 44 56" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#ef4444"/>
          <stop offset="100%" stop-color="#b91c1c"/>
        </linearGradient>
      </defs>
      <path d="M22 0C10 0 0 10 0 22c0 14 22 34 22 34s22-20 22-34C44 10 34 0 22 0z" fill="url(#g)"/>
      <circle cx="22" cy="22" r="12" fill="#ffffff" />
      <text x="22" y="26" text-anchor="middle" font-size="10" font-weight="700" fill="#b91c1c"
        font-family="system-ui,-apple-system, Segoe UI, Roboto, Arial">
        ${label.replace(/</g, '&lt;').replace(/>/g, '&gt;')}
      </text>
    </svg>`;
  return L.divIcon({ className: '', html, iconSize: [44, 56], iconAnchor: [22, 56], popupAnchor: [0, -50] });
}

export default function DonorsWithMapTailwind({
  height = '620px',
  maxDonors = 300,
  defaultZoom = 5,
}: { height?: string; maxDonors?: number; defaultZoom?: number }) {
  const router = useRouter();
  const mapRef = useRef<LeafletMap | null>(null);
  const mapEl = useRef<HTMLDivElement | null>(null);
  const markersRef = useRef<Map<string, LeafletMarker>>(new Map());

  const [donors, setDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [q, setQ] = useState('');
  const [plottedCount, setPlottedCount] = useState(0);

  useEffect(() => {
    if (!mapEl.current || mapRef.current) return;
    mapRef.current = L.map(mapEl.current, { zoomControl: false }).setView(INDIA_CENTER, defaultZoom);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(mapRef.current);
    L.control.zoom({ position: 'bottomright' }).addTo(mapRef.current);
  }, [defaultZoom]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const { data, error } = await supabase
          .from('donors')
          .select('id, user_id, full_name, city, state, latitude, longitude, blood_group, phone, gender, created_at')
          .order('created_at', { ascending: false })
          .limit(maxDonors);
        if (error) throw error;
        if (!mounted) return;
        setDonors((data || []) as Donor[]);
      } catch (e: any) {
        setError(e?.message || 'Failed to load donors');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [maxDonors]);

  const donorsWithLoc = useMemo(() => donors.filter(d => d.city && d.state && d.id), [donors]);

  const donorsFiltered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return donorsWithLoc;
    return donorsWithLoc.filter(d =>
      `${d.full_name ?? ''} ${d.city} ${normState(d.state)} ${d.user_id} ${d.blood_group ?? ''} ${d.phone ?? ''} ${d.gender ?? ''}`
        .toLowerCase()
        .includes(s)
    );
  }, [donorsWithLoc, q]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!mapRef.current) return;
      let plotted = 0;
      const bounds: [number, number][] = [];
      for (const d of donorsFiltered) {
        if (cancelled) break;
        try {
          let lat = d.latitude ?? undefined;
          let lng = d.longitude ?? undefined;
          if (lat == null || lng == null) {
            const hit = await geocode(d.city!.trim(), d.state!.trim());
            lat = hit.lat; lng = hit.lng;
            await supabase.from('donors').update({ latitude: lat, longitude: lng }).eq('id', d.id);
          }
          if (!markersRef.current.get(d.id)) {
            const m = L.marker([lat!, lng!], { icon: pinIcon(d.blood_group) }).addTo(mapRef.current);
            m.bindPopup(
              `<div style="min-width:220px">
                 <div style="font-weight:600">${(d.full_name && d.full_name.trim()) || d.user_id}</div>
                 <div><strong>Blood:</strong> ${d.blood_group ?? '—'}</div>
                 <div><strong>Gender:</strong> ${d.gender ?? '—'}</div>
                 <div><strong>Phone:</strong> ${d.phone ?? '—'}</div>
                 <div style="margin-top:4px">${d.city}, ${normState(d.state)}</div>
               </div>`
            );
            markersRef.current.set(d.id, m);
          } else {
            markersRef.current.get(d.id)!.setLatLng([lat!, lng!]).setIcon(pinIcon(d.blood_group));
          }
          bounds.push([lat!, lng!]);
          plotted += 1; setPlottedCount(plotted);
          await new Promise(r => setTimeout(r, 180));
        } catch { }
      }
      if (!cancelled && bounds.length >= 2) mapRef.current!.fitBounds(bounds as any, { padding: [56, 56] });
    })();
    return () => { cancelled = true; };
  }, [donorsFiltered]);

  async function focusDonor(d: Donor) {
    if (!mapRef.current) return;
    setSelected(d.id);
    const m = markersRef.current.get(d.id);
    if (m) {
      m.openPopup();
      mapRef.current.setView(m.getLatLng(), 12, { animate: true });
      const overlay = document.createElement('div');
      overlay.className = 'pointer-events-none absolute inset-0 flex items-center justify-center';
      const pulse = document.createElement('div');
      pulse.className = 'w-40 h-40 rounded-full ring-4 ring-red-500/40 animate-ping';
      overlay.appendChild(pulse);
      mapEl.current?.appendChild(overlay);
      setTimeout(() => overlay.remove(), 700);
    }
  }

  function requestBlood(d: Donor) {
    const qs = new URLSearchParams({
      uid: d.user_id,
      id: d.id,
      name: d.full_name ?? '',
      bg: d.blood_group ?? '',
      city: d.city ?? '',
      state: normState(d.state) ?? '',
    }).toString();
    router.push(`/requesting?${qs}`);
  }

  function fitAllMarkers() {
    const pts: [number, number][] = [];
    markersRef.current.forEach(m => pts.push([m.getLatLng().lat, m.getLatLng().lng]));
    if (pts.length >= 2) mapRef.current?.fitBounds(pts as any, { padding: [56, 56] });
  }

  function resetView() {
    mapRef.current?.setView(INDIA_CENTER, defaultZoom, { animate: true });
  }


  return (
    <div className="w-full px-4 md:px-6 lg:px-8 py-40">
      <div className="mb-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-rose-600 text-white shadow-sm">
              <MapPin className="h-5 w-5" />
            </div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">
              Nearby Blood Donors
            </h1>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search name, city, state, group, phone…"
              className="w-full rounded-xl border border-slate-300 bg-white/80 pl-9 pr-3 py-2 text-sm shadow-sm outline-none
                         focus:ring-4 focus:ring-red-500/20 focus:border-red-300"
            />
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-slate-600">
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 shadow-sm">
            {loading ? 'Loading donors…' : `Loaded ${donors.length} donor${donors.length === 1 ? '' : 's'}`}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 shadow-sm">
            Plotted {plottedCount}
          </span>
          {(!loading && donorsFiltered.length !== donorsWithLoc.length) && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 text-amber-800 px-3 py-1 shadow-sm">
              {donorsFiltered.length} match{donorsFiltered.length === 1 ? '' : 'es'} filter
            </span>
          )}
          {error && (
            <span className="inline-flex items-center gap-1 rounded-full bg-red-100 text-red-700 px-3 py-1 shadow-sm">
              {error}
            </span>
          )}
          <button
            onClick={fitAllMarkers}
            className="ml-1 inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs
                       hover:bg-slate-50 active:scale-[0.98] transition"
            title="Fit all markers"
          >
            <Focus className="w-3.5 h-3.5" />
            Fit all
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
        <motion.div
          initial={{ x: -30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 120, damping: 18 }}
          className="md:col-span-2"
        >
          <div className="rounded-2xl border border-slate-200 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70 overflow-hidden shadow-sm">
            <div className="px-4 py-3 bg-gradient-to-r from-slate-50 to-white border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2 font-semibold text-slate-800">
                <MapPin className="w-4 h-4 text-red-600" />
                Donors
              </div>
              <button
                onClick={resetView}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs
                           hover:bg-slate-50 active:scale-[0.98] transition"
                title="Reset map view"
              >
                <RefreshCcw className="w-3.5 h-3.5" />
                Reset
              </button>
            </div>

            <div className="max-h-[640px] overflow-y-auto divide-y divide-slate-100">
              {loading && (
                <div className="p-4 space-y-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-4 w-40 bg-slate-200 rounded mb-2" />
                      <div className="h-3 w-24 bg-slate-200 rounded mb-3" />
                      <div className="flex gap-2">
                        <div className="h-6 w-16 bg-slate-200 rounded" />
                        <div className="h-6 w-20 bg-slate-200 rounded" />
                        <div className="h-6 w-28 bg-slate-200 rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <AnimatePresence initial={false}>
                {!loading && donorsFiltered.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="p-6 text-slate-500"
                  >
                    No donors with city/state found.
                  </motion.div>
                )}

                {!loading && donorsFiltered.map((d, i) => {
                  const displayName = (d.full_name && d.full_name.trim()) || d.user_id;
                  return (
                    <motion.div
                      key={d.id}
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.02 * i, duration: 0.25 }}
                      className={`p-4 ${selected === d.id ? 'bg-rose-50/70' : 'bg-white'} hover:bg-slate-50/70 transition`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-rose-600 text-white text-xs font-semibold shadow-sm">
                              {(d.blood_group ?? '—').toUpperCase()}
                            </span>
                            <div className="font-medium truncate">{displayName}</div>
                          </div>
                          <div className="text-xs text-slate-600 truncate mt-0.5">{d.city}, {normState(d.state)}</div>
                          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                            <span className="inline-flex items-center rounded-full bg-rose-50 text-rose-700 px-2 py-0.5 font-semibold ring-1 ring-rose-100">
                              {d.gender ?? '—'}
                            </span>
                            <span className="inline-flex items-center rounded-md border border-slate-200 px-2 py-0.5 text-slate-700 bg-white">
                              {d.phone ?? '—'}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2 shrink-0">
                          <button
                            onClick={() => focusDonor(d)}
                            className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-slate-900 text-white text-xs px-3 py-1.5
                                       shadow-sm hover:bg-slate-800 active:scale-[0.98] transition"
                            title="Highlight on map"
                          >
                            <Focus className="w-3.5 h-3.5" />
                            Show on map
                          </button>

                          <button
                            onClick={() => requestBlood(d)}
                            className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-gradient-to-br from-red-600 to-rose-600 text-white text-xs px-3 py-1.5
                                       shadow-sm hover:from-red-700 hover:to-rose-700 active:scale-[0.98] transition"
                            title="Notify this donor by email"
                          >
                            Request blood
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ x: 30, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 120, damping: 18 }}
          className="relative md:col-span-3"
        >
          <div className="relative overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
            <div
              ref={mapEl}
              style={{ height }}
              className="rounded-2xl"
            />
            <div className="pointer-events-none absolute top-3 right-3 flex flex-col gap-2">
              <button
                onClick={fitAllMarkers}
                className="pointer-events-auto inline-flex items-center gap-1.5 rounded-xl bg-white/90 backdrop-blur px-3 py-1.5 text-xs shadow-md
                           border border-slate-200 hover:bg-white transition"
                title="Fit all markers"
              >
                <Focus className="w-3.5 h-3.5 text-slate-700" />
                Fit
              </button>
              <button
                onClick={resetView}
                className="pointer-events-auto inline-flex items-center gap-1.5 rounded-xl bg-white/90 backdrop-blur px-3 py-1.5 text-xs shadow-md
                           border border-slate-200 hover:bg-white transition"
                title="Reset view"
              >
                <RefreshCcw className="w-3.5 h-3.5 text-slate-700" />
                Reset
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
