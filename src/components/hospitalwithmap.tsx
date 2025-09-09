// src/components/HospitalsWithMapTailwind.tsx
'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import L, { Map as LeafletMap, Marker as LeafletMarker, DivIcon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { motion, AnimatePresence } from 'framer-motion';
import { Hospital, Search, RefreshCcw, Focus, Phone, MapPin } from 'lucide-react';

import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

// Configure default Leaflet marker assets (safe when only run on client)
L.Icon.Default.mergeOptions({ iconRetinaUrl, iconUrl, shadowUrl });

export type HospitalRow = {
  user_id: string;
  hospital_name: string;
  contact_person: string;
  license_no: string;
  phone: string;
  city: string;
  state: string;
  created_at: string;
};

type Props = {
  height?: number | string;
  defaultZoom?: number;
  maxHospitals?: number;
};

const INDIA_CENTER: [number, number] = [22.9734, 78.6569];

const STATE_MAP: Record<string, string> = {
  WB: 'West Bengal',
  'West-Bengal': 'West Bengal',
  MH: 'Maharashtra',
  TN: 'Tamil Nadu',
  KA: 'Karnataka',
  GJ: 'Gujarat',
  RJ: 'Rajasthan',
  DL: 'Delhi',
  UP: 'Uttar Pradesh',
  KL: 'Kerala',
  MP: 'Madhya Pradesh',
  BR: 'Bihar',
  PB: 'Punjab',
  HR: 'Haryana',
  AS: 'Assam',
  TS: 'Telangana',
  AP: 'Andhra Pradesh',
  Maharastra: 'Maharashtra',
};

const normState = (s?: string | null) => (s ? STATE_MAP[s.trim()] ?? s.trim() : '');

const geocodeCache = new Map<string, { lat: number; lng: number }>();
const latlngByHospital = new Map<string, { lat: number; lng: number }>();

