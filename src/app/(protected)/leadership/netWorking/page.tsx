// CRUD simple en React + TailwindCSS para la tabla `church_members`
// Este ejemplo asume que usas Supabase Client ya configurado
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/utils/supabaseClients";
import { getDate } from "date-fns";

type Member = {
  id: string;
  first_name: string;
  last_name: string;
  second_last_name: string;
  email: string | null;
  phone: string | null;
  rut: string | null;
  birth_date: Date | null;
  death_date: Date | null;
  gender: string | null;
  registration_date: Date | null;
  church_role: string | null;
  family_group_id: string | null;
  user_id: string | null;
  status: string | null;
  notes: string | null;
};

export default function ChurchMembers() {
  const [showModal, setShowModal] = useState(false);

  const [members, setMembers] = useState<Member[]>([]);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    second_last_name: "",
    email: "",
    phone: "",
    rut: "",
    birth_date: "",
    death_date: null,
    gender: "",
    registration_date: null,
    record_entered_by: "",
    church_role: "",
    family_group_id: "501ac8ea-a218-44d6-b047-270675b7b356",
    status: "Activo",
    notes: "",
  });
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    const fetchMembers = async () => {
      const { data, error } = await supabase
        .from("church_members")
        .select("*")
        .order("last_name", { ascending: true });

      if (!error) setMembers(data);
    };
    fetchMembers();
  }, [refresh]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    console.log(form);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const { error } = await supabase.from("church_members").insert([form]);
    if (!error) {
      setForm({
        first_name: "",
        last_name: "",
        second_last_name: "",
        email: "",
        phone: "",
        rut: "",
        birth_date: "",
        death_date: null,
        gender: "",
        registration_date: null,
        record_entered_by: "",
        church_role: "",
        family_group_id: "",
        status: "Active",
        notes: "",
      });
      setRefresh((prev) => prev + 1);
    } else {
      console.error("Error al cargar movimientos:", error);
    }
  };

  return (
    <>
      <div className="p-6">
        {showModal && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center ">
            <div className="bg-gray-700 rounded-lg shadow-lg w-full max-w-xl p-6 relative w-[50vw]">
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl"
              >
                ×
              </button>
              <div className="p-4">
                <h2 className="text-xl  font-bold mb-4">
                  Registro de Miembros
                </h2>

                <form
                  onSubmit={handleSubmit}
                  className="grid grid-cols-2 gap-4 mb-6 text-gray-900"
                >
                  <input
                    name="first_name"
                    value={form.first_name}
                    onChange={handleChange}
                    placeholder="Nombres"
                    className="border p-2 rounded"
                    required
                  />
                  <input
                    name="last_name"
                    value={form.last_name}
                    onChange={handleChange}
                    placeholder="Apellido Materno"
                    className="border p-2 rounded"
                    required
                  />
                  <input
                    name="second_last_name"
                    value={form.last_name}
                    onChange={handleChange}
                    placeholder="Apellido Paterno"
                    className="border p-2 rounded"
                    required
                  />
                  <input
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Correo"
                    className="border p-2 rounded"
                  />
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Teléfono"
                    className="border p-2 rounded"
                  />
                  <input
                    name="rut"
                    value={form.rut}
                    onChange={handleChange}
                    placeholder="12345678"
                    className="border p-2 rounded"
                  />
                  <input
                    name="birth_date"
                    type="date"
                    value={form.birth_date}
                    onChange={handleChange}
                    className="border p-2 rounded"
                  />
                  <select
                    name="gender"
                    value={form.gender}
                    onChange={handleChange}
                    className="border p-2 rounded"
                  >
                    <option value="">Género</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Femenino">Femenino</option>
                  </select>
                  <input
                    name="church_role"
                    value={form.church_role}
                    onChange={handleChange}
                    placeholder="Rol en la iglesia"
                    className="border p-2 rounded"
                  />
                  <input
                    name="family_group_id"
                    value={form.family_group_id}
                    onChange={handleChange}
                    placeholder="ID Grupo Familiar (opcional)"
                    className="border p-2 rounded col-span-2"
                  />

                  <button
                    type="submit"
                    className="bg-blue-600 text-white py-2 px-4 rounded col-span-2"
                  >
                    Agregar miembro
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        <p>
          Esta página mostrará los hermanos bajo un trabajo de Red y los líderes
          y sus grupos
        </p>
        <div className="flex justify-between p-4">
          <h3 className="text-lg font-semibold mb-2">Listado de miembros</h3>
          <button
            type="button"
            className="bg-blue-600 text-white py-2 px-8 rounded col-span-2 h-8 text-sm"
            onClick={() => setShowModal(true)}
          >
            Agregar miembro
          </button>
        </div>

        <div className="overflow-auto max-h-[400px]">
          <table className="w-full table-auto text-sm">
            <thead className="bg-gray-700 text-white rounded">
              <tr>
                <th className="p-2">Nombre</th>
                <th className="p-2">Correo</th>
                <th className="p-2">Teléfono</th>
                <th className="p-2">Rol</th>
              </tr>
            </thead>
            <tbody>
              {members.map((m) => (
                <tr key={m.id} className="border-t">
                  <td className="p-2">
                    {m.first_name} {m.last_name} {m.second_last_name}
                  </td>
                  <td className="p-2">{m.email}</td>
                  <td className="p-2">{m.phone}</td>
                  <td className="p-2">{m.church_role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
