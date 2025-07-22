import { ReactNode } from "react";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { UserSessionProvider } from "@/hooks/useUserSession";
import ProtectedLayoutClient from "../components/navBar/ProtectedLayoutClient";
import { redirect } from "next/navigation";

export default async function ProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  const supabase = createServerComponentClient({ cookies: () => cookies() });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { data: user, error } = await supabase.auth.getUser();

  if (!session || !user || error) {
    redirect("/login");
  }

  return (
    <UserSessionProvider>
      <ProtectedLayoutClient>{children}</ProtectedLayoutClient>
    </UserSessionProvider>
  );
}
