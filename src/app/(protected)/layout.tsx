// app/(protected)/layout.tsx
import { ReactNode } from "react";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { UserSessionProvider } from "@/hooks/useUserSession";
import ProtectedLayoutClient from "../components/navBar/ProtectedLayoutClient";

export default async function ProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  const supabase = createServerComponentClient({ cookies: () => cookies() });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Seguridad: verifica la sesión con el servidor
  const { data: user, error } = await supabase.auth.getUser();

  if (!session || !user || error) {
    // Opcional: redireccionar si no hay sesión válida
    // redirect("/login");
    console.warn("No hay sesión válida");
  }

  return (
    <UserSessionProvider initialSession={session}>
      <ProtectedLayoutClient>{children}</ProtectedLayoutClient>
    </UserSessionProvider>
  );
}