async function geocode(city: string, st: string) {
  const state = normState(st);
  const key = `${city}|${state}`;
  if (geocodeCache.has(key)) return geocodeCache.get(key)!;

  const url = new URL('https://nominatim.openstreetmap.org/search');
  url.searchParams.set('q', `${city}, ${state}, India`);
  url.searchParams.set('format', 'json');
  url.searchParams.set('limit', '1');

  const res = await fetch(url.toString(), {
    headers: { 'User-Agent': 'bloodmate-app/1.0' },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`Geocoding failed (${res.status})`);

  const data: Array<{ lat: string; lon: string }> = await res.json();
  if (!data?.length) throw new Error('Location not found');

  const hit = { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
  geocodeCache.set(key, hit);
  return hit;
}

function hospitalIcon(label?: string): DivIcon {
  const txt = (label ?? 'H').toUpperCase().slice(0, 3);
  const safe = txt.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const html = `
    <svg width="44" height="56" viewBox="0 0 44 56" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id="gB" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#2563eb"/>
          <stop offset="100%" stop-color="#1e40af"/>
        </linearGradient>
      </defs>
      <path d="M22 0C10 0 0 10 0 22c0 14 22 34 22 34s22-20 22-34C44 10 34 0 22 0z" fill="url(#gB)"/>
      <circle cx="22" cy="22" r="12" fill="#ffffff" />
      <text x="22" y="26" text-anchor="middle" font-size="10" font-weight="700" fill="#1e3a8a"
        font-family="system-ui,-apple-system, Segoe UI, Roboto, Arial">${safe}</text>
    </svg>`;
  return L.divIcon({
    className: '',
    html,
    iconSize: [44, 56],
    iconAnchor: [22, 56],
    popupAnchor: [0, -50],
  });
}

export default function HospitalsWithMapTailwind({
  height = '620px',
  defaultZoom = 5,
  maxHospitals = 300,
}: Props) {
  const mapRef = useRef<LeafletMap | null>(null);
  const mapEl = useRef<HTMLDivElement | null>(null);
  const markersRef = useRef<Map<string, LeafletMarker>>(new Map());

  const [rows, setRows] = useState<HospitalRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [q, setQ] = useState('');
  const [plottedCount, setPlottedCount] = useState(0);

  // create map (client-only)
  useEffect(() => {
    if (!mapEl.current || mapRef.current) return;
    mapRef.current = L.map(mapEl.current, { zoomControl: false }).setView(INDIA_CENTER, defaultZoom);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(mapRef.current);
    L.control.zoom({ position: 'bottomright' }).addTo(mapRef.current);
  }, [defaultZoom]);

  // fetch rows
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const { data, error } = await supabase
          .from('hospitals')
          .select(
            'user_id, hospital_name, contact_person, license_no, phone, city, state, created_at'
          )
          .order('created_at', { ascending: false })
          .limit(maxHospitals);

        if (error) throw error;
        if (!mounted) return;
        setRows((data || []) as HospitalRow[]);
      } catch (e: unknown) {
        const msg =
          typeof e === 'object' && e !== null && 'message' in e
            ? (e as { message?: string }).message || 'Failed to load hospitals'
            : 'Failed to load hospitals';
        setError(msg);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [maxHospitals]);

  const rowsWithLoc = useMemo(
    () => rows.filter((r) => r.city && r.state && r.user_id),
    [rows]
  );

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return rowsWithLoc;
    return rowsWithLoc.filter((r) =>
      `${r.hospital_name} ${r.contact_person} ${r.license_no} ${r.phone} ${r.city} ${normState(
        r.state
      )}`
        .toLowerCase()
        .includes(s)
    );
  }, [rowsWithLoc, q]);

  // plot markers
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!mapRef.current) return;
      let plotted = 0;
      const bounds: [number, number][] = [];

      for (const h of filtered) {
        if (cancelled) break;
        try {
          let hit = latlngByHospital.get(h.user_id);
          if (!hit) {
            hit = await geocode(h.city.trim(), h.state.trim());
            latlngByHospital.set(h.user_id, hit);
          }

          const { lat, lng } = hit;
          if (!markersRef.current.get(h.user_id)) {
            const m = L.marker([lat, lng], { icon: hospitalIcon(h.hospital_name) }).addTo(
              mapRef.current
            );
            m.bindPopup(
              `<div style="min-width:240px">
                 <div style="font-weight:600">${h.hospital_name}</div>
                 <div><strong>Contact:</strong> ${h.contact_person}</div>
                 <div><strong>Phone:</strong> ${h.phone}</div>
                 <div><strong>License:</strong> ${h.license_no}</div>
                 <div style="margin-top:4px">${h.city}, ${normState(h.state)}</div>
               </div>`
            );
            markersRef.current.set(h.user_id, m);
          } else {
            markersRef.current
              .get(h.user_id)!
              .setLatLng([lat, lng])
              .setIcon(hospitalIcon(h.hospital_name));
          }

          bounds.push([lat, lng]);
          plotted += 1;
          setPlottedCount(plotted);

          await new Promise((r) => setTimeout(r, 150));
        } catch {
          /* ignore failed geocodes */
        }
      }

      if (!cancelled && bounds.length >= 2)
        mapRef.current!.fitBounds(bounds as L.LatLngBoundsExpression, { padding: [56, 56] });
    })();

    return () => {
      cancelled = true;
    };
  }, [filtered]);

  function focusHospital(h: HospitalRow) {
    if (!mapRef.current || typeof document === 'undefined') return;
    setSelected(h.user_id);
    const m = markersRef.current.get(h.user_id);
    if (m) {
      m.openPopup();
      mapRef.current.setView(m.getLatLng(), 12, { animate: true });
      const overlay = document.createElement('div');
      overlay.className = 'pointer-events-none absolute inset-0 flex items-center justify-center';
      const pulse = document.createElement('div');
      pulse.className = 'w-40 h-40 rounded-full ring-4 ring-blue-500/40 animate-ping';
      overlay.appendChild(pulse);
      mapEl.current?.appendChild(overlay);
      setTimeout(() => overlay.remove(), 700);
    }
  }

  function fitAllMarkers() {
    const pts: [number, number][] = [];
    markersRef.current.forEach((m) => pts.push([m.getLatLng().lat, m.getLatLng().lng]));
    if (pts.length >= 2)
      mapRef.current?.fitBounds(pts as L.LatLngBoundsExpression, { padding: [56, 56] });
  }

  function resetView() {
    mapRef.current?.setView(INDIA_CENTER, defaultZoom, { animate: true });
  }

  function call(phone?: string) {
    if (!phone || typeof window === 'undefined') return;
    window.location.href = `tel:${phone}`;
  }

  const mapHeight = typeof height === 'number' ? `${height}px` : height;

  return (
    <div className="w-full px-4 md:px-6 lg:px-8 py-36">
      {/* header + search */}
      <div className="mb-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-sm">
              <Hospital className="h-5 w-5" />
            </div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">
              Nearby Hospitals
            </h1>
          </div>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search hospital, city, license, phone…"
              className="w-full rounded-xl border border-slate-300 bg-white/80 pl-9 pr-3 py-2 text-sm shadow-sm outline-none
                         focus:ring-4 focus:ring-blue-500/20 focus:border-blue-300"
            />
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-slate-600">
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 shadow-sm">
            {loading ? 'Loading hospitals…' : `Loaded ${rows.length} hospital${rows.length === 1 ? '' : 's'}`}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 shadow-sm">
            Plotted {plottedCount}
          </span>
          {!loading && filtered.length !== rowsWithLoc.length && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 text-amber-800 px-3 py-1 shadow-sm">
              {filtered.length} match{filtered.length === 1 ? '' : 'es'} filter
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
            Fit
          </button>
        </div>
      </div>

      {/* list + map */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
        {/* left list */}
        <motion.div
          initial={{ x: -30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 120, damping: 18 }}
          className="md:col-span-2"
        >
          <div className="rounded-2xl border border-slate-200 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70 overflow-hidden shadow-sm">
            <div className="px-4 py-3 bg-gradient-to-r from-slate-50 to-white border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2 font-semibold text-slate-800">
                <MapPin className="w-4 h-4 text-blue-600" />
                Hospitals
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
                      <div className="h-4 w-48 bg-slate-200 rounded mb-2" />
                      <div className="h-3 w-32 bg-slate-200 rounded mb-3" />
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
                {!loading && filtered.length === 0 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-6 text-slate-500">
                    No hospitals with city/state found.
                  </motion.div>
                )}

                {!loading &&
                  filtered.map((h, i) => (
                    <motion.div
                      key={h.user_id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.02 * i, duration: 0.25 }}
                      className={`p-4 ${selected === h.user_id ? 'bg-blue-50/70' : 'bg-white'} hover:bg-slate-50/70 transition`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xs font-semibold shadow-sm">
                              H
                            </span>
                            <div className="font-medium truncate">{h.hospital_name}</div>
                          </div>
                          <div className="text-xs text-slate-600 truncate mt-0.5">
                            {h.city}, {normState(h.state)}
                          </div>
                          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                            <span className="inline-flex items-center rounded-full bg-blue-50 text-blue-700 px-2 py-0.5 font-semibold ring-1 ring-blue-100">
                              {h.contact_person}
                            </span>
                            <span className="inline-flex items-center rounded-md border border-slate-200 px-2 py-0.5 bg-white text-slate-700">
                              {h.phone}
                            </span>
                            <span className="inline-flex items-center rounded-md border border-slate-200 px-2 py-0.5 bg-white text-slate-700">
                              Lic: {h.license_no}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2 shrink-0">
                          <button
                            onClick={() => focusHospital(h)}
                            className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-slate-900 text-white text-xs px-3 py-1.5 shadow-sm hover:bg-slate-800 active:scale-[0.98] transition"
                            title="Highlight on map"
                          >
                            <Focus className="w-3.5 h-3.5" />
                            Show on map
                          </button>
                          <button
                            onClick={() => call(h.phone)}
                            className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-300 bg-white text-xs px-3 py-1.5 hover:bg-slate-50 active:scale-[0.98] transition"
                            title="Call"
                          >
                            <Phone className="w-3.5 h-3.5" />
                            Call
                          </button>
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                              `${h.hospital_name}, ${h.city}, ${normState(h.state)}`
                            )}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-white text-xs px-3 py-1.5 shadow-sm hover:from-blue-700 hover:to-indigo-700 active:scale-[0.98] transition"
                            title="Open in Google Maps"
                          >
                            <MapPin className="w-3.5 h-3.5" />
                            Directions
                          </a>
                        </div>
                      </div>
                    </motion.div>
                  ))}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* right map */}
        <motion.div
          initial={{ x: 30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 120, damping: 18 }}
          className="relative md:col-span-3"
        >
          <div className="relative z-0 overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
            <div ref={mapEl} style={{ height: mapHeight }} className="rounded-2xl" />
            <div className="pointer-events-none absolute top-3 right-3 flex flex-col gap-2">
              <button
                onClick={fitAllMarkers}
                className="pointer-events-auto inline-flex items-center gap-1.5 rounded-xl bg-white/90 backdrop-blur px-3 py-1.5 text-xs shadow-md border border-slate-200 hover:bg-white transition"
                title="Fit all markers"
              >
                <Focus className="w-3.5 h-3.5 text-slate-700" />
                Fit
              </button>
              <button
                onClick={resetView}
                className="pointer-events-auto inline-flex items-center gap-1.5 rounded-xl bg-white/90 backdrop-blur px-3 py-1.5 text-xs shadow-md border border-slate-200 hover:bg-white transition"
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
