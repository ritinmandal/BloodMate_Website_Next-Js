"use client";
import { motion } from "framer-motion";
import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gradient-to-br from-red-900 via-red-800 to-black text-white px-6">
      <motion.h1
        className="text-7xl font-bold mb-4"
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        404
      </motion.h1>

      <motion.p
        className="text-xl text-gray-300 mb-6 text-center max-w-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Oops! The page you are looking for does not exist.
      </motion.p>

      <Link
        href="/"
        className="rounded-2xl bg-red-600 px-6 py-3 font-semibold hover:bg-red-700 transition"
      >
        Go Home
      </Link>
    </div>
  );
}
