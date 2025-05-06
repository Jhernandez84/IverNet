"use client";

// src/app/dashboard/page.tsx
import NuevoUsuarioForm from "./components/createNewUserForm";
import { useUserSession } from "@/hooks/useUserSession";

export default function AdminPage() {
  const { user, loading } = useUserSession();

  if (loading || !user) return <p className="p-4">Cargando sesión...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Panel Principal (Admin)</h1>
      <NuevoUsuarioForm
        companyId={user.company_id}
        onCreated={() => {
          alert("Usuario creado ✅");
        }}
      />
    </div>
  );
}
