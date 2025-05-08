"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/utils/supabaseClients";
// import {v4 as uuidv4} from uuidv4

export default function CrearUsuarioForm() {
  const [form, setForm] = useState({
    user_id: "",
    company_id: "",
    full_name: "",
    email: "",
    role: "",
    role_id: "",
    sede_id: "",
  });

  const [status, setStatus] = useState<string | null>(null);
  const [sedes, setSedes] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: sedesData } = await supabase
        .from("sedes")
        .select("id, nombre");
      const { data: rolesData } = await supabase
        .from("roles")
        .select("id, nombre");
      if (sedesData) setSedes(sedesData);
      if (rolesData) setRoles(rolesData);
    };
    fetchData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = form.user_id;
    const menu_item_id = "c9f078a0-bd1d-4e73-ba5d-05119b8a35a3";

    const { error: userError } = await supabase.from("user").insert([
      {
        id,
        company_id: form.company_id,
        full_name: form.full_name,
        email: form.email,
        role: form.role,
        role_id: form.role_id,
        sede_id: form.sede_id,
        active: true,
      },
    ]);

    if (userError) {
      setStatus("Error creando usuario: " + userError.message);
      return;
    }

    const { error: accessError } = await supabase.from("user_access").insert([
      {
        user_id: id,
        menu_item_id,
      },
    ]);

    if (accessError) {
      await supabase.from("user").delete().eq("id", id);
      setStatus("Error asignando acceso: " + accessError.message);
      return;
    }

    setStatus("Usuario creado exitosamente.");
    setForm({
      user_id: "",
      company_id: "",
      full_name: "",
      email: "",
      role: "",
      role_id: "",
      sede_id: "",
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 text-gray-800 w-[50%] p-4"
    >
      <input
        name="user_id"
        value={form.user_id}
        onChange={handleChange}
        placeholder="user ID"
        className="border p-2 w-full"
      />
      <input
        name="company_id"
        value={form.company_id}
        onChange={handleChange}
        placeholder="Company ID"
        className="border p-2 w-full"
      />
      <input
        name="full_name"
        value={form.full_name}
        onChange={handleChange}
        placeholder="Full Name"
        className="border p-2 w-full"
      />
      <input
        name="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Email"
        className="border p-2 w-full"
      />
      <input
        name="role"
        value={form.role}
        onChange={handleChange}
        placeholder="Role"
        className="border p-2 w-full"
      />

      <select
        name="role_id"
        value={form.role_id}
        onChange={handleChange}
        className="border p-2 w-full"
      >
        <option value="">Selecciona un rol</option>
        {roles.map((r) => (
          <option key={r.id} value={r.id}>
            {r.nombre}
          </option>
        ))}
      </select>

      <select
        name="sede_id"
        value={form.sede_id}
        onChange={handleChange}
        className="border p-2 w-full"
      >
        <option value="">Selecciona una sede</option>
        {sedes.map((s) => (
          <option key={s.id} value={s.id}>
            {s.nombre}
          </option>
        ))}
      </select>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Crear Usuario
      </button>
      {status && <p className="text-sm text-gray-600">{status}</p>}
    </form>
  );
}
