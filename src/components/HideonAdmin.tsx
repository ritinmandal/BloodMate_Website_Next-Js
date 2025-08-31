"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";

export default function HideOnAdmin({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");
  if (isAdmin) return null;
  return <>{children}</>;
}
