"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient"; 

type Role = "donor" | "hospital" | "";

type DonorForm = {
  fullName: string;
  gender: "male" | "female" | "other" | "";
  dob: string; 
  email: string;
  phone: string; 
  password: string;
  confirmPassword: string;
  bloodGroup: string;
  city: string;
  state: string;
};

type HospitalForm = {
  hospitalName: string;
  contactPerson: string;
  email: string;
  phone: string; 
  password: string;
  confirmPassword: string;
  licenseNo: string;
  city: string;
  state: string;
};

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as const;


const INPUT_BASE =
  "w-full rounded-xl border bg-white/10 backdrop-blur-md px-3 py-2 text-sm text-black placeholder-white/70 outline-none shadow-sm transition focus:ring-2";
const SELECT_CLS = (role: Role) =>
  `${INPUT_BASE} ${
    role === "hospital"
      ? "border-sky-400 focus:border-sky-500 focus:ring-sky-300"
      : "border-rose-400 focus:border-rose-500 focus:ring-rose-300"
  }`;
const INPUT_CLS = `${INPUT_BASE} border-rose-400 focus:border-rose-500 focus:ring-rose-300`;

const container = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { staggerChildren: 0.04 } },
};
const item = { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } };


const STATE_TO_CITIES: Record<string, string[]> = {
  "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Tirupati", "Kurnool"],
  Assam: ["Guwahati", "Dibrugarh", "Silchar", "Jorhat", "Tezpur"],
  Bihar: ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur"],
  Chhattisgarh: ["Raipur", "Bhilai", "Bilaspur", "Durg"],
  Delhi: ["New Delhi", "Delhi"],
  Goa: ["Panaji", "Margao", "Vasco da Gama", "Mapusa"],
  Gujarat: ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar"],
  Haryana: ["Gurugram", "Faridabad", "Panipat", "Karnal", "Hisar"],
  "Himachal Pradesh": ["Shimla", "Solan", "Dharamshala", "Mandi"],
  Jharkhand: ["Ranchi", "Jamshedpur", "Dhanbad", "Hazaribagh"],
  Karnataka: ["Bengaluru", "Mysuru", "Mangaluru", "Hubballi", "Belagavi", "Shivamogga"],
  Kerala: ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur"],
  "Madhya Pradesh": ["Bhopal", "Indore", "Gwalior", "Jabalpur", "Ujjain"],
  Maharashtra: ["Mumbai", "Pune", "Nagpur", "Nashik", "Thane", "Aurangabad"],
  Odisha: ["Bhubaneswar", "Cuttack", "Rourkela", "Sambalpur"],
  Punjab: ["Ludhiana", "Amritsar", "Jalandhar", "Patiala"],
  Rajasthan: ["Jaipur", "Udaipur", "Jodhpur", "Kota", "Ajmer"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem"],
  Telangana: ["Hyderabad", "Warangal", "Khammam", "Karimnagar", "Nizamabad"],
  "Uttar Pradesh": ["Lucknow", "Kanpur", "Varanasi", "Agra", "Prayagraj", "Noida", "Ghaziabad"],
  Uttarakhand: ["Dehradun", "Haridwar", "Haldwani", "Rishikesh"],
  "West Bengal": ["Kolkata", "Howrah", "Durgapur", "Asansol", "Siliguri"],
  "Jammu and Kashmir": ["Srinagar", "Jammu", "Anantnag"],
  Ladakh: ["Leh", "Kargil"],
};
const INDIAN_STATES = Object.keys(STATE_TO_CITIES).sort();

const STATE_ALIASES: Record<string, string> = {
  WB: "West Bengal",
  "West-Bengal": "West Bengal",
  TS: "Telangana",
  AP: "Andhra Pradesh",
  MH: "Maharashtra",
  "Maharastra": "Maharashtra",
  TN: "Tamil Nadu",
  KA: "Karnataka",
  DL: "Delhi",
  UP: "Uttar Pradesh",
};
const normalizeState = (s: string) => STATE_ALIASES[s] ?? s;


