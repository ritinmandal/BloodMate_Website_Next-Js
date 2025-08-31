// app/requesting/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';
import Image from 'next/image';
type Status = 'sending' | 'sent' | 'error';

export default function Requesting() {
  const sp = useSearchParams();

  const [status, setStatus] = useState<Status>('sending');
  const [msg, setMsg] = useState('');
  const [requester, setRequester] = useState<{
    name: string;
    email: string;
    phone: string;
  }>({ name: 'Requester', email: '', phone: '' });

  const name = sp.get('name') || 'Donor';
  const bg = sp.get('bg') || '';
  const city = sp.get('city') || '';
  const state = sp.get('state') || '';
  const uid = sp.get('uid') || '';

  useEffect(() => {
    (async () => {
      try {
        const { data } = await supabase.auth.getUser();
        const u = data.user;
        setRequester({
          name:
            (u?.user_metadata?.full_name as string) ||
            (u?.user_metadata?.name as string) ||
            'Requester',
          email:
            (u?.email as string) ||
            (u?.user_metadata?.email as string) ||
            '',
          phone: (u?.user_metadata?.phone as string) || '',
        });
      } catch {
      
      }
    })();
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      setStatus('sent');
      setMsg('Your blood request has been recorded.');
    }, 900);
    return () => clearTimeout(t);
  }, [uid, name, bg, city, state]);

  const place = [city, state].filter(Boolean).join(', ');
  const bgText = bg ? ` (${bg})` : '';

  return (
    <div className="min-h-[100svh] flex items-center mt-15 justify-center relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-rose-100 via-white to-red-100" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(1200px_600px_at_50%_-10%,rgba(244,63,94,0.08),transparent_70%)]" />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-4 w-full max-w-6xl rounded-3xl border border-rose-200 bg-white/85 backdrop-blur p-8 shadow-[0_20px_60px_-20px_rgba(244,63,94,0.35)]"
      >
        <div className="grid gap-6 md:grid-cols-2">
          <div className="flex flex-col justify-center">
            <AnimatePresence mode="wait">
              {status === 'sending' && (
                <motion.div
                  
                  key="sending"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                >
                  <h1 className="text-3xl font-extrabold text-gray-900">
                    Requesting blood…
                  </h1>
                  <p className="mt-2 text-gray-700">
                    Notifying <span className="font-semibold">{name}</span>
                    {bgText} {place ? `in ${place}` : ''}.
                  </p>
                  <div className="mt-6 h-2 w-40 rounded-full bg-rose-200 overflow-hidden">
                    <motion.div
                      className="h-full w-1/2 bg-red-500"
                      initial={{ x: '-100%' }}
                      animate={{ x: ['-100%', '50%', '80%', '100%'] }}
                      transition={{
                        duration: 1.3,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                    />
                  </div>
                </motion.div>
              )}

              {status === 'sent' && (
                <motion.div 
              
                  
                  key="sent"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                >
                  <h1 className="text-3xl font-extrabold text-gray-900">
                    Request sent! ❤️
                  </h1>
                  <p className="mt-2 text-gray-700">
                    Your request to{' '}
                    <span className="font-semibold">{name}</span>
                    {bgText} {place ? `(${place})` : ''} has been placed.
                  </p>
                  <p className="mt-2 text-sm text-emerald-700">{msg}</p>

                  <div className="w-150 grid  gap-4 md:grid-cols-2">
                    <div className="rounded-xl border border-rose-200 p-4">
                      <h3 className="font-semibold text-gray-900">
                        Donor Details
                      </h3>
                      <dl className="mt-2 text-sm text-gray-700 space-y-1">
                        <div className="flex justify-between">
                          <dt>Name</dt>
                          <dd className="font-medium">{name}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt>Blood Group</dt>
                          <dd className="font-medium">{bg || '-'}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt>Location</dt>
                          <dd className="font-medium">{place || '-'}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt>User ID</dt>
                          <dd className="font-mono text-xs">{uid || '-'}</dd>
                        </div>
                      </dl>
                    </div>

                    <div className="rounded-xl border  border-emerald-200 p-4">
                      <h3 className="font-semibold text-gray-900">
                        Requester Details
                      </h3>
                      <dl className="mt-2 text-sm text-gray-700 space-y-1">
                        <div className="flex justify-between">
                          <dt>Name</dt>
                          <dd className="font-medium">{requester.name}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt>Email</dt>
                          <dd className="font-medium">
                            {requester.email || '-'}
                          </dd>
                        </div>
                        <div className="flex justify-between">
                          <dt>Phone</dt>
                          <dd className="font-medium">
                            {requester.phone || '-'}
                          </dd>
                        </div>
                      </dl>
                    </div>
                  </div>

                  <div className="mt-6 flex gap-3">
                    <Link
                      href="/"
                      className="rounded-xl bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                    >
                      Home
                    </Link>
                    <Link
                      href="/map"
                      className="rounded-xl border border-rose-300 px-4 py-2 text-rose-700 hover:bg-rose-50"
                    >
                      Find more donors
                    </Link>
                  </div>
                </motion.div>
              )}

              {status === 'error' && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                >
                  <h1 className="text-3xl font-extrabold text-gray-900">
                    Oops!
                  </h1>
                  <p className="mt-2 text-rose-700">{msg}</p>
                  <div className="mt-6">
                    <Link
                      href="/donors"
                      className="rounded-xl border border-rose-300 px-4 py-2 text-rose-700 hover:bg-rose-50"
                    >
                      Try again
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="relative ">
            <Image
              width={1000}
              height={1000}
              src="/images/scooter_bob.gif"
              alt="Blood request animation"
              className="w-80 h-80 mx-40  object-cover"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
