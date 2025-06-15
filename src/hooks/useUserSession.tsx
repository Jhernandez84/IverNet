"use client";

import { useEffect, useState, createContext, useContext } from "react";
import { supabase } from "@/app/utils/supabaseClients";

type UserSession = {
  id: string;
  full_name: string;
  email: string;
  role: string;
  role_id: string;
  company_id: string;
  sede_id?: string | null;
  access: string[];
  scopedBySede: boolean;
};

type SessionContextType = {
  user: UserSession | null;
  loading: boolean;
};

const UserSessionContext = createContext<SessionContextType>({
  user: null,
  loading: true,
});

export const useUserSession = () => useContext(UserSessionContext);

export const UserSessionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      const cached = localStorage.getItem("user_session");
      if (cached) {
        setUser(JSON.parse(cached));
        setLoading(false);
        return;
      }

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
        .select("id, full_name, email, role, role_id, company_id, sede_id")
        .eq("id", authUser.id)
        .single();

      if (!profile || profileError) {
        console.error("❌ No se encontró perfil en tabla users");
        setUser(null);
        setLoading(false);
        return;
      }

      const { data: accessData } = await supabase
        .from("user_access")
        .select("menu_items(key)")
        .eq("user_id", profile.id);

      const access = accessData?.map((item: any) => item.menu_items?.key) || [];
      const scopedBySede = profile.role !== "Admin" && !!profile.sede_id;

      const fullUser: UserSession = {
        id: profile.id,
        full_name: profile.full_name,
        email: profile.email,
        role: profile.role,
        role_id: profile.role_id,
        company_id: profile.company_id,
        sede_id: profile.sede_id,
        access,
        scopedBySede,
      };

      localStorage.setItem("user_session", JSON.stringify(fullUser));
      setUser(fullUser);
      setLoading(false);
    };

    fetchSession();
  }, []);

  return (
    <UserSessionContext.Provider value={{ user, loading }}>
      {children}
    </UserSessionContext.Provider>
  );
};
