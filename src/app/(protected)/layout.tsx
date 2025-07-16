// app/(protected)/layout.tsx
import { ReactNode } from "react";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { UserSessionProvider } from "@/hooks/useUserSession"; // Asegúrate que exportas esto
import ProtectedLayoutClient from "../components/navBar/ProtectedLayoutClient";

export default async function ProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <UserSessionProvider initialSession={session}>
      <ProtectedLayoutClient>{children}</ProtectedLayoutClient>
    </UserSessionProvider>
  );
}
