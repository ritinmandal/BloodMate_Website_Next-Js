// app/(dashboard)/user-dashboard/page.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import {
  Card, CardHeader, CardTitle, CardContent, CardDescription,
  Badge, Button, Table, TableHeader, TableRow, TableHead, TableBody, TableCell,
  Progress
} from '@/components/ui';
import {
  Droplet, HeartHandshake, CalendarDays, MapPin, Phone, Mail, User2, Globe2,
  CheckCircle2, ShieldCheck, AlertCircle, Clock
} from 'lucide-react';

type InventoryRow = { blood_group: string; units_available: number };

type DonorRow = {
  user_id: string;
  full_name: string;
  gender: 'male' | 'female' | 'other';
  dob: string;
  phone: string;
  blood_group: 'O+'|'O-'|'A+'|'A-'|'B+'|'B-'|'AB+'|'AB-';
  city: string;
  state: string;
  created_at: string;
  latitude: number | null;
  longitude: number | null;
  id: string;
};

type Appointment = {
  id: string;
  slot_time: string;
  center?: string | null;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'failed';
};

type Donation = {
  id: string;
  donated_at: string;
  units_total?: number | null;
  component_yield?: any | null;
};

const DAY = 24 * 60 * 60 * 1000;
const ELIGIBILITY_GAP_DAYS = 90;

