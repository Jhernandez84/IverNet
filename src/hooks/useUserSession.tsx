"use client";

import { useEffect, useState, createContext, useContext } from "react";
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
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserProfile = async (userId: string) => {
      try {
        const { data: authUser, error: authError } =
          await supabase.auth.getUser();
        const metadata = authUser?.user?.user_metadata || {};

        const { data: profile, error: profileError } = await supabase
          .from("users")
          .select("id, full_name, email, role, role_id, company_id, sede_id")
          .eq("id", userId)
          .single();

        if (!profile || profileError) {
          console.error(
            "❌ No se encontró perfil en tabla users",
            profileError
          );
          setUser(null);
          localStorage.removeItem("user_session");
          return;
        }

        const { data: accessData } = await supabase
          .from("user_access")
          .select("menu_items(key)")
          .eq("user_id", profile.id);

        const access =
          accessData?.map((item: any) => item.menu_items?.key) || [];
        const scopedBySede = profile.role !== "Admin" && !!profile.sede_id;

        const fullUser: UserSession = {
          id: profile.id,
          email: profile.email,
          full_name: profile.full_name || metadata.full_name || "",
          avatar_url: metadata.avatar_url || "", // viene desde Google
          role: profile.role,
          role_id: profile.role_id,
          company_id: profile.company_id,
          sede_id: profile.sede_id,
          access,
          scopedBySede,
        };

        localStorage.setItem("user_session", JSON.stringify(fullUser));
        setUser(fullUser);
      } catch (e) {
        console.error("⚠️ Error al cargar perfil:", e);
        setUser(null);
        localStorage.removeItem("user_session");
      } finally {
        setLoading(false);
      }
    };

    const fetchSession = async () => {
      const {
        data: { user: authUser },
        error: authError,
      } = await supabase.auth.getUser();

      if (!authUser || authError) {
        setUser(null);
        localStorage.removeItem("user_session");
        setLoading(false);
        return;
      }

      // 🔍 Verifica si el email existe en la tabla users
      const { data: existingUser, error: userError } = await supabase
        .from("users")
        .select("id")
        .eq("email", authUser.email)
        .single();

      if (!existingUser || userError) {
        console.warn("❌ Usuario no autorizado:", authUser.email);
        await supabase.auth.signOut(); // ⛔ Cierra sesión
        setUser(null);
        localStorage.removeItem("user_session");
        setLoading(false);
        return;
      }

      // ✅ Si todo bien, cargar el perfil por ID
      await loadUserProfile(authUser.id);
    };

    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session?.user) {
          setLoading(true);
          await loadUserProfile(session.user.id);
        }

        if (event === "SIGNED_OUT") {
          setUser(null);
          localStorage.removeItem("user_session");
          setLoading(false);
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  console.log("🔐 full session data:", user);

  return (
    <UserSessionContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserSessionContext.Provider>
  );
};
