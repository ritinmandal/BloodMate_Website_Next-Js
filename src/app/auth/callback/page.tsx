"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { CheckCircle2, AlertTriangle, Loader2, ArrowRight, Home, LogIn } from "lucide-react";
import Link from "next/link";   

type Role = "donor" | "hospital" | "";

type DonorMeta = {
  full_name?: string;
  gender?: "male" | "female" | "other" | "";
  dob?: string;
  phone?: string;
  blood_group?: string;
  city?: string;
  state?: string;
};

type HospitalMeta = {
  hospital_name?: string;
  contact_person?: string;
  license_no?: string;
  phone?: string;
  city?: string;
  state?: string;
};

async function upsertProfile(userId: string, role: Exclude<Role, "">) {
  return supabase.from("profiles").upsert({ user_id: userId, role }, { onConflict: "user_id" });
}
async function insertDonor(userId: string, m: DonorMeta) {
  return supabase.from("donors").upsert(
    {
      user_id: userId,
      full_name: m.full_name ?? "",
      gender: (m.gender || "other") as "male" | "female" | "other",
      dob: m.dob ?? "",
      phone: m.phone ?? "",
      blood_group: (m.blood_group || "") as string,
      city: m.city ?? "",
      state: m.state ?? "",
    },
    { onConflict: "user_id" }
  );
}
async function insertHospital(userId: string, m: HospitalMeta) {
  return supabase.from("hospitals").upsert(
    {
      user_id: userId,
      hospital_name: m.hospital_name ?? "",
      contact_person: m.contact_person ?? "",
      license_no: m.license_no ?? "",
      phone: m.phone ?? "",
      city: m.city ?? "",
      state: m.state ?? "",
    },
    { onConflict: "user_id" }
  );
}