export default function UserDashboard() {
  const router = useRouter();

  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [donor, setDonor] = useState<DonorRow | null>(null);

  const [inv, setInv] = useState<InventoryRow[]>([]);
  const [futureAppts, setFutureAppts] = useState<Appointment[]>([]);
  const [pastDonations, setPastDonations] = useState<Donation[]>([]);
  const [lastDonation, setLastDonation] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.replace('/login'); return; }
      setUserEmail(session.user.email ?? null);

      const { data: p } = await supabase
        .from('profiles')
        .select('role')
        .eq('user_id', session.user.id)
        .maybeSingle();
      if (p?.role === 'admin') { router.replace('/admin'); return; }

      const { data: donorRow, error: donorErr } = await supabase
        .from('donors')
        .select('user_id, full_name, gender, dob, phone, blood_group, city, state, created_at, latitude, longitude, id')
        .eq('user_id', session.user.id)
        .maybeSingle();
      if (donorErr) throw donorErr;
      setDonor(donorRow ?? null);

      const { data: invRows, error: invErr } = await supabase
        .from('blood_inventory')
        .select('blood_group, units_available')
        .order('blood_group', { ascending: true });
      if (invErr) throw invErr;
      setInv(invRows ?? []);

      const nowIso = new Date().toISOString();
      const { data: appts, error: apptErr } = await supabase
        .from('appointments')
        .select('id, slot_time, center, status')
        .eq('user_id', session.user.id)
        .gte('slot_time', nowIso)
        .in('status', ['scheduled','in_progress'])
        .order('slot_time', { ascending: true })
        .limit(3);
      if (apptErr) throw apptErr;
      setFutureAppts(appts ?? []);

      const { data: dons, error: donErr } = await supabase
        .from('donations')
        .select('id, donated_at, units_total, component_yield')
        .eq('user_id', session.user.id)
        .order('donated_at', { ascending: false })
        .limit(5);
      if (donErr) throw donErr;
      setPastDonations(dons ?? []);
      setLastDonation(dons && dons.length > 0 ? dons[0].donated_at : null);
    })()
      .catch((e) => setErr(e?.message ?? 'Failed to load'))
      .finally(() => setLoading(false));
  }, [router]);

  const name = donor?.full_name ?? 'Donor';


  const fallbackLast = new Date(Date.now() - 65 * DAY).toISOString();
  const effectiveLastDonation = lastDonation ?? fallbackLast;

  const dummy = {
    weightKg: 72,
    hb: 14.1,            
    age: 21,
    sleptHrs: 7.5,
    pulse: 76,
  };

  const lastDate = effectiveLastDonation ? new Date(effectiveLastDonation) : null;
  const daysSince = lastDate ? Math.floor((Date.now() - lastDate.getTime()) / DAY) : null;
  const eligible = daysSince !== null && daysSince >= ELIGIBILITY_GAP_DAYS;
  const nextEligible = lastDate ? new Date(lastDate.getTime() + ELIGIBILITY_GAP_DAYS * DAY) : null;

  const pctToEligibility = daysSince === null
    ? 0
    : Math.min(100, Math.round((daysSince / ELIGIBILITY_GAP_DAYS) * 100));

  const totalUnits = useMemo(
    () => inv.reduce((s, r) => s + (r.units_available || 0), 0),
    [inv]
  );

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.replace('/login');
  }

  function prettyDate(s?: string | null) {
    if (!s) return '—';
    const d = new Date(s);
    return isNaN(+d) ? '—' : d.toLocaleString();
  }

  function bookAppointmentNow() {
    const base = new Date();
    base.setDate(base.getDate() + 2);
    base.setHours(10, 30, 0, 0);
    const whenISO = base.toISOString();

    const qs = new URLSearchParams({
      kind: 'appointment',
      status: 'booked',
      when: whenISO,
      center: 'City Central Blood Bank',
    }).toString();
    router.push(`/requestinguser?${qs}`);
  }

  if (loading) {
    return (
      <div className="grid h-[70vh] place-items-center text-gray-500">
        Loading your dashboard…
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] mt-35 bg-gradient-to-b from-rose-50 via-white to-white">
      <header className="sticky top-0 z-20 border-b bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/50">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 grid place-items-center rounded-xl bg-rose-100 text-rose-700">
              <Droplet className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-base font-semibold leading-tight">Welcome, {name}</h1>
              <p className="text-xs text-muted-foreground">Your personal BloodMate dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">Donor</Badge>
            <Button variant="outline" onClick={handleSignOut}>Sign out</Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-none shadow-sm ring-1 ring-black/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <User2 className="h-4 w-4 text-rose-600" /> Your Profile
              </CardTitle>
              <CardDescription>From your donor record</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="bg-rose-600">Blood Group: {donor?.blood_group ?? '—'}</Badge>
                <Badge variant="outline">{donor?.gender ?? '—'}</Badge>
                <Badge variant="outline">DOB: {donor?.dob ?? '—'}</Badge>
              </div>

              <div className="flex items-center gap-2 text-gray-700">
                <MapPin className="h-4 w-4 text-rose-600" />
                <span>{donor?.city ?? '—'}, {donor?.state ?? ''}</span>
              </div>

              <div className="flex items-center gap-2 text-gray-700">
                <Phone className="h-4 w-4 text-rose-600" />
                <span>{donor?.phone ?? '—'}</span>
              </div>

              <div className="flex items-center gap-2 text-gray-700">
                <Mail className="h-4 w-4 text-rose-600" />
                <span>{userEmail ?? '—'}</span>
              </div>

              <div className="flex items-center gap-2 text-gray-700">
                <Globe2 className="h-4 w-4 text-rose-600" />
                <span>
                  {donor?.latitude != null && donor?.longitude != null
                    ? `${donor.latitude.toFixed(5)}, ${donor.longitude.toFixed(5)}`
                    : 'Coordinates not set'}
                </span>
              </div>

              <div className="pt-2">
                <Button variant="outline" onClick={() => router.push('/profile')}>
                  Edit Profile
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm ring-1 ring-black/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <HeartHandshake className="h-4 w-4 text-rose-600" />
                Donation Eligibility
              </CardTitle>
              <CardDescription>Policy: {ELIGIBILITY_GAP_DAYS} days between donations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="rounded-xl border bg-white px-3 py-2">
                  <div className="text-xs text-muted-foreground">Last donation</div>
                  <div className="font-medium">{lastDate ? lastDate.toDateString() : '—'}</div>
                </div>
                <div className="rounded-xl border bg-white px-3 py-2">
                  <div className="text-xs text-muted-foreground">Days since</div>
                  <div className="font-medium">{daysSince ?? '—'}</div>
                </div>
                <div className="rounded-xl border bg-white px-3 py-2">
                  <div className="text-xs text-muted-foreground">Next eligible</div>
                  <div className="font-medium">{nextEligible ? nextEligible.toDateString() : '—'}</div>
                </div>
                <div className="rounded-xl border bg-white px-3 py-2">
                  <div className="text-xs text-muted-foreground">Status</div>
                  <div className="font-medium">
                    {eligible ? <span className="text-emerald-700">Eligible now</span> : <span className="text-amber-700">Pending cooldown</span>}
                  </div>
                </div>
              </div>

              <div className="mt-1">
                <div className="flex items-center justify-between text-xs mb-1 text-muted-foreground">
                  <span>Cooldown progress</span>
                  <span>{pctToEligibility}%</span>
                </div>
                <Progress value={pctToEligibility} className="h-2" />
              </div>

              
                <div className="flex items-center gap-2 rounded-lg border bg-white px-2.5 py-2 col-span-2">
                  <Clock className="h-4 w-4 text-rose-600" />
                  Slept well last night — <strong>{dummy.sleptHrs} hrs</strong>
                </div>
              

              <div className="pt-2">
                <Button onClick={bookAppointmentNow} className="w-full">
                  <CalendarDays className="mr-2 h-4 w-4" />
                  Book Appointment
                </Button>
                {!eligible && (
                  <p className="mt-2 text-xs text-amber-700 flex items-center gap-1">
                    <AlertCircle className="h-3.5 w-3.5" />
                    You can still book now; we’ll schedule you on or after the eligible date.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm ring-1 ring-black/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Droplet className="h-4 w-4 text-rose-600" />
                Nearby Stock Snapshot
              </CardTitle>
              <CardDescription>Total units across groups</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Units Available</p>
                  <p className="mt-1 text-3xl font-semibold">{totalUnits}</p>
                </div>
                <div className="h-12 w-12 rounded-2xl grid place-items-center bg-gradient-to-br from-rose-500 to-red-600 text-white">
                  <Droplet className="h-6 w-6" />
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {inv.map((r) => (
                  <span
                    key={r.blood_group}
                    className={`inline-flex items-center rounded-lg px-2 py-1 text-xs font-semibold ring-1 ${
                      r.blood_group.endsWith('+')
                        ? 'bg-rose-50 text-rose-700 ring-rose-200'
                        : 'bg-sky-50 text-sky-700 ring-sky-200'
                    }`}
                    title={`${r.blood_group}: ${r.units_available} units`}
                  >
                    {r.blood_group} · {r.units_available}
                  </span>
                ))}
              </div>
              <div className="pt-3">
                <Button variant="outline" onClick={() => router.push('/inventory')}>
                  View Full Inventory
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-none shadow-sm ring-1 ring-black/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-rose-600" />
              Upcoming Appointments
            </CardTitle>
            <CardDescription>Your next visits (max 3 shown)</CardDescription>
          </CardHeader>
          <CardContent>
            {futureAppts.length === 0 ? (
              <p className="text-sm text-muted-foreground">No upcoming appointments. Book one now!</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Center</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {futureAppts.map(a => (
                    <TableRow key={a.id}>
                      <TableCell className="font-medium">{prettyDate(a.slot_time)}</TableCell>
                      <TableCell>{a.center ?? '—'}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{a.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" onClick={() => router.push(`/appointments/${a.id}`)}>
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm ring-1 ring-black/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Donation History</CardTitle>
            <CardDescription>Your latest contributions</CardDescription>
          </CardHeader>
          <CardContent>
            {pastDonations.length === 0 ? (
              <p className="text-sm text-muted-foreground">No previous donations recorded.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Units</TableHead>
                    <TableHead>Components</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pastDonations.map(d => (
                    <TableRow key={d.id}>
                      <TableCell className="font-medium">
                        {new Date(d.donated_at).toDateString()}
                      </TableCell>
                      <TableCell>{d.units_total ?? '—'}</TableCell>
                      <TableCell className="max-w-[360px]">
                        <code className="rounded bg-gray-50 px-2 py-0.5 text-xs">
                          {d.component_yield ? JSON.stringify(d.component_yield) : '—'}
                        </code>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {err && <p className="text-sm text-red-600">{err}</p>}
      </main>
    </div>
  );
}
