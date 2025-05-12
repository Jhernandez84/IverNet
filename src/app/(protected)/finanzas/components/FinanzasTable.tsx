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
  CircleStackIcon,
  CheckIcon,
} from "@heroicons/react/24/solid";

import useFinanzas from "../hooks/useFinanzas";

type FiltrosFinanzas = {
  dateView: string;
  fechaDesde?: string;
  fechaHasta?: string;
  sedeId?: string;
  tipo?: string;
  estado?: string;
  medioPago?: string;
};

export default function FinanzasForms() {
  const { user, loading } = useUserSession();
  // 1) refresh puede ser un contador o booleano para disparar recarga
  const [refresh, setRefresh] = useState(0);
  // 2) filtros según tu UI: aquí un ejemplo con fechas vacías
  const [filtros, setFiltros] = useState<FiltrosFinanzas>({
    dateView: "",
    fechaDesde: undefined,
    fechaHasta: undefined,
    sedeId: undefined,
    tipo: "",
    estado: "",
    medioPago: "",
  });
  const [searchValue, setSearchValue] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState("");
  const [editMonto, setEditMonto] = useState(0);

  // Llamas al hook pasándole lo anterior
  const resultado = useFinanzas({ refresh, setRefresh, filtros });

  // El hook retorna null mientras carga el user; espera hasta que no sea null
  if (!resultado) return <p>Cargando datos de finanzas…</p>;

  const { movimientos, loadingFinanceData } = resultado;

  if (loading || !user) return null;

  // const handleSort = (key: keyof Movimiento) => {
  //   setOrden((prev) =>
  //     prev.key === key ? { ...prev, asc: !prev.asc } : { key, asc: true }
  //   );
  // };

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
      setEditId("");
      setRefresh((prev) => prev + 1);
    } else {
      console.error("Error al editar:", error);
    }
  };

  const movimientosFiltrados = movimientos.filter((m) =>
    Object.values(m).some((v) =>
      String(v).toLowerCase().includes(searchValue.toLowerCase())
    )
  );

  const allowedRoles = [
    "d3fb021e-0424-4324-91fc-a112646684c7",
    "4617e16c-09f5-4e1d-bced-eef4819b33bc",
  ];

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
                  setRefresh((prev) => prev + 1); // ✅ fuerza refresh de tabla
                  setShowForm(false);
                }}
              />
            </div>
          </div>
        )}

        <div>
          {allowedRoles.includes(user?.role_id ?? "") && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white px-4 py-2 sm:mr-4 rounded hover:bg-blue-700"
            >
              + Agregar movimiento
            </button>
          )}
          <button
            onClick={() => setRefresh(1)}
            className="bg-green-600 text-white px-4 py-2 sm mr-4 rounded hover:bg-green-700"
          >
            Actualizar
          </button>
          <input
            type="text"
            placeholder="Buscar..."
            className="border px-2 py-1 rounded"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto text-sm text-gray-800">
          <thead className="bg-gray-100 text-left">
            <tr>
              {[
                "Fecha",
                "Tipo Mov.",
                "Categoría del mov.",
                "Clasificación del mov.",
                "N. Documento",
                "Medio de pago",
                "Monto",
                "Sede",
                "Estado",
              ].map((key) => (
                <th
                  key={key}
                  className="p-2 cursor-pointer select-none"
                  // onClick={() => handleSort(key as keyof Movimiento)}
                >
                  {key}
                  {/* {orden.key === key && ( */}
                  <span className="inline-block ml-1 w-3 h-3">
                    {/* {orden.asc ? <ArrowUpIcon /> : <ArrowDownIcon />} */}
                  </span>
                  {/* )} */}
                </th>
              ))}
              <th className="p-2 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {movimientosFiltrados.map((m) => (
              <tr key={m.id} className="border-t">
                <td className="p-2">{m.fecha}</td>
                <td className="p-2">{m.tipo}</td>
                <td className="p-2">{m.mov_grupo}</td>
                <td className="p-2">{m.tipo_mov}</td>
                <td className="p-2">{m.num_doc}</td>
                <td className="p-2">{m.metodo_pago}</td>
                <td className="p-2 cursor-pointer">
                  {editId === m.id ? (
                    <input
                      type="number"
                      value={editMonto}
                      onChange={(e) => setEditMonto(Number(e.target.value))}
                      onBlur={() => handleEditSubmit()}
                      className="border rounded px-2 py-1 w-24"
                    ></input>
                  ) : (
                    <>{`$${m.monto.toLocaleString()}`}</>
                  )}
                </td>
                <td className="p-2">{m.sede}</td>
                <td className="p-2">{m.estado}</td>
                <td className="p-2 flex justify-evenly">
                  {editId === m.id ? (
                    <button
                      onClick={handleEditSubmit}
                      className="text-green-600 hover:underline"
                    >
                      <CheckIcon className="w-4 h-4 inline" />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEdit(m.id, m.monto)}
                      className="text-blue-600 hover:underline"
                    >
                      <PencilIcon className="w-4 h-4 inline" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(m.id)}
                    className="text-red-600 hover:underline"
                  >
                    <TrashIcon className="w-4 h-4 inline" />
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