export default function AuthCallback() {
  const [status, setStatus] = useState<"loading" | "success" | "error" | "partial">("loading");
  const [role, setRole] = useState<Role>("");
  const [note, setNote] = useState<string>("Finalizing your account…");

  const theme = useMemo(
    () =>
      role === "hospital"
        ? {
            bgGrad: "from-sky-100 via-white to-indigo-100",
            glow: "bg-[radial-gradient(1200px_600px_at_70%_110%,rgba(2,132,199,0.12),transparent_60%)]",
            pill: "bg-sky-900",
            btn: "bg-gradient-to-br from-sky-600 to-indigo-600",
            textDark: "text-sky-900",
            ring: "ring-sky-200",
          }
        : {
            bgGrad: "from-rose-100 via-white to-red-100",
            glow: "bg-[radial-gradient(1200px_600px_at_30%_-10%,rgba(244,63,94,0.12),transparent_60%)]",
            pill: "bg-rose-900",
            btn: "bg-gradient-to-br from-rose-600 to-red-600",
            textDark: "text-rose-900",
            ring: "ring-rose-200",
          },
    [role]
  );

  useEffect(() => {
    (async () => {
      try {
        
        await supabase.auth.getSession();

        if (typeof window !== "undefined" && window.location.hash) {
          const clean = window.location.pathname + window.location.search;
          window.history.replaceState(null, "", clean);
        }

        const { data: { user }, error: userErr } = await supabase.auth.getUser();
        if (userErr) throw userErr;
        if (!user) {
          setStatus("error");
          setNote("Not signed in. Open the verification link again.");
          return;
        }

        const r = (user.user_metadata?.role ?? "") as Role;
        setRole(r);

        if (!r) {
          setStatus("partial");
          setNote("Your email is verified. Please sign in and complete your profile.");
          return;
        }

        const { data: existing, error: exErr } = await supabase
          .from("profiles")
          .select("user_id")
          .eq("user_id", user.id)
          .maybeSingle();
        if (exErr) throw exErr;

        if (!existing) {
          const pr = await upsertProfile(user.id, r as Exclude<Role, "">);
          if (pr.error) throw pr.error;
        }

        if (r === "donor") {
          const m: DonorMeta = {
            full_name: user.user_metadata?.full_name,
            gender: user.user_metadata?.gender,
            dob: user.user_metadata?.dob,
            phone: user.user_metadata?.phone,
            blood_group: user.user_metadata?.blood_group,
            city: user.user_metadata?.city,
            state: user.user_metadata?.state,
          };
          const dr = await insertDonor(user.id, m);
          if (dr.error) throw dr.error;
        } else if (r === "hospital") {
          const m: HospitalMeta = {
            hospital_name: user.user_metadata?.hospital_name,
            contact_person: user.user_metadata?.contact_person,
            license_no: user.user_metadata?.license_no,
            phone: user.user_metadata?.phone,
            city: user.user_metadata?.city,
            state: user.user_metadata?.state,
          };
          const hr = await insertHospital(user.id, m);
          if (hr.error) throw hr.error;
        }

        setStatus("success");
        setNote("Account verified & saved. You can close this tab or continue.");
      } catch (e: unknown) {
        setStatus("error");
        if (typeof e === "object" && e !== null && "message" in e && typeof (e as { message?: string }).message === "string") {
          setNote((e as { message: string }).message);
        } else {
          setNote("Something went wrong.");
        }
      }
    })();
  }, []);

  return (
    <div className={`relative min-h-[100svh] w-full overflow-hidden mt-30`}>
      <div className={`absolute inset-0 -z-10 bg-gradient-to-br ${theme.bgGrad}`} />
      <div className={`pointer-events-none absolute inset-0 -z-10 ${theme.glow}`} />

      <div className="absolute -top-24 -left-24 h-[70vmax] w-[70vmax] rounded-full"
           style={{ background: role === "hospital"
             ? "radial-gradient(circle at 70% 70%, rgba(2,132,199,0.10), transparent 60%)"
             : "radial-gradient(circle at 30% 30%, rgba(244,63,94,0.10), transparent 60%)",
             filter: "blur(20px)" }} />

      <div className="mx-auto flex max-w-3xl flex-col items-center px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-6">
          <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium text-white ${theme.pill}`}>
            {role === "hospital" ? "Hospital" : role === "donor" ? "Donor" : "Account"}
            <span className="opacity-80">•</span>
            {status === "loading" ? "Verifying" : status === "success" ? "Verified" : status === "partial" ? "Email Verified" : "Issue"}
          </span>
        </div>

        <div
          className={`w-full rounded-3xl bg-white/90 backdrop-blur p-6 sm:p-8 shadow-xl ring-1 ${theme.ring}`}
        >
          <div className="flex items-start gap-4">
            {status === "loading" && (
              <div className="mt-0.5">
                <Loader2 className={`h-6 w-6 animate-spin ${theme.textDark}`} />
              </div>
            )}
            {status === "success" && (
              <div className="mt-0.5">
                <CheckCircle2 className={`h-6 w-6 ${theme.textDark}`} />
              </div>
            )}
            {status !== "loading" && status !== "success" && (
              <div className="mt-0.5">
                <AlertTriangle className="h-6 w-6 text-amber-600" />
              </div>
            )}

            <div className="flex-1">
              <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
                {status === "success"
                  ? "You're all set!"
                  : status === "partial"
                  ? "Email verified"
                  : status === "loading"
                  ? "Finalizing your account"
                  : "We hit a snag"}
              </h1>
              <p className="mt-2 text-sm text-gray-600">{note}</p>

              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-gray-200 bg-white p-4">
                  <p className="text-xs uppercase tracking-wide text-gray-400">Account Type</p>
                  <p className="mt-1 text-sm font-medium text-gray-800">
                    {role || "—"}
                  </p>
                </div>
                <div className="rounded-xl border border-gray-200 bg-white p-4">
                  <p className="text-xs uppercase tracking-wide text-gray-400">Status</p>
                  <p className="mt-1 text-sm font-medium text-gray-800 capitalize">
                    {status}
                  </p>
                </div>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Link
                  href="/"
                  className={`inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-white ${theme.btn} shadow-lg transition active:scale-[0.99]`}
                >
                  <Home className="h-4 w-4" />
                  Go to Home
                </Link>
                {status === "success" ? (
                  <a
                    href="/dashboard"
                    className="inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 bg-gray-900 text-white shadow-lg transition active:scale-[0.99]"
                  >
                    <ArrowRight className="h-4 w-4" />
                    Open Dashboard
                  </a>
                ) : (
                  <a
                    href="/auth/signin"
                    className="inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 bg-gray-900 text-white shadow-lg transition active:scale-[0.99]"
                  >
                    <LogIn className="h-4 w-4" />
                    Sign In
                  </a>
                )}
              </div>

              <p className="mt-4 text-[11px] text-gray-500">
                Tip: If you reached here from the email link and saw a URL ending with <code>#</code>, we cleaned it up automatically.
              </p>
            </div>
          </div>
        </div>

        <p className="mt-6 text-xs text-gray-500">
          BloodMate • Secure email verification & account setup.
        </p>
      </div>
    </div>
  );
}
