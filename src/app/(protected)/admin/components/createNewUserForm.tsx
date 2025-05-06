"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/app/utils/supabaseClients";

export default function NuevoUsuarioForm({
  companyId,
  onCreated,
}: {
  companyId: string;
  onCreated?: () => void;
}) {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    role_id: "",
    sede_id: "",
  });

  const [roles, setRoles] = useState<any[]>([]);
  const [sedes, setSedes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Cargar roles
    supabase
      .from("roles")
      .select("*")
      .then(({ data }) => setRoles(data || []));

    // Cargar sedes por empresa
    supabase
      .from("sedes")
      .select("*")
      .eq("company_id", companyId)
      .then(({ data }) => setSedes(data || []));
  }, [companyId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/create-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          company_id: companyId,
        }),
      });

      const json = await res.json();

      if (!res.ok) throw new Error(json.error || "Error al crear usuario");

      alert("✅ Usuario creado correctamente");
      setForm({ full_name: "", email: "", role_id: "", sede_id: "" });
      onCreated?.();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-red-600">{error}</p>}

      <div>
        <label className="block text-sm font-medium mb-1">
          Nombre completo
        </label>
        <input
          type="text"
          name="full_name"
          required
          value={form.full_name}
          onChange={handleChange}
          className="w-full border rounded p-2 text-gray-800"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          type="email"
          name="email"
          required
          value={form.email}
          onChange={handleChange}
          className="w-full border rounded p-2 text-gray-800"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Rol</label>
        <select
          name="role_id"
          value={form.role_id}
          onChange={handleChange}
          className="w-full border rounded p-2 text-gray-800"
        >
          <option value="">Seleccione</option>
          {roles.map((r) => (
            <option key={r.id} value={r.id}>
              {r.nombre}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Sede</label>
        <select
          name="sede_id"
          value={form.sede_id}
          onChange={handleChange}
          className="w-full border rounded p-2 text-gray-800"
        >
          <option value="">Seleccione</option>
          {sedes.map((s) => (
            <option key={s.id} value={s.id}>
              {s.nombre}
            </option>
          ))}
        </select>
      </div>

      <div className="text-right">
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Creando..." : "Crear e Invitar"}
        </button>
      </div>
    </form>
  );
}
