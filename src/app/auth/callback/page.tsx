"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function AuthCallback() {
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    const getSessionAndUser = async () => {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session) {
        console.error("No hay sesión válida:", sessionError?.message);
        router.push("/");
        return;
      }

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError || !user) {
        console.error("No se pudo obtener usuario:", userError?.message);
        router.push("/");
        return;
      }
      router.push("/myaccount");
    };

    getSessionAndUser();
  }, []);

  return <p className="text-center mt-10">Autenticando...</p>;
}
