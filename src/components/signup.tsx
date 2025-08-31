"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

type Role = "donor" | "hospital" | "";

type DonorForm = {
  fullName: string; email: string; phone: string;
  password: string; confirmPassword: string;
  bloodGroup: string; dob: string;
  gender: "male" | "female" | "other" | "";
  weightKg: string; lastDonation: string;
  addressLine1: string; city: string; state: string; pincode: string;
  emergencyName: string; emergencyPhone: string;
  consent: boolean;
};

type HospitalForm = {
  hospitalName: string; email: string; phone: string;
  password: string; confirmPassword: string;
  licenseNo: string; contactPerson: string;
  addressLine1: string; city: string; state: string; pincode: string;
  bedCount?: string; consent?: boolean;
};

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const INPUT_CLS =
  "w-full rounded-xl border border-rose-300 bg-white/80 backdrop-blur px-3 py-2 text-sm text-gray-900 " +
  "placeholder-slate-400 outline-none shadow-sm transition focus:border-rose-500 focus:ring-2 focus:ring-rose-200";

const container = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { staggerChildren: 0.04 } },
};
const item = { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } };

export default function SignupForm() {
  const [role, setRole] = useState<Role>("");
  const [message, setMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [donor, setDonor] = useState<DonorForm>({
    fullName: "", email: "", phone: "",
    password: "", confirmPassword: "",
    bloodGroup: "", dob: "", gender: "",
    weightKg: "", lastDonation: "",
    addressLine1: "", city: "", state: "", pincode: "",
    emergencyName: "", emergencyPhone: "",
    consent: false,
  });

  const [hospital, setHospital] = useState<HospitalForm>({
    hospitalName: "", email: "", phone: "",
    password: "", confirmPassword: "",
    licenseNo: "", contactPerson: "",
    addressLine1: "", city: "", state: "", pincode: "",
    bedCount: "", consent: false,
  });

  function upDonor<K extends keyof DonorForm>(k: K, v: DonorForm[K]) {
    setDonor((f) => ({ ...f, [k]: v }));
  }
  function upHospital<K extends keyof HospitalForm>(k: K, v: HospitalForm[K]) {
    setHospital((f) => ({ ...f, [k]: v }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    try {
      setSubmitting(true);
      await new Promise((r) => setTimeout(r, 900));
      setMessage("✅ Account created! Please verify your email.");
    } catch (e: any) {
      setMessage(e?.message || "Something went wrong. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const formDisabled =
    submitting ||
    role === "" ||
    (role === "donor" ? !donor.consent : role === "hospital" ? !hospital.consent : true);

  return (
    
    <div className="relative isolate min-h-[100dvh] w-full overflow-hidden">
    
      <div className="absolute inset-0 z-10">
        <Image
          src="/images/banner1.png"  
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>

  
      <div className="absolute inset-0 z-10 bg-black/25" />

   
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ duration: 2 }}
        className="absolute top-20 left-10 z-20 w-72 h-72 rounded-full bg-rose-400 blur-3xl"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ duration: 2, delay: 1 }}
        className="absolute bottom-10 right-10 z-20 w-96 h-96 rounded-full bg-red-500 blur-3xl"
      />

     
      <div className="relative z-30 mx-auto flex max-w-6xl flex-col items-center px-4 py-10 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mb-6 text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl drop-shadow">
            Create Account
          </h1>
          <p className="mt-2 text-sm text-gray-200">
            Choose your account type.
          </p>
        </motion.div>

        <motion.form
          onSubmit={onSubmit}
          variants={container}
          initial="hidden"
          animate="show"
          className="relative w-full max-w-4xl rounded-3xl border border-white/20 bg-white/20 shadow-[0_10px_40px_-10px_rgba(244,63,94,0.4)] backdrop-blur-xl"
        >
          <div className="sticky top-0 z-10 rounded-t-3xl bg-white/40 px-6 py-4 sm:px-8 backdrop-blur-xl border-b border-white/20">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Field label="Account Type" required>
                <select className={INPUT_CLS} value={role} onChange={(e) => setRole(e.target.value as Role)}>
                  <option value="">I want to create…</option>
                  <option value="donor">Donor Account</option>
                  <option value="hospital">Hospital Account</option>
                </select>
              </Field>
            </div>
          </div>

          <div className="max-h-[70vh] overflow-y-auto px-6 py-6 sm:px-8">
            <AnimatePresence mode="wait">
              {role === "" && (
                <motion.div key="empty" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="flex items-center justify-center py-12">
                  <p className="text-sm text-gray-200">Select an account type above to continue.</p>
                </motion.div>
              )}

              {role === "donor" && (
                <motion.div key="donor" initial="hidden" variants={container} animate="show" exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.28 }} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Section title="Donor Details" />
                  <Field label="Full Name" required>
                    <input className={INPUT_CLS} value={donor.fullName} onChange={(e) => upDonor("fullName", e.target.value)} placeholder="Ritin Mandal" />
                  </Field>
                 
                </motion.div>
              )}

              {role === "hospital" && (
                <motion.div key="hospital" variants={container} initial="hidden" animate="show" exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.28 }} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Section title="Hospital Details" />
                  <Field label="Hospital Name" required>
                    <input className={INPUT_CLS} value={hospital.hospitalName} onChange={(e) => upHospital("hospitalName", e.target.value)} placeholder="City Care Hospital" />
                  </Field>
                
                </motion.div>
              )}
            </AnimatePresence>

            {message && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`mt-4 rounded-xl border px-3 py-2 text-sm ${message.startsWith("✅") ? "border-green-200 bg-green-50/60 text-green-900" : "border-rose-200 bg-rose-50/60 text-rose-900"}`}>
                {message}
              </motion.div>
            )}
            <div className="h-3" />
          </div>

          <div className="sticky bottom-0 z-10 rounded-b-3xl bg-white/40 px-6 py-4 sm:px-8 backdrop-blur-xl border-t border-white/20">
            <motion.button
              type="submit"
              whileTap={{ scale: 0.98 }}
              whileHover={{ y: -1 }}
              className="group relative w-full overflow-hidden rounded-2xl bg-gradient-to-br from-rose-600 to-red-500 px-6 py-3 text-center text-white shadow-lg focus:outline-none disabled:opacity-100"
              disabled={formDisabled}
            >
              <span className="relative z-10 font-semibold">
                {submitting ? "Creating your account…" : "Create Account"}
              </span>
              <motion.span
                aria-hidden
                initial={{ x: "-100%" }}
                animate={{ x: submitting ? "-100%" : ["-100%", "100%"] }}
                transition={{ duration: 2, repeat: submitting ? 0 : Infinity }}
                className="absolute inset-y-0 -skew-x-12 w-1/3 bg-white/20"
              />
            </motion.button>
            <p className="mt-2 text-center text-xs text-gray-200">
              Already have an account? <a href="#" className="font-medium text-rose-200 hover:underline">Sign in</a>
            </p>
          </div>
        </motion.form>
      </div>
    </div>
  );
}

function Field({ label, required, hint, children }: { label: string; required?: boolean; hint?: string; children: React.ReactNode; }) {
  return (
    <motion.div variants={item} className="flex flex-col gap-1.5">
      <div className="flex items-baseline gap-2">
        <label className="text-sm font-medium text-gray-200">
          {label} {required && <span className="text-rose-300">*</span>}
        </label>
        {hint && <span className="text-xs text-gray-400">{hint}</span>}
      </div>
      {children}
    </motion.div>
  );
}

function Section({ title }: { title: string }) {
  return (
    <div className="col-span-full mb-1 flex items-center gap-2">
      <div className="h-5 w-1 rounded-full bg-rose-400" />
      <h2 className="text-sm font-semibold text-gray-100">{title}</h2>
    </div>
  );
}
