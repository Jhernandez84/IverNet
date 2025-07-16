"use client";

import { useEffect, useState, createContext, useContext } from "react";
import {
  createClientComponentClient,
  Session,
} from "@supabase/auth-helpers-nextjs";
import { supabase } from "@/app/utils/supabaseClients";

type UserSession = {
  id: string;
  full_name: string;
  email: string;
  avatar_url?: string;
  role: string;
  role_id: string;
  company_id: string;
  sede_id?: string | null;
  access: string[];
  scopedBySede: boolean;
};

type SessionContextType = {
  user: UserSession | null;
  setUser: React.Dispatch<React.SetStateAction<UserSession | null>>;
  loading: boolean;
};

const UserSessionContext = createContext<SessionContextType>({
  user: null,
  setUser: () => {},
  loading: true,
});

export const useUserSession = () => useContext(UserSessionContext);

export const UserSessionProvider = ({
  children,
  initialSession,
}: {
  children: React.ReactNode;
  initialSession?: Session | null;
}) => {
  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);
  const supabaseClient = createClientComponentClient();

  const loadUserProfile = async (supabaseUser: any) => {
    if (!supabaseUser) {
      setUser(null);
      setLoading(false);
      localStorage.removeItem("user_session");
      return;
    }

    try {
      const { data: existingUser, error: userError } = await supabaseClient
        .from("users")
        .select("id")
        .eq("email", supabaseUser.email)
        .single();

      if (!existingUser || userError) {
        console.warn("❌ Usuario no autorizado en DB:", supabaseUser.email);
        await supabaseClient.auth.signOut();
        setUser(null);
        setLoading(false);
        localStorage.removeItem("user_session");
        return;
      }

      const { data: profile, error: profileError } = await supabaseClient
        .from("users")
        .select("id, full_name, email, role, role_id, company_id, sede_id")
        .eq("id", supabaseUser.id)
        .single();

      if (!profile || profileError) {
        console.error("❌ No se encontró perfil válido", profileError);
        setUser(null);
        setLoading(false);
        localStorage.removeItem("user_session");
        return;
      }

      const { data: accessData } = await supabaseClient
        .from("user_access")
        .select("menu_items(key)")
        .eq("user_id", profile.id);

      const access = accessData?.map((item: any) => item.menu_items?.key) || [];
      const scopedBySede = profile.role !== "Admin" && !!profile.sede_id;

      const fullUser: UserSession = {
        id: profile.id,
        email: profile.email,
        full_name:
          profile.full_name || supabaseUser.user_metadata.full_name || "",
        avatar_url: supabaseUser.user_metadata.avatar_url || "",
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
    } catch (e) {
      console.error("⚠️ Error al cargar perfil:", e);
      setUser(null);
      setLoading(false);
      localStorage.removeItem("user_session");
    }
  };

  useEffect(() => {
    const init = async () => {
      if (initialSession?.user) {
        await loadUserProfile(initialSession.user);
      } else {
        const {
          data: { user },
          error,
        } = await supabaseClient.auth.getUser();
        if (user) {
          await loadUserProfile(user);
        } else {
          setUser(null);
          setLoading(false);
          localStorage.removeItem("user_session");
        }
      }
    };

    init();

    const { data: authListener } = supabaseClient.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session?.user) {
          setLoading(true);
          await loadUserProfile(session.user);
        } else if (event === "SIGNED_OUT") {
          setUser(null);
          setLoading(false);
          localStorage.removeItem("user_session");
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [initialSession, supabaseClient]);

  return (
    <UserSessionContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserSessionContext.Provider>
  );
};
