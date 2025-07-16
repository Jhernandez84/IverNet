"use client";

import { ReactNode } from "react";
import NavBar from "./NavBar"; // tu componente NavBar
import { useUserSession } from "@/hooks/useUserSession";

export default function ProtectedLayoutClient({
  children,
}: {
  children: ReactNode;
}) {
  const { loading } = useUserSession();

  if (loading) return <div className="p-4 text-white">Cargand d...</div>;

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className="flex-1 p-4">{children}</main>
    </div>
  );
}
