// app/(protected)/layout.tsx
"use client";
import { ReactNode } from "react";
import ProtectedLayoutClient from "../components/navBar/ProtectedLayoutClient";

import { useUserSession } from "@/hooks/useUserSession";

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  const { loading } = useUserSession();

  if (loading) return <div className="p-6">Cargandola sesión...</div>;

  return <ProtectedLayoutClient>{children}</ProtectedLayoutClient>;
}
