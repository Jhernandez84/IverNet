"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/utils/supabaseClients";
import { useUserSession } from "@/hooks/useUserSession";
import FinanzasForm from "./FinanzasForm";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";

type Movimiento = {
  id: string;
  fecha: string;
  tipo: string;
  metodo_pago: string;
  monto: number;
  estado: string;
  sede: string;
  responsable_id: string;
  company_id: string;
};

type FiltrosFinanzas = {
  fechaDesde?: string;
  fechaHasta?: string;
  sedeId?: string;
  tipo?: string;
  estado?: string;
  medioPago?: string;
};

type Props = {
  refresh: number;
  setRefresh: React.Dispatch<React.SetStateAction<number>>;
  filtros?: FiltrosFinanzas;
};

export default function FinanzasTable({ refresh, setRefresh, filtros }: Props) {
  const { user, loading } = useUserSession();

  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
  const [filtro, setFiltro] = useState("");
  const [orden, setOrden] = useState<{ key: keyof Movimiento; asc: boolean }>({
    key: "fecha",
    asc: false,
  });
  const [editId, setEditId] = useState<string | null>(null);
  const [editMonto, setEditMonto] = useState<number>(0);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showForm, setShowForm] = useState(false);

  const cargarMovimientos = async () => {
    let query = supabase.from("finanzas").select("*, sedes(nombre)");

    if (filtros?.fechaDesde) query = query.gte("fecha", filtros.fechaDesde);
    if (filtros?.fechaHasta) query = query.lte("fecha", filtros.fechaHasta);

    // Si el usuario está limitado por sede, forzar el filtro por sede
    if (user?.scopedBySede && user.sede_id) {
      query = query.eq("sede_id", user.sede_id);
    } else if (filtros?.sedeId) {
      query = query.eq("sede_id", filtros.sedeId);
    }

    if (filtros?.tipo) query = query.eq("tipo", filtros.tipo);
    if (filtros?.estado) query = query.eq("estado", filtros.estado);
    if (filtros?.medioPago) query = query.eq("metodo_pago", filtros.medioPago);

    query = query.order(orden.key, { ascending: orden.asc });

    const { data, error } = await query;
    // console.log(data);
    if (!error) {
      const movimientosConSede = (data || []).map((mov) => ({
        ...mov,
        sede: mov.sedes?.nombre || "—",
      }));

      setMovimientos(movimientosConSede);
    } else {
      console.error("Error al cargar movimientos:", error);
    }
  };

  useEffect(() => {
    if (!loading && user) cargarMovimientos();
  }, [orden, refresh, filtros, loading, user]);

  if (loading || !user) return null;

  const handleSort = (key: keyof Movimiento) => {
    setOrden((prev) =>
      prev.key === key ? { ...prev, asc: !prev.asc } : { key, asc: true }
    );
  };

  const handleDelete = async (id: string) => {
    const confirm = window.confirm(
      "¿Estás seguro de eliminar este movimiento?"
    );
    if (!confirm) return;

    const { error } = await supabase.from("finanzas").delete().eq("id", id);
    if (!error) {
      alert("✅ Movimiento eliminado");
      setRefresh((prev) => prev + 1);
    } else {
      console.error("Error al eliminar:", error);
    }
  };

  const handleEdit = (id: string, monto: number) => {
    setEditId(id);
    setEditMonto(monto);
  };

  const handleEditSubmit = async () => {
    const { error } = await supabase
      .from("finanzas")
      .update({ monto: editMonto })
      .eq("id", editId);

    if (!error) {
      alert("✅ Monto actualizado");
      setEditId(null);
      setRefresh((prev) => prev + 1);
    } else {
      console.error("Error al editar:", error);
    }
  };

  const movimientosFiltrados = movimientos.filter((m) =>
    Object.values(m).some((v) =>
      String(v).toLowerCase().includes(filtro.toLowerCase())
    )
  );

  return (
    <div className="bg-white rounded shadow p-4">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-lg font-bold text-gray-800">
          Movimientos Financieros
        </h2>
        {showForm && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
            <div className="bg-gray-700 rounded-lg shadow-lg w-full max-w-xl p-6 relative">
              <button
                onClick={() => setShowForm(false)}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl"
              >
                ×
              </button>

              <h3 className="text-xl font-bold mb-4 text-white">
                Registrar Movimiento
              </h3>
              <FinanzasForm
                userId={user.id}
                companyId={user.company_id}
                onSaved={() => {
                  setRefreshTrigger((prev) => prev + 1); // ✅ fuerza refresh de tabla
                  setShowForm(false);
                }}
              />
            </div>
          </div>
        )}

        <div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 sm mr-4 rounded hover:bg-blue-700"
          >
            + Agregar movimiento
          </button>
          <input
            type="text"
            placeholder="Buscar..."
            className="border px-2 py-1 rounded"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto text-sm text-gray-800">
          <thead className="bg-gray-100 text-left">
            <tr>
              {["fecha", "tipo", "metodo_pago", "monto", "estado", "sede"].map(
                (key) => (
                  <th
                    key={key}
                    className="p-2 cursor-pointer select-none"
                    onClick={() => handleSort(key as keyof Movimiento)}
                  >
                    {key.toUpperCase()}
                    {orden.key === key && (
                      <span className="inline-block ml-1 w-3 h-3">
                        {orden.asc ? <ArrowUpIcon /> : <ArrowDownIcon />}
                      </span>
                    )}
                  </th>
                )
              )}
              <th className="p-2 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {movimientosFiltrados.map((m) => (
              <tr key={m.id} className="border-t">
                <td className="p-2">{m.fecha}</td>
                <td className="p-2">{m.tipo}</td>
                <td className="p-2">{m.metodo_pago}</td>
                <td className="p-2">
                  {editId === m.id ? (
                    <input
                      type="number"
                      value={editMonto}
                      onChange={(e) => setEditMonto(Number(e.target.value))}
                      className="border rounded px-2 py-1 w-24"
                    />
                  ) : (
                    `$${m.monto.toLocaleString()}`
                  )}
                </td>
                <td className="p-2">{m.estado}</td>
                <td className="p-2">{m.sede}</td>
                <td className="p-2 flex gap-2">
                  {editId === m.id ? (
                    <button
                      onClick={handleEditSubmit}
                      className="text-green-600 hover:underline"
                    >
                      Guardar
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEdit(m.id, m.monto)}
                      className="text-blue-600 hover:underline"
                    >
                      <PencilIcon className="w-4 h-4 inline" /> Editar
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(m.id)}
                    className="text-red-600 hover:underline"
                  >
                    <TrashIcon className="w-4 h-4 inline" /> Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
