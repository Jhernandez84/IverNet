"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/utils/supabaseClients";
import { useUserSession } from "@/hooks/useUserSession";

type Movimiento = {
  id: string;
  tipo_movimiento: string;
  descripcion: string;
  tipo_mov_contable: string;
  tipo_mov_generico: string;
  tipo_mov_clase: string;
  activo: boolean;
};

export default function MantenedorMovimientos() {
  const { user, loading } = useUserSession();
  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
  const [form, setForm] = useState<Omit<Movimiento, "id">>({
    tipo_movimiento: "",
    descripcion: "",
    tipo_mov_contable: "",
    tipo_mov_generico: "",
    tipo_mov_clase: "",
    activo: true,
  });
  const [editId, setEditId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const cargarMovimientos = async () => {
    const { data, error } = await supabase
      .from("tipos_movimiento")
      .select("*")
      .eq("company_id", user?.company_id)
      .eq("activo", true)
      .order("tipo_movimiento");

    if (error) console.error("Error al cargar tipos:", error);
    else setMovimientos(data || []);
  };

  useEffect(() => {
    if (user?.company_id) {
      cargarMovimientos();
    }
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (
      !form.tipo_movimiento ||
      !form.tipo_mov_contable ||
      !form.tipo_mov_generico
    ) {
      setError("Todos los campos son requeridos.");
      return;
    }

    if (editId) {
      const { error } = await supabase
        .from("tipos_movimiento")
        .update({ ...form })
        .eq("id", editId);

      if (error) {
        setError("Error al actualizar el registro.");
        return;
      }
    } else {
      const { error } = await supabase.from("tipos_movimiento").insert({
        ...form,
        company_id: user?.company_id,
      });

      if (error) {
        setError("Error al insertar el registro.");
        return;
      }
    }

    setForm({
      tipo_movimiento: "",
      descripcion: "",
      tipo_mov_contable: "",
      tipo_mov_generico: "",
      tipo_mov_clase: "",
      activo: true,
    });
    setEditId(null);
    cargarMovimientos();
  };

  const handleEdit = (mov: Movimiento) => {
    setEditId(mov.id);
    setForm({ ...mov });
  };

  const toggleActivo = async (id: string, estado: boolean) => {
    const { error } = await supabase
      .from("tipos_movimiento")
      .update({ activo: !estado })
      .eq("id", id);

    if (!error) cargarMovimientos();
  };

  if (loading || !user) return <p className="p-6">Cargando...</p>;

  return (
    <div className="p-6 mx-auto space-y-6">
      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-gray-700 p-4 rounded shadow"
      >
        {error && <p className="text-red-600">{error}</p>}

        <div className="grid md:grid-cols-2 gap-4">
          <div className="grid grid-cols-2 md:grid-cols-2">
            <label className="block text-lg font-medium mb-1">
              Tipo de movimiento
            </label>
            <select
              name="tipo_movimiento"
              // value={form}
              required
              onChange={handleChange}
              className="w-full border rounded p-2 text-gray-800"
            >
              <option>Ingreso</option>
              <option>Egreso</option>
              <option>Traspaso</option>
            </select>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-2">
            <label className="block text-lg font-medium mb-1">
              Tipo de mov. contable
            </label>
            <select
              name="tipo_mov_contable"
              // value={form}
              required
              onChange={handleChange}
              className="w-full border rounded p-2 text-gray-800"
            >
              <option>Activo</option>
              <option>Pasivo</option>
              <option>Traspaso</option>
            </select>
          </div>
          <div>
            <input
              name="tipo_mov_generico"
              value={form.tipo_mov_generico}
              onChange={handleChange}
              placeholder="Ejemplo... por ventas del coffee"
              className="border p-2 rounded w-full text-gray-800"
              required
            />
          </div>
          <div>
            <input
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              placeholder="Descripción larga o más información del movimiento"
              className="border p-2 rounded w-full text-gray-800"
            />
          </div>
        </div>

        <div className="text-right">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {editId ? "Actualizar" : "Agregar"}
          </button>
        </div>
      </form>

      <div className="bg-gray-700 shadow rounded p-4 h-[60vh] text-white">
        <h3 className="text-lg font-bold mb-4">
          Vista tipos de movimientos registrados
        </h3>

        {/* Header table */}
        <table className="w-full text-sm table-auto">
          <thead>
            <tr className="bg-gray-800">
              <th className="p-2 text-left">Tipo Mov.</th>
              <th className="p-2">Mov. Contable</th>
              <th className="p-2">Categoría del Mov.</th>
              <th className="p-2">Estado Activo?</th>
              <th className="p-2">Acciones</th>
            </tr>
          </thead>
        </table>

        {/* Scrollable body */}
        <div className="h-[45vh] overflow-y-auto">
          <table className="w-full text-sm table-auto">
            <tbody>
              {movimientos.map((m) => (
                <tr key={m.id} className="border-t border-gray-600">
                  <td className="p-2 text-left">{m.tipo_movimiento}</td>
                  <td className="p-2 text-center">{m.tipo_mov_contable}</td>
                  <td className="p-2 text-center">{m.tipo_mov_generico}</td>
                  <td className="p-2 text-center">{m.activo ? "✅" : "❌"}</td>
                  <td className="p-2 text-center space-x-2">
                    <button
                      onClick={() => handleEdit(m)}
                      className="text-blue-300 hover:underline"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => toggleActivo(m.id, m.activo)}
                      className="text-yellow-300 hover:underline"
                    >
                      Cambiar estado
                    </button>
                  </td>
                </tr>
              ))}
              {movimientos.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center p-4">
                    No hay registros activos
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
