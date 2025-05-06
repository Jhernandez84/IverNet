"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/utils/supabaseClients";

type UserSession = {
  id: string;
  full_name: string;
  email: string;
  role: string;
  company_id: string;
  sede_id?: string | null;
  access: string[];
  scopedBySede: boolean;
};

export function useUserSession() {
  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      setLoading(true);

      const {
        data: { user: authUser },
        error: authError,
      } = await supabase.auth.getUser();

      if (!authUser || authError) {
        setUser(null);
        setLoading(false);
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("users")
        .select("id, full_name, email, role, company_id, sede_id")
        .eq("id", authUser.id)
        .single();

      if (!profile || profileError) {
        console.error("❌ No se encontró perfil en tabla users");
        setUser(null);
        setLoading(false);
        return;
      }

      const { data: accessData, error: accessError } = await supabase
        .from("user_access")
        .select("menu_items(key)")
        .eq("user_id", profile.id);

      if (accessError) {
        console.error("Error al obtener accesos:", accessError);
      }

      const access = accessData?.map((item: any) => item.menu_items?.key) || [];

      const scopedBySede = profile.role === "tesoreria" && !!profile.sede_id;

      setUser({
        id: profile.id,
        full_name: profile.full_name,
        email: profile.email,
        role: profile.role,
        company_id: profile.company_id,
        sede_id: profile.sede_id,
        access,
        scopedBySede,
      });

      setLoading(false);
    };

    fetchSession();
  }, []);

  return { user, loading };
}