async function upsertProfile(userId: string, role: Exclude<Role, "">) {
  return supabase.from("profiles").upsert({ user_id: userId, role }, { onConflict: "user_id" });
}

async function insertDonor(userId: string, donor: DonorForm) {
  return supabase.from("donors").upsert(
    {
      user_id: userId,
      full_name: donor.fullName,
      gender: donor.gender || "other",
      dob: donor.dob,
      phone: donor.phone,
      blood_group: donor.bloodGroup,
      city: donor.city,
      state: normalizeState(donor.state),
    },
    { onConflict: "user_id" }
  );
}

async function insertHospital(userId: string, hospital: HospitalForm) {
  return supabase.from("hospitals").upsert(
    {
      user_id: userId,
      hospital_name: hospital.hospitalName,
      contact_person: hospital.contactPerson,
      license_no: hospital.licenseNo,
      phone: hospital.phone,
      city: hospital.city,
      state: normalizeState(hospital.state),
    },
    { onConflict: "user_id" }
  );
}

async function persistRoleTablesImmediately(
  role: Role,
  donor: DonorForm,
  hospital: HospitalForm
): Promise<{ ok: boolean; message?: string }> {
  const { data: userInfo, error: getErr } = await supabase.auth.getUser();
  if (getErr) return { ok: false, message: getErr.message };
  const user = userInfo.user;
  if (!user) return { ok: false, message: "User not signed in yet. Check your email to verify your account." };

  if (role === "donor") {
    const pr = await upsertProfile(user.id, "donor");
    if (pr.error) return { ok: false, message: pr.error.message };
    const dr = await insertDonor(user.id, donor);
    if (dr.error) return { ok: false, message: dr.error.message };
  } else if (role === "hospital") {
    const pr = await upsertProfile(user.id, "hospital");
    if (pr.error) return { ok: false, message: pr.error.message };
    const hr = await insertHospital(user.id, hospital);
    if (hr.error) return { ok: false, message: hr.error.message };
  }
  return { ok: true };
}


