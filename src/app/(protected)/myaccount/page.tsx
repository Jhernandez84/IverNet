"use client";

import { useUserSession } from "@/hooks/useUserSession";

export default function MyAccountPage() {
  const { user, loading } = useUserSession();

  if (loading) return <p className="p-6">Cargando...</p>;
  if (!user)
    return <p className="p-6 text-red-500">No se pudo cargar el perfil.</p>;

  return (
    <div className="p-6 space-y-2">
      <h1 className="text-2xl font-bold">Hola, {user.full_name} 👋</h1>
      <p>Rol: {user.role}</p>
      <p>User ID: {user?.id}</p>
      <p>Acceso principal: {user.access}</p>
      <p>Sede ID: {user?.sede_id}</p>

      {/* <p>Sede: {user.sede[0]</p> */}
      <p></p>
      {/* <p>Accesos: {profile.access.join(", ")}</p> */}
    </div>
  );
}
