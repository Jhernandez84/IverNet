"use client";

import { useUserSession } from "@/hooks/useUserSession";
import Image from "next/image";

export default function MyAccountPage() {
  const { user, loading } = useUserSession();

  if (loading) return <div className="p-6">Cargando la sesión...</div>;
  if (!user) return <div className="p-6">No hay sesión activa</div>;

  return (
    <div className="p-6 space-y-2">
      <h1 className="text-2xl font-bold">Hola, {user.full_name} 👋</h1>
      <p>Rol: {user.role}</p>
      <p>Correo: {user.email}</p>
      <p>User ID: {user.id}</p>
      <p>Sede ID: {user.sede_id}</p>
      <p>Accesos: {user.access.join(", ")}</p>
    </div>
  );
}
