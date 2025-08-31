'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, Button, Badge } from '@/components/ui';
import { CheckCircle2, CalendarDays, Phone, Mail, MapPin, Droplet, ArrowLeft, Clock } from 'lucide-react';

function fmtDate(iso?: string | null) {
  if (!iso) return '—';
  const d = new Date(iso);
  if (isNaN(+d)) return '—';
  return d.toLocaleString();
}

export default function RequestingPage() {
  const sp = useSearchParams();
  const router = useRouter();

  const info = useMemo(() => {
    const kind = sp.get('kind') ?? 'appointment';
    const status = sp.get('status') ?? 'booked';
    const when = sp.get('when');
    const center = sp.get('center') ?? 'City Central Blood Bank';
    return { kind, status, when, center };
  }, [sp]);

  return (
    <div className="min-h-[100dvh] bg-gradient-to-b from-emerald-50 via-white to-white py-10 px-4">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 flex items-center justify-between">
          <Button variant="outline" onClick={() => router.back()} className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
          <Badge className="bg-emerald-600">Success</Badge>
        </div>

        <Card className="border-none shadow-lg ring-1 ring-black/5 overflow-hidden">
          <div className="relative">
            <div className="h-28 bg-gradient-to-r from-emerald-500 to-teal-600" />
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2">
              <div className="h-16 w-16 rounded-2xl grid place-items-center bg-white shadow-lg">
                <CheckCircle2 className="h-10 w-10 text-emerald-600" />
              </div>
            </div>
          </div>

          <CardHeader className="mt-10 text-center">
            <CardTitle className="text-xl">Appointment booked successfully</CardTitle>
            <CardDescription>
              We’ve received your request. Our team will contact you soon to confirm details.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-3 gap-3">
              <div className="rounded-xl border bg-white p-4">
                <div className="text-xs text-muted-foreground mb-1">Status</div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span className="font-medium capitalize">{info.status}</span>
                </div>
              </div>

              <div className="rounded-xl border bg-white p-4">
                <div className="text-xs text-muted-foreground mb-1">Date & time</div>
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-emerald-600" />
                  <span className="font-medium">{fmtDate(info.when)}</span>
                </div>
              </div>

              <div className="rounded-xl border bg-white p-4">
                <div className="text-xs text-muted-foreground mb-1">Center</div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-emerald-600" />
                  <span className="font-medium">{info.center}</span>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-3">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(info.center)}`}
                target="_blank"
                rel="noreferrer"
                className="rounded-xl border bg-white p-4 hover:bg-slate-50 transition"
              >
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-slate-700" />
                  <div>
                    <div className="text-sm font-medium">Open in Maps</div>
                    <div className="text-xs text-muted-foreground">Get directions to the center</div>
                  </div>
                </div>
              </a>

              <a href="tel:+911234567890" className="rounded-xl border bg-white p-4 hover:bg-slate-50 transition">
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-slate-700" />
                  <div>
                    <div className="text-sm font-medium">Call Support</div>
                    <div className="text-xs text-muted-foreground">+91 12345 67890</div>
                  </div>
                </div>
              </a>

              <a href="mailto:support@bloodmate.app" className="rounded-xl border bg-white p-4 hover:bg-slate-50 transition">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-slate-700" />
                  <div>
                    <div className="text-sm font-medium">Email Us</div>
                    <div className="text-xs text-muted-foreground">support@bloodmate.app</div>
                  </div>
                </div>
              </a>
            </div>

            <div className="rounded-xl border bg-white p-4">
              <div className="flex items-center gap-2 mb-2">
                <Droplet className="h-4 w-4 text-rose-600" />
                <div className="text-sm font-semibold">Before you come</div>
              </div>
              <ul className="text-sm list-disc pl-5 space-y-1 text-muted-foreground">
                <li>Have a light meal and drink plenty of water.</li>
                <li>Carry a valid photo ID (license, Aadhaar, etc.).</li>
                <li>Avoid strenuous exercise 24 hours before donation.</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-end">
              <Button variant="outline" onClick={() => router.push('/')} className="gap-2">
                <Clock className="h-4 w-4" /> Schedule another time
              </Button>
              <Button onClick={() => router.push('/user')} className="gap-2">
                Go to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
