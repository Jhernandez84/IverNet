import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import type { ReactNode } from "react";
import ClientWrapper from "../components/navBar/ClientWrapper";
import NavBar from "../components/navBar/page";

export default async function ProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login"); // redirige si no hay sesión
  } else {
    console.log(session);
  }

  return (
    <html lang="es">
      <ClientWrapper>
        <NavBar />
      </ClientWrapper>
      <body>{children}</body>
    </html>
  );
}
