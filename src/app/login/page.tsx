'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { Card, CardHeader, CardTitle, CardContent, Input } from '@/components/ui';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('user_id', session.user.id)
        .single();

      if (profile?.role === 'admin') router.replace('/admin');
      else router.replace('/user');
    })();
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user after auth');

      const { data: profile, error: pErr } = await supabase
        .from('profiles')
        .select('role')
        .eq('user_id', user.id)
        .single();
      if (pErr) throw pErr;

      if (profile?.role === 'admin') router.replace('/admin');
      else router.replace('/user');
    } catch (e: unknown) {
      if (e instanceof Error) {
        setErr(e.message ?? 'Authentication failed');
      } else {
        setErr('Authentication failed');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative  isolate min-h-[100dvh] w-full overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/banner1.png" 
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>

  
      <div className="absolute inset-0 z-10 bg-black/40" />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.35 }}
        transition={{ duration: 2 }}
        className="absolute top-24 left-10 z-20 h-72 w-72 rounded-full bg-rose-400 blur-3xl"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.35 }}
        transition={{ duration: 2, delay: 0.8 }}
        className="absolute bottom-10 right-10 z-20 h-96 w-96 rounded-full bg-red-500 blur-3xl"
      />

      <div className="relative z-30 grid min-h-[100dvh] place-items-center px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mx-auto w-full max-w-md"
        >
          <div className="rounded-[28px] p-[1px]  mt-40 bg-gradient-to-br from-white/20 via-rose-300/60 to-red-400/60 shadow-[0_10px_40px_-10px_rgba(244,63,94,0.45)]">
            <Card className="rounded-[26px] border border-white/10 bg-white/20  overflow-hidden">
              <div className="relative h-20  border-white/20">
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2">
                  <div className="grid size-16 place-items-center rounded-2xl bg-white shadow">
                    <Image width={68} height={48} className='w-102' src="/images/logo2.png" alt="" />
                  </div>
                </div>
              </div>

              <CardHeader className="pt-12">
                <CardTitle className="text-center text-2xl text-white drop-shadow">
                  Welcome back
                </CardTitle>
                <p className="mt-1 text-center text-sm text-gray-200">
                  Sign in to manage blood bank services
                </p>
              </CardHeader>

              <CardContent className="space-y-5">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-100">
                      Email
                    </label>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="rounded-xl border border-rose-300 bg-white/85 text-gray-900 placeholder-slate-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-200"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-100">
                      Password
                    </label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="rounded-xl border border-rose-300 bg-white/85 text-gray-900 placeholder-slate-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-200"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-200/90">
                      Forgot password?
                    </span>
                  </div>

                  <motion.button
                    type="submit"
                    whileTap={{ scale: 0.98 }}
                    whileHover={{ y: -1 }}
                    disabled={loading}
                    className="group relative w-full overflow-hidden rounded-2xl bg-gradient-to-br from-rose-600 to-red-500 px-6 py-3 text-center text-white shadow-lg focus:outline-none disabled:opacity-90"
                  >
                    <span className="relative z-10 font-semibold">
                      {loading ? 'Please wait…' : 'Sign in'}
                    </span>
                    <motion.span
                      aria-hidden
                      initial={{ x: '-100%' }}
                      animate={{ x: loading ? '-100%' : ['-100%', '100%'] }}
                      transition={{ duration: 2, repeat: loading ? 0 : Infinity }}
                      className="absolute inset-y-0 -skew-x-12 w-1/3 bg-white/25"
                    />
                  </motion.button>

                  <AnimatePresence>
                    {err && (
                      <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        className="text-sm text-rose-200"
                      >
                        {err}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </form>

                <p className="text-center text-[11px] text-gray-200/90">
                  Admins are redirected to Admin Dashboard • Others to User Dashboard
                </p>
              </CardContent>
            </Card>
          </div>

          <p className="mt-4 text-center text-xs text-gray-200">
            Trouble logging in? Ensure RLS allows <span className="font-medium">select</span> on <code>profiles</code>.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
