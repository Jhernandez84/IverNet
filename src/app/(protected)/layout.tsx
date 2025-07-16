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
  // ✅ Asegura el uso correcto de cookies para producción
  const supabase = createServerComponentClient({ cookies: () => cookies() });

  // ✅ Obtiene la sesión actual desde cookies (SSR)
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // ✅ Verifica si el usuario existe desde el token (más seguro)
  const { data: user, error } = await supabase.auth.getUser();

  if (!session || !user || error) {
    console.warn("🔒 No hay sesión válida en SSR:", { session, error });
    // Opcional: Redirigir si es necesario
    // redirect("/login");
  } else {
    console.log("✅ SSR session OK:", user);
  }

  return (
    <UserSessionProvider>
      <ProtectedLayoutClient>{children}</ProtectedLayoutClient>
    </UserSessionProvider>
  );
}
