"use client";

import { useUserSession } from "@/hooks/useUserSession";
import { supabase } from "@/app/utils/supabaseClients";

export default function DashboardPage() {
  const { user, loading } = useUserSession();

  if (loading) return <p className="p-6">Cargando...</p>;
  if (!user)
    return <p className="p-6 text-red-500">No se pudo cargar el perfil.</p>;

  const crearUsuarioConLink = async ({
    email,
    full_name,
    company_id,
    role_id,
    sede_id,
  }: {
    email: string;
    full_name: string;
    company_id: string;
    role_id: string;
    sede_id: string;
  }) => {
    // 1. Invitar usuario y enviar Magic Link
    const { data: authData, error: authError } =
      await supabase.auth.admin.inviteUserByEmail(email);

    if (authError) {
      console.error("Error al crear usuario:", authError);
      alert("❌ No se pudo invitar al usuario.");
      return;
    }

    const userId = authData.user.id;

    // 2. Insertar en tabla 'users'
    const { error: insertError } = await supabase.from("users").insert({
      id: userId,
      email,
      full_name,
      role: role_id,
      sede_id,
      company_id,
    });

    if (insertError) {
      console.error("Error al insertar en tabla users:", insertError);
      alert("❌ Usuario creado en auth pero no se pudo guardar perfil.");
      return;
    }

    alert("✅ Usuario invitado correctamente.");
  };

  return (
    <div className="p-6 space-y-2">
      <h1 className="text-2xl font-bold">
        Vista General y administración de usuarios
      </h1>
      {/* <h1 className="text-2xl font-bold">Hola, {user.full_name} 👋</h1> */}
      <p>Rol: {user.role}</p>
      <p>Sede: {user.company_id}</p>
      {/* <p>Accesos: {profile.access.join(", ")}</p> */}
    </div>
  );
}