export default function SignupForm() {
  const [role, setRole] = useState<Role>("");
  const [message, setMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [donor, setDonor] = useState<DonorForm>({
    fullName: "",
    gender: "",
    dob: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    bloodGroup: "",
    city: "",
    state: "",
  });

  const [hospital, setHospital] = useState<HospitalForm>({
    hospitalName: "",
    contactPerson: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    licenseNo: "",
    city: "",
    state: "",
  });

  function upDonor<K extends keyof DonorForm>(k: K, v: DonorForm[K]) {
    setDonor((f) => ({ ...f, [k]: v }));
  }
  function upHospital<K extends keyof HospitalForm>(k: K, v: HospitalForm[K]) {
    setHospital((f) => ({ ...f, [k]: v }));
  }

  const donorCities = donor.state ? STATE_TO_CITIES[normalizeState(donor.state)] ?? [] : [];
  const hospitalCities = hospital.state ? STATE_TO_CITIES[normalizeState(hospital.state)] ?? [] : [];

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);

    try {
      setSubmitting(true);

      if (role === "donor") {
        if (donor.password !== donor.confirmPassword) throw new Error("Passwords do not match.");
        if (!/^\+\d{10,15}$/.test(donor.phone)) throw new Error("Phone must be in E.164 format, e.g. +91XXXXXXXXXX");

        const { data, error } = await supabase.auth.signUp({
          email: donor.email.trim(),
          password: donor.password,
          options: {
            data: {
              role,
              full_name: donor.fullName,
              gender: donor.gender,
              dob: donor.dob,
              phone: donor.phone,
              blood_group: donor.bloodGroup,
              city: donor.city,
              state: normalizeState(donor.state),
            },
            emailRedirectTo: typeof window !== "undefined" ? `${window.location.origin}/auth/callback` : undefined,
          },
        });
        if (error) throw error;

        if (data?.session) {
          const res = await persistRoleTablesImmediately(role, donor, hospital);
          if (!res.ok) throw new Error(res.message || "Could not finish setting up your account.");
          setMessage("✅ Donor account created and saved. You’re signed in.");
        } else {
          setMessage("✅ Donor account created! Check your email to verify. We’ll finish setup after you open the link.");
        }
      } else if (role === "hospital") {
        if (hospital.password !== hospital.confirmPassword) throw new Error("Passwords do not match.");
        if (!/^\+\d{10,15}$/.test(hospital.phone)) throw new Error("Phone must be in E.164 format, e.g. +91XXXXXXXXXX");

        const { data, error } = await supabase.auth.signUp({
          email: hospital.email.trim(),
          password: hospital.password,
          options: {
            data: {
              role,
              hospital_name: hospital.hospitalName,
              contact_person: hospital.contactPerson,
              license_no: hospital.licenseNo,
              phone: hospital.phone,
              city: hospital.city,
              state: normalizeState(hospital.state),
            },
            emailRedirectTo: typeof window !== "undefined" ? `${window.location.origin}/auth/callback` : undefined,
          },
        });
        if (error) throw error;

        if (data?.session) {
          const res = await persistRoleTablesImmediately(role, donor, hospital);
          if (!res.ok) throw new Error(res.message || "Could not finish setting up your account.");
          setMessage("✅ Hospital account created and saved. You’re signed in.");
        } else {
          setMessage("✅ Hospital account created! Check your email to verify. We’ll finish setup after you open the link.");
        }
      } else {
        throw new Error("Please choose an account type.");
      }
    } catch (e: unknown) {
      if (e instanceof Error) {
        setMessage(e.message || "Something went wrong. Try again.");
      } else {
        setMessage("Something went wrong. Try again.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  const formDisabled =
    submitting ||
    role === "" ||
    (role === "donor"
      ? !donor.fullName ||
        !donor.gender ||
        !donor.dob ||
        !donor.email ||
        !donor.phone ||
        !donor.password ||
        donor.password !== donor.confirmPassword ||
        !donor.bloodGroup ||
        !donor.state ||
        !donor.city
      : role === "hospital"
      ? !hospital.hospitalName ||
        !hospital.contactPerson ||
        !hospital.email ||
        !hospital.phone ||
        !hospital.password ||
        hospital.password !== hospital.confirmPassword ||
        !hospital.licenseNo ||
        !hospital.state ||
        !hospital.city
      : true);

  const shadowTint = role === "hospital" ? "rgba(56,189,248,0.35)" : "rgba(244,63,94,0.35)";

  return (
    <div className="relative isolate min-h-[100dvh] w-full overflow-hidden">
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
      <div className="absolute inset-0 z-10 bg-black/30" />

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

      <div className="relative z-20 mx-auto mt-20 flex max-w-6xl flex-col items-center px-4 py-14 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mb-6 text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl drop-shadow">
            Create Account
          </h1>
          <p className="mt-2 text-sm text-white/80">Choose your account type.</p>
        </motion.div>

        <motion.form
          onSubmit={onSubmit}
          variants={container}
          initial="hidden"
          animate="show"
          className="relative w-full max-w-3xl rounded-3xl border border-white/25  bg-white/20  backdrop-blur-xl"
          style={{ boxShadow: `0 10px 40px -10px ${shadowTint}` }}
        >
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-3xl"
            animate={{ boxShadow: [`0 10px 40px -10px ${shadowTint}`, `0 14px 52px -10px ${shadowTint}`, `0 10px 40px -10px ${shadowTint}`] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
          />

          <div
            className="sticky top-0 z-10 rounded-t-3xl bg-white/15 px-6 py-4 sm:px-8 backdrop-blur-md border-b border-white/20"
            style={{ borderColor: role === "hospital" ? "rgba(56,189,248,0.35)" : "rgba(244,114,182,0.35)" }}
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Field label="Account Type" required>
                <select className={SELECT_CLS(role)} value={role} onChange={(e) => setRole(e.target.value as Role)}>
                  <option className="text-gray-500" value="">I want to create…</option>
                  <option value="donor">Donor Account</option>
                  <option value="hospital">Hospital Account</option>
                </select>
              </Field>
            </div>
          </div>

          <div className="max-h-[70vh] overflow-y-auto px-6 py-6 sm:px-8">
            <AnimatePresence mode="wait">
              {role === "" && (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="flex items-center justify-center py-12"
                >
                  <p className="text-sm text-black">Select an account type above to continue.</p>
                </motion.div>
              )}

              {role === "donor" && (
                <motion.div
                  key="donor"
                  initial="hidden"
                  variants={container}
                  animate="show"
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.28 }}
                  className="grid grid-cols-1 gap-4 sm:grid-cols-2"
                >
                  <Section title="Donor Details" role={role} />

                  <Field label="Full Name" required>
                    <input className={INPUT_CLS} value={donor.fullName} onChange={(e) => upDonor("fullName", e.target.value)} placeholder="Ritin Mandal" />
                  </Field>

                  <Field label="Gender" required>
                    <select className={SELECT_CLS(role)} value={donor.gender} onChange={(e) => upDonor("gender", e.target.value as DonorForm["gender"])}>
                      <option value="">Select…</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other / Prefer not to say</option>
                    </select>
                  </Field>

                  <Field label="Date of Birth" required>
                    <input type="date" className={INPUT_CLS} value={donor.dob} onChange={(e) => upDonor("dob", e.target.value)} />
                  </Field>

                  <Field label="Blood Group" required>
                    <select className={SELECT_CLS(role)} value={donor.bloodGroup} onChange={(e) => upDonor("bloodGroup", e.target.value)}>
                      <option value="">Select…</option>
                      {BLOOD_GROUPS.map((g) => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </Field>

                  <Field label="State" required>
                    <select
                      className={SELECT_CLS(role)}
                      value={donor.state}
                      onChange={(e) => {
                        const st = e.target.value;
                        setDonor((f) => ({ ...f, state: st, city: "" }));
                      }}
                    >
                      <option value="">Select…</option>
                      {INDIAN_STATES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </Field>

                  <Field label="City" required>
                    <select
                      className={SELECT_CLS(role)}
                      value={donor.city}
                      onChange={(e) => upDonor("city", e.target.value)}
                      disabled={!donor.state}
                    >
                      <option value="">{donor.state ? "Select…" : "Select state first"}</option>
                      {donorCities.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </Field>

                  <Field label="Email" required>
                    <input type="email" className={INPUT_CLS} value={donor.email} onChange={(e) => upDonor("email", e.target.value)} placeholder="you@example.com" />
                  </Field>

                  <Field label="Phone (with country code)" required>
                    <input className={INPUT_CLS} value={donor.phone} onChange={(e) => upDonor("phone", e.target.value)} placeholder="+91XXXXXXXXXX" />
                  </Field>

                  <Field label="Password" required>
                    <input type="password" className={INPUT_CLS} value={donor.password} onChange={(e) => upDonor("password", e.target.value)} placeholder="••••••••" />
                  </Field>
                  <Field label="Confirm Password" required>
                    <input type="password" className={INPUT_CLS} value={donor.confirmPassword} onChange={(e) => upDonor("confirmPassword", e.target.value)} placeholder="••••••••" />
                  </Field>
                </motion.div>
              )}

              {role === "hospital" && (
                <motion.div
                  key="hospital"
                  variants={container}
                  initial="hidden"
                  animate="show"
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.28 }}
                  className="grid grid-cols-1 gap-4 sm:grid-cols-2"
                >
                  <Section title="Hospital Details" role={role} />

                  <Field label="Hospital Name" required>
                    <input className={SELECT_CLS(role)} value={hospital.hospitalName} onChange={(e) => upHospital("hospitalName", e.target.value)} placeholder="City Care Hospital" />
                  </Field>

                  <Field label="Contact Person" required>
                    <input className={SELECT_CLS(role)} value={hospital.contactPerson} onChange={(e) => upHospital("contactPerson", e.target.value)} placeholder="Dr. A. Sharma" />
                  </Field>

                  <Field label="License / Registration No." required>
                    <input className={SELECT_CLS(role)} value={hospital.licenseNo} onChange={(e) => upHospital("licenseNo", e.target.value)} placeholder="MH/BB/2025/0123" />
                  </Field>

                  <Field label="State" required>
                    <select
                      className={SELECT_CLS(role)}
                      value={hospital.state}
                      onChange={(e) => {
                        const st = e.target.value;
                        setHospital((f) => ({ ...f, state: st, city: "" }));
                      }}
                    >
                      <option value="">Select…</option>
                      {INDIAN_STATES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </Field>

                  <Field label="City" required>
                    <select
                      className={SELECT_CLS(role)}
                      value={hospital.city}
                      onChange={(e) => upHospital("city", e.target.value)}
                      disabled={!hospital.state}
                    >
                      <option value="">{hospital.state ? "Select…" : "Select state first"}</option>
                      {hospitalCities.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </Field>

                  <Field label="Email" required>
                    <input type="email" className={SELECT_CLS(role)} value={hospital.email} onChange={(e) => upHospital("email", e.target.value)} placeholder="admin@hospital.in" />
                  </Field>

                  <Field label="Phone (with country code)" required>
                    <input className={SELECT_CLS(role)} value={hospital.phone} onChange={(e) => upHospital("phone", e.target.value)} placeholder="+91XXXXXXXXXX" />
                  </Field>

                  <Field label="Password" required>
                    <input type="password" className={SELECT_CLS(role)} value={hospital.password} onChange={(e) => upHospital("password", e.target.value)} placeholder="••••••••" />
                  </Field>
                  <Field label="Confirm Password" required>
                    <input type="password" className={SELECT_CLS(role)} value={hospital.confirmPassword} onChange={(e) => upHospital("confirmPassword", e.target.value)} placeholder="••••••••" />
                  </Field>
                </motion.div>
              )}
            </AnimatePresence>

            {message && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`mt-4 rounded-xl border px-3 py-2 text-sm ${
                  message.startsWith("✅")
                    ? "border-emerald-300 bg-emerald-400/20 text-emerald-100"
                    : "border-rose-300 bg-rose-400/20 text-rose-100"
                }`}
              >
                {message}
              </motion.div>
            )}
            <div className="h-3" />
          </div>

          <div
            className="sticky bottom-0 z-10 rounded-b-3xl bg-white/15 px-6 py-4 sm:px-8 backdrop-blur-md border-t border-white/20"
            style={{ borderColor: role === "hospital" ? "rgba(56,189,248,0.35)" : "rgba(244,114,182,0.35)" }}
          >
            <motion.button
              type="submit"
              disabled={formDisabled}
              whileTap={{ scale: 0.98 }}
              whileHover={{ y: -1 }}
              className="group relative w-full overflow-hidden rounded-2xl bg-gradient-to-br from-rose-600 to-red-500 px-6 py-3 text-center text-white shadow-lg focus:outline-none disabled:opacity-60"
            >
              <span className="relative z-10 font-semibold">
                {submitting ? "Creating your account…" : "Create Account"}
              </span>
              <motion.span
                aria-hidden
                initial={{ x: "-100%" }}
                animate={{ x: submitting ? "-100%" : ["-100%", "100%"] }}
                transition={{ duration: 2, repeat: submitting ? 0 : Infinity }}
                className="absolute inset-y-0 -skew-x-12 w-1/3 bg-white/25"
              />
            </motion.button>
          </div>
        </motion.form>
      </div>
    </div>
  );
}


function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div variants={item} className="flex flex-col gap-1.5">
      <div className="flex items-baseline gap-2">
        <label className="text-sm font-medium text-white">
          {label} {required && <span className="text-rose-300">*</span>}
        </label>
        {hint && <span className="text-xs text-white/70">{hint}</span>}
      </div>
      {children}
    </motion.div>
  );
}

function Section({ title, role }: { title: string; role: Role }) {
  const isHospital = role === "hospital";
  return (
    <div className="col-span-full mb-1 flex items-center gap-2">
      <div className={`h-5 w-1 rounded-full ${isHospital ? "bg-sky-300" : "bg-rose-300"}`} />
      <h2 className="text-sm font-semibold text-white">{title}</h2>
    </div>
  );
}
