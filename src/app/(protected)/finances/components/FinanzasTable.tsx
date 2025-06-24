"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/utils/supabaseClients";
import { useUserSession } from "@/hooks/useUserSession";
import { useFilters } from "../context/financeContext";
import FinanzasForm from "./FinanzasForm";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  PencilIcon,
  TrashIcon,
  DocumentChartBarIcon,
  CheckIcon,
} from "@heroicons/react/24/solid";

import useFinanzas from "../hooks/useFinanzas";

export default function FinanzasTable() {
  const { filters, setFilters } = useFilters();

  const STORAGE_KEY = "finance_filters";
  const [filterState, setFiltersState] = useState(STORAGE_KEY);

  const { user, loading } = useUserSession();
  // 1) refresh puede ser un contador o booleano para disparar recarga
  const [refresh, setRefresh] = useState(0);
  // 2) filtros según tu UI: aquí un ejemplo con fechas vacías

  const [searchValue, setSearchValue] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [showFormReport, setShowFormReport] = useState(false);
  const [editId, setEditId] = useState("");
  const [editMonto, setEditMonto] = useState(0);

  const [mes, setMes] = useState<number | null>(null);
  const [anio, setAnio] = useState<number | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setFiltersState(JSON.parse(stored));
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, [filters]);

  // Llamas al hook pasándole lo anterior
  const resultado = useFinanzas({ refresh, setRefresh });

  // El hook retorna null mientras carga el user; espera hasta que no sea null
  if (!resultado) return <p>Cargando datos de finanzas…</p>;

  const { movimientos, loadingFinanceData } = resultado;

  if (loading || !user) return null;

  // const handleSort = (key: keyof Movimiento) => {
  //   setOrden((prev) =>
  //     prev.key === key ? { ...prev, asc: !prev.asc } : { key, asc: true }
  //   );
  // };

  const handleChangeMesAnio = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value; // formato: "2025-06"
    if (value) {
      const [year, month] = value.split("-");
      setAnio(Number(year));
      setMes(Number(month));
    }
    console.log(mes, anio);
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
      setEditId("");
      setRefresh((prev) => prev + 1);
    } else {
      console.error("Error al editar:", error);
    }
  };

  const cierraMes = async () => {
    let selectedSede = null;

    if (user?.scopedBySede === false) {
      selectedSede = filters?.filterBranch;
    } else {
      selectedSede = user?.sede_id;
    }

    const { data, error } = await supabase.rpc("confirmar_movimientos_mes", {
      p_mes: mes,
      p_anio: anio,
      p_company_id: user?.company_id,
      p_sede_id: selectedSede,
    });

    if (error) {
      console.error("Error al confirmar movimientos:", error.message);
    } else {
      // alert("Estado de los movimientos cambiados para el ", mes & anio);
      console.log(`Movimientos confirmados: ${data}`); // cantidad de filas actualizadas
      setShowFormReport(false);
      setRefresh((prev) => prev + 1);
    }
  };

  const allowedRoles = [
    "d3fb021e-0424-4324-91fc-a112646684c7",
    "4617e16c-09f5-4e1d-bced-eef4819b33bc",
  ];

  return (
    <div className="bg-gray-800 rounded shadow p-4">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-lg font-bold text-white">
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

        {showFormReport && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
            <div className="bg-gray-700 rounded-lg shadow-lg w-full max-w-xl p-6 relative">
              <button
                onClick={() => setShowFormReport(false)}
                className="absolute top-2 right-2 text-gray-200 hover:text-red-700 text-xl p-4"
              >
                ×
              </button>

              <h3 className="text-xl font-bold mb-4 text-white">
                Generar cierre mensual
              </h3>
              <div className="grid grid-cols-2 text-gray-700">
                <input
                  type="month"
                  name="mesAnio"
                  value={`${anio?.toString() || ""}-${
                    mes?.toString().padStart(2, "0") || ""
                  }`}
                  onChange={handleChangeMesAnio}
                  className="border p-2 rounded"
                />
                <button
                  onClick={() => cierraMes()}
                  className="bg-yellow-600 text-white px-4 py-2 sm mr-4 rounded hover:bg-yellow-500"
                >
                  Generar proceso de cierre
                </button>
              </div>
            </div>
          </div>
        )}

        <div>
          {allowedRoles.includes(user?.role_id ?? "") && (
            <>
              <button
                onClick={() => setShowForm(true)}
                className="bg-blue-600 text-white text-sm px-4 py-2 sm:mr-4 rounded hover:bg-blue-700"
              >
                + Agregar movimiento
              </button>
              <button
                onClick={() => setShowFormReport(true)}
                className="bg-yellow-600 text-white text-sm px-4 py-2 sm mr-4 rounded hover:bg-yellow-700"
              >
                Generar cierre de mes
              </button>
            </>
          )}
          <button
            onClick={() => setRefresh((prev) => prev + 1)}
            className="bg-green-600 text-white text-sm px-4 py-2 sm mr-4 rounded hover:bg-green-700"
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

      <div>
        <table className="w-full table-auto text-sm text-gray-800 border-collapse">
          <thead className="bg-gray-900 text-left text-white">
            <tr>
              <th className="p-2 w-[8%]">Fecha</th>
              <th className="p-2 w-[6%]">Tipo</th>
              <th className="p-2 w-[13%]">Grupo</th>
              <th className="p-2 w-[15%]">Tipo Mov.</th>
              <th className="p-2 w-[8%]">N° Doc</th>
              <th className="p-2 w-[10%]">Método de Pago</th>
              <th className="p-2 w-[10%]">Monto</th>
              <th className="p-2 w-[13%]">Sede</th>
              <th className="p-2 w-[10%]">Estado</th>
              <th className="p-2 w-[12%] text-center">Acciones</th>
            </tr>
          </thead>
        </table>

        <div className="overflow-y-auto max-h-[60vh]">
          <table className="table-auto w-full text-gray-800 text-sm border-collapse">
            <tbody>
              {movimientos.map((m) => (
                <tr key={m.id} className="border-t p-2 text-white">
                  <td className="p-2 w-[8%]">{m.fecha}</td>
                  <td className="w-[6%]">{m.tipo}</td>
                  <td className="w-[13%]">{m.mov_grupo}</td>
                  <td
                    className="w-[15%] cursor-pointer"
                    onClick={() => alert(m.observaciones)}
                  >
                    {m.tipo_mov} {" "} ℹ️
                  </td>
                  <td className="w-[8%]">{m.num_doc}</td>
                  <td className="w-[10%]">{m.metodo_pago}</td>
                  <td className="w-[10%] cursor-pointer">
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
                  <td className="w-[13%]">{m.sede}</td>
                  <td className="w-[10%]">{m.estado}</td>
                  <td className="w-[12%]">
                    <div className="flex justify-evenly items-center">
                      {allowedRoles.includes(user?.role_id ?? "") &&
                      m.estado === "Ingresado" ? (
                        <>
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
                        </>
                      ) : (
                        <p className="text-center text-sm text-gray-500 italic">
                          No aplica
                        </p>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
