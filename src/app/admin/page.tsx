'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { motion } from 'framer-motion';

import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  LineElement,
  PointElement,
  RadialLinearScale,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Doughnut, Bar, Line, Radar } from 'react-chartjs-2';

import {
  LogOut, Droplet, LayoutGrid, Database, BarChart3, Settings,
  PlusCircle, MinusCircle, Loader2, RotateCcw, AlertTriangle
} from 'lucide-react';

import StockAndRequests from '@/components/stocks';

ChartJS.register(
  ArcElement,
  BarElement,
  LineElement,
  PointElement,
  RadialLinearScale,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Filler
);

type BloodRow = {
  id: string;
  blood_group: string;
  units_available: number;
  updated_at: string | null;
};

const groupsOrder = ['O+','O-','A+','A-','B+','B-','AB+','AB-'] as const;

export default function AdminPage() {
  const router = useRouter();

  const [view, setView] = useState<'dashboard'|'inventory'|'charts'|'settings'>('dashboard');
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // inventory state
  const [rows, setRows] = useState<BloodRow[]>([]);
  const [saving, setSaving] = useState(false);
  const [delta, setDelta] = useState<number>(1);
  const [bg, setBg] = useState<string>('O+');
  const [msg, setMsg] = useState<{ type: 'ok'|'warn'|'err'; text: string } | null>(null);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }

      const { data: prof, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error || !prof || prof.role !== 'admin') {
        router.push('/'); 
        return;
      }
      setIsAdmin(true);
      setLoading(false);
    })();
  }, [router]);

  useEffect(() => {
    if (!isAdmin) return;

    const load = async () => {
      const { data } = await supabase
        .from('blood_inventory')
        .select('id,blood_group,units_available,updated_at');

      const sorted = (data ?? []).sort(
        (a,b) => groupsOrder.indexOf(a.blood_group as typeof groupsOrder[number]) - groupsOrder.indexOf(b.blood_group as typeof groupsOrder[number])
      );

      const map = new Map(sorted.map(r => [r.blood_group, r]));
      const full: BloodRow[] = groupsOrder.map(g =>
        map.get(g) ?? { id: `virtual-${g}`, blood_group: g, units_available: 0, updated_at: null }
      ) as BloodRow[];

      setRows(full);
    };
    load();

    const channel = supabase
      .channel('inventory-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'blood_inventory' },
        load
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [isAdmin]);

  const logout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const clampInt = (n: number, min = 1) => (Number.isFinite(n) ? Math.max(min, Math.trunc(n)) : min);
  const setInfo = (text: string) => setMsg({ type: 'ok', text });
  const setWarn = (text: string) => setMsg({ type: 'warn', text });
  const setErr  = (text: string) => setMsg({ type: 'err',  text });

  const applyDelta = async (g: string, signedDelta: number) => {
    const abs = Math.abs(clampInt(signedDelta, 1));
    const current = rows.find(r => r.blood_group === g);
    if (!current) { setErr('Unknown blood group'); return; }

    const next =
      signedDelta > 0 ? current.units_available + abs : Math.max(0, current.units_available - abs);

    if (next === current.units_available) { setWarn('No change to apply.'); return; }

    const now = new Date().toISOString();
    setSaving(true);

    setRows(prev => prev.map(r => r.blood_group === g ? { ...r, units_available: next, updated_at: now } : r));

    try {
      const { error: rpcErr } = await supabase.rpc('increment_inventory', {
        p_group: g,
        p_delta: signedDelta > 0 ? abs : -abs,
      });

      if (rpcErr) {
        const { error: upsertErr } = await supabase
          .from('blood_inventory')
          .upsert({ blood_group: g, units_available: next, updated_at: now }, { onConflict: 'blood_group' });

        if (upsertErr) throw upsertErr;
      }

      setInfo(`${signedDelta > 0 ? 'Added' : 'Subtracted'} ${abs} unit${abs > 1 ? 's' : ''} for ${g}.`);
    } catch {
      setRows(prev => prev.map(r => r.blood_group === g ? { ...r, units_available: current.units_available } : r));
      setErr('Could not save change. Try again.');
    } finally {
      setSaving(false);
    }
  };

  const chartData = useMemo(() => {
    const colors = ['#f87171','#fbbf24','#34d399','#60a5fa','#a78bfa','#f472b6','#fb923c','#2dd4bf'];
    const labels = [...groupsOrder];
    const map = new Map(rows.map(r => [r.blood_group, r.units_available]));
    const values = labels.map(l => map.get(l) ?? 0);
    return {
      labels,
      datasets: [{ data: values, backgroundColor: colors, borderColor: colors }]
    };
  }, [rows]);

  const trendData = useMemo(() => {
    const labels = groupsOrder as unknown as string[];
    const map = new Map(rows.map(r => [r.blood_group, r.units_available]));
    const base = labels.map(l => map.get(l) ?? 0);
    const points = Array.from({ length: 6 }).map((_, i) =>
      base.map(v => Math.max(0, Math.round(v * (0.8 + i * 0.06))))
    );
    return { labels: ['T-5','T-4','T-3','T-2','T-1','Now'], points, groups: labels, base };
  }, [rows]);

  const totalUnits = useMemo(() => rows.reduce((s, r) => s + (r.units_available ?? 0), 0), [rows]);
  const groupBadge = (g: string) =>
    `inline-flex items-center rounded-lg px-2 py-1 text-sm font-semibold ring-1 ${
      g.endsWith('+') ? 'bg-rose-50 text-rose-700 ring-rose-200' : 'bg-sky-50 text-sky-700 ring-sky-200'
    }`;

  if (loading) {
    return <div className="grid h-[60vh] place-items-center text-gray-500">Loading…</div>;
  }

  return (
    <div className="min-h-screen mt-20 bg-gradient-to-b from-rose-50 to-white">
      <aside className="fixed mt-16 left-0 top-0 z-40 h-screen w-64 border-r bg-white/80 backdrop-blur-md shadow-lg">
        <div className="flex h-16 mt-15 items-center gap-2 px-5">
          <Droplet className="h-6 w-6 text-rose-600" />
          <span className="text-lg font-semibold">Blood<span className="text-rose-600">Mate</span> Admin</span>
        </div>
        <nav className="mt-3 px-2">
          {[
            { k:'dashboard', label:'Dashboard', Icon: LayoutGrid },
            { k:'inventory', label:'Inventory', Icon: Database },
            { k:'charts', label:'Charts', Icon: BarChart3 },
            { k:'settings', label:'Settings', Icon: Settings },
          ].map(({k,label,Icon}) => (
            <button
              key={k}
              onClick={() => setView(k as 'dashboard' | 'inventory' | 'charts' | 'settings')}
              className={`mb-1 flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition
              ${view===k ? 'bg-rose-100 text-rose-700 ring-1 ring-rose-200' : 'hover:bg-gray-50'}`}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{label}</span>
            </button>
          ))}
        </nav>
        <div className="absolute left-0 w-full px-4">
          <button
            onClick={logout}
            className="flex w-full items-center justify-center gap-2 rounded-xl border px-3 py-2 font-medium transition hover:bg-rose-600 hover:text-white hover:border-rose-600"
          >
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </aside>

      <div className="ml-64 py-5 mt-9">
        <div className="sticky mt-5 top-0 z-30 flex my-10 h-16 items-center justify-between border-b bg-white/80 px-6 backdrop-blur-md shadow-sm">
          <div className="flex items-center gap-3">
            <span className="text-xl font-semibold text-gray-800">Admin Dashboard</span>
            <span className="rounded-full bg-rose-100 px-2 py-0.5 text-xs font-medium text-rose-700">Live</span>
          </div>
        </div>

        <div className="mx-auto max-w-6xl py-6 space-y-8">
          {view === 'dashboard' && (
            <div className="mb-50">
              <StockAndRequests />

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 gap-6 md:grid-cols-3"
              >
                {rows.map(r => (
                  <div key={r.blood_group} className="rounded-2xl border bg-white p-6 shadow hover:shadow-md transition">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-gray-500">Blood Group</div>
                        <div className="text-2xl font-semibold text-rose-600">{r.blood_group}</div>
                      </div>
                      <Droplet className="h-7 w-7 text-rose-600" />
                    </div>
                    <div className="mt-4 text-4xl font-bold">{r.units_available}</div>
                    <div className="mt-1 text-xs text-gray-500">
                      {r.updated_at ? `Updated ${new Date(r.updated_at).toLocaleString()}` : '—'}
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>
          )}

          {view === 'inventory' && (
            <div className="space-y-6">
          
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-rose-50 via-white to-sky-50 p-6"
              >
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
                  <div className="flex flex-1 flex-col gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Blood Group</label>
                      <select
                        className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-gray-900 shadow-sm outline-none ring-offset-2 focus:ring-2 focus:ring-rose-400 md:w-60"
                        value={bg}
                        onChange={(e) => setBg(e.target.value)}
                        aria-label="Select blood group"
                      >
                        {groupsOrder.map((g) => (
                          <option key={g} value={g}>{g}</option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:items-end">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Units (±)</label>
                        <div className="mt-1 flex rounded-xl border border-gray-200 bg-white shadow-sm">
                          <input
                            type="number"
                            inputMode="numeric"
                            min={1}
                            className="w-full rounded-xl px-3 py-2 outline-none"
                            value={delta}
                            onChange={(e) => setDelta(clampInt(parseInt(e.target.value || '0', 10), 1))}
                            aria-label="Units"
                          />
                          <button
                            type="button"
                            onClick={() => setDelta((d) => clampInt(d - 1, 1))}
                            className="rounded-l-none border-l px-3 py-2 text-gray-600 hover:bg-gray-50"
                            aria-label="Decrease units"
                          >
                            −
                          </button>
                          <button
                            type="button"
                            onClick={() => setDelta((d) => clampInt(d + 1, 1))}
                            className="rounded-r-xl border-l px-3 py-2 text-gray-600 hover:bg-gray-50"
                            aria-label="Increase units"
                          >
                            +
                          </button>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {[1, 2, 5, 10].map((n) => (
                            <button
                              key={n}
                              type="button"
                              onClick={() => setDelta(clampInt(n, 1))}
                              className="rounded-full border border-gray-200 bg-white px-3 py-1 text-sm text-gray-700 hover:border-rose-300 hover:text-rose-600"
                            >
                              {n}
                            </button>
                          ))}
                          <button
                            type="button"
                            onClick={() => setDelta(1)}
                            className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white px-3 py-1 text-sm text-gray-700 hover:border-sky-300 hover:text-sky-700"
                          >
                            <RotateCcw className="h-3.5 w-3.5" />
                            Reset
                          </button>
                        </div>
                      </div>

                      <div className="flex gap-2 md:justify-end">
                        <button
                          disabled={saving}
                          onClick={() => applyDelta(bg, Math.abs(delta))}
                          className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 font-semibold text-emerald-800 ring-1 ring-emerald-100 transition hover:bg-emerald-600 hover:text-white disabled:opacity-60"
                        >
                          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <PlusCircle className="h-4 w-4" />}
                          Add
                        </button>
                        <button
                          disabled={saving}
                          onClick={() => applyDelta(bg, -Math.abs(delta))}
                          className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 font-semibold text-rose-800 ring-1 ring-rose-100 transition hover:bg-rose-600 hover:text-white disabled:opacity-60"
                        >
                          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <MinusCircle className="h-4 w-4" />}
                          Subtract
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                    <div className="text-xs uppercase tracking-wide text-gray-500">Total Units</div>
                    <div className="mt-1 text-3xl font-extrabold text-gray-900">{totalUnits}</div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {groupsOrder.map((g) => {
                        const r = rows.find((x) => x.blood_group === g);
                        return (
                          <span key={g} className={groupBadge(g)} title={`${g}: ${r?.units_available ?? 0} units`}>
                            {g} · {r?.units_available ?? 0}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {msg && (
                  <div
                    className={`mt-4 inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm ${
                      msg.type === 'ok'
                        ? 'bg-emerald-50 text-emerald-800 ring-1 ring-emerald-100'
                        : msg.type === 'warn'
                        ? 'bg-amber-50 text-amber-800 ring-1 ring-amber-100'
                        : 'bg-rose-50 text-rose-800 ring-1 ring-rose-100'
                    }`}
                  >
                    {msg.type !== 'ok' && <AlertTriangle className="h-4 w-4" />}
                    {msg.text}
                  </div>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="overflow-hidden rounded-2xl border bg-white shadow-sm"
              >
                <div className="max-h-[520px] overflow-auto">
                  <table className="min-w-full text-left">
                    <thead className="sticky top-0 bg-gray-50">
                      <tr className="text-xs uppercase tracking-wide text-gray-500">
                        <th className="px-5 py-3">Blood Group</th>
                        <th className="px-5 py-3">Units</th>
                        <th className="px-5 py-3">Updated</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-900">
                      {rows.map((r, idx) => (
                        <tr
                          key={r.blood_group}
                          className={`border-t ${idx % 2 ? 'bg-white' : 'bg-gray-50/40'} hover:bg-rose-50/50 transition`}
                        >
                          <td className="px-5 py-3"><span className={groupBadge(r.blood_group)}>{r.blood_group}</span></td>
                          <td className="px-5 py-3 font-semibold">{r.units_available}</td>
                          <td className="px-5 py-3 text-sm text-gray-500">
                            {r.updated_at ? new Date(r.updated_at).toLocaleString() : '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            </div>
          )}

          {view === 'charts' && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="rounded-2xl border bg-white p-6 shadow-sm">
                <div className="mb-3 text-sm font-medium text-gray-600">Availability by Group</div>
                <Bar
                  data={{ ...chartData, datasets: [{ ...chartData.datasets[0], label: 'Units' }] }}
                  options={{ plugins: { legend: { display: false } } }}
                />
              </div>
              <div className="rounded-2xl border bg-white p-6 shadow-sm">
                <div className="mb-3 text-sm font-medium text-gray-600">Share</div>
                <Doughnut
                  data={{ ...chartData, datasets: [{ ...chartData.datasets[0], label: 'Share' }] }}
                />
              </div>
              <div className="rounded-2xl border bg-white p-6 shadow-sm md:col-span-2">
                <div className="mb-3 text-sm font-medium text-gray-600">Inventory Trends</div>
                <Line
                  data={{
                    labels: trendData.labels,
                    datasets: [
                      {
                        label: 'Total Units (approx)',
                        data: trendData.points.map(p => p.reduce((a,b)=>a+b,0)),
                        fill: true,
                        borderColor: '#f43f5e',
                        backgroundColor: 'rgba(244,63,94,0.15)',
                        tension: 0.3,
                      }
                    ]
                  }}
                />
              </div>
              <div className="rounded-2xl border bg-white p-6 shadow-sm md:col-span-2">
                <div className="mb-3 text-sm font-medium text-gray-600">Distribution Comparison</div>
                <Radar
                  data={{
                    labels: chartData.labels,
                    datasets: [
                      {
                        label: 'Now',
                        data: (chartData.datasets[0].data as number[]),
                        backgroundColor: 'rgba(96,165,250,0.25)',
                        borderColor: '#60a5fa',
                        pointBackgroundColor: '#60a5fa',
                      },
                      {
                        label: 'Earlier (approx)',
                        data: (chartData.datasets[0].data as number[]).map(v => Math.max(0, Math.round(v*0.85))),
                        backgroundColor: 'rgba(244,114,182,0.2)',
                        borderColor: '#f472b6',
                        pointBackgroundColor: '#f472b6',
                      }
                    ]
                  }}
                />
              </div>
            </div>
          )}

          {view === 'settings' && (
            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <div className="text-sm text-gray-600">Nothing here yet.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
