// components/UserSessionProvider.tsx
"use client";

import { useEffect, useState, createContext, useContext } from "react";
import {
  createClientComponentClient,
  Session,
} from "@supabase/auth-helpers-nextjs"; // Importa Session
// Asegúrate que tu supabaseClients.ts use createClientComponentClient
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
  initialSession, // Acepta initialSession como prop
}: {
  children: React.ReactNode;
  initialSession?: Session | null; // Define el tipo
}) => {
  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);
  const supabaseClient = createClientComponentClient(); // Cliente específico para este componente si es necesario

  // Función para cargar el perfil, ahora más genérica
  const loadUserProfile = async (supabaseUser: any) => {
    // Acepta el objeto user de Supabase
    if (!supabaseUser) {
      setUser(null);
      setLoading(false);
      localStorage.removeItem("user_session"); // Limpiar si no hay usuario
      return;
    }

    try {
      // 🔍 Verifica si el email existe en la tabla users
      const { data: existingUser, error: userError } = await supabaseClient
        .from("users")
        .select("id")
        .eq("email", supabaseUser.email)
        .single();

      if (!existingUser || userError) {
        console.warn(
          "❌ Usuario no autorizado en DB:",
          supabaseUser.email,
          userError
        );
        await supabaseClient.auth.signOut(); // ⛔ Cierra sesión si no existe en tu tabla de usuarios
        setUser(null);
        setLoading(false);
        localStorage.removeItem("user_session");
        return;
      }

      // Ahora sí, carga el perfil detallado
      const { data: profile, error: profileError } = await supabaseClient
        .from("users")
        .select("id, full_name, email, role, role_id, company_id, sede_id")
        .eq("id", supabaseUser.id)
        .single();

      if (!profile || profileError) {
        console.error(
          "❌ No se encontró perfil en tabla users (después de validar email)",
          profileError
        );
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

      localStorage.setItem("user_session", JSON.stringify(fullUser)); // Considera si realmente necesitas esto
      setUser(fullUser);
      setLoading(false); // Finaliza la carga aquí
    } catch (e) {
      console.error("⚠️ Error al cargar perfil:", e);
      setUser(null);
      setLoading(false);
      localStorage.removeItem("user_session");
    }
  };

  useEffect(() => {
    // Al montar, primero intenta usar la sesión inicial si viene de SSR
    if (initialSession?.user) {
      loadUserProfile(initialSession.user);
    } else {
      // Si no hay initialSession (ej. es un client-side navigation o el SSR no tenía sesión),
      // intenta obtenerla del cliente Supabase.
      supabaseClient.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          loadUserProfile(session.user);
        } else {
          setUser(null);
          setLoading(false);
          localStorage.removeItem("user_session");
        }
      });
    }

    // Suscribirse a cambios de autenticación
    const { data: authListener } = supabaseClient.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session?.user) {
          setLoading(true); // Reinicia la carga al iniciar sesión
          await loadUserProfile(session.user);
        } else if (event === "SIGNED_OUT") {
          setUser(null);
          localStorage.removeItem("user_session");
          setLoading(false);
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [initialSession, supabaseClient]); // Dependencias: initialSession y supabaseClient

  return (
    <UserSessionContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserSessionContext.Provider>
  );
};
