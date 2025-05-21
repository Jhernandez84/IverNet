"use client";

import { useState } from "react";
import FinanzasForm from "./components/FinanzasForm";
import FinanzasTable from "./components/FinanzasTable";
import { useUserSession } from "@/hooks/useUserSession";
import ChartTable from "./components/Charts/Chart";
import ResumenFinancieroPorSede from "./components/Charts/ChartSummary";

export default function FinanzasDashboard() {
  const [refreshTrigger, setRefreshTrigger] = useState(0); // ✅ contador de refresco
  const [showForm, setShowForm] = useState(false);

  const { user, loading } = useUserSession();

  if (loading || !user) return <p className="p-4">Cargando...</p>;

  return (
    <div className="p-6 space-y-6 h-[90vh]">
      {/* Fila superior 30% de alto */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 h-[32%]">
        <div className="bg-gray-800 shadow rounded p-2 h-[95%x]">
          {/* <ResumenFinancieroPorSede showData={false} /> */}
        </div>
        <div className="bg-gray-800 shadow rounded p-2">
          <ChartTable showData={false} />
        </div>
        <div className="bg-gray-800 shadow rounded p-2">
          <ChartTable showData={false} />
        </div>
      </div>

      {/* Fila inferior 70% de alto */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 h-[70%]">
        {/* Columna izquierda (40%) */}
        <div className="md:col-span-2 bg-gray-800 shadow rounded p-4 overflow-auto">
          {/* Componente futuro: resumen por sede */}
          <ResumenFinancieroPorSede showData={true} />
        </div>
        {/* Columna derecha (60%) */}
        <div className="md:col-span-3 bg-gray-800 shadow rounded p-4 overflow-auto">
          {/* <h2 className="text-lg font-semibold">Últimos movimientos</h2> */}
          <div className="h-[20%]">
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              + Agregar movimiento
            </button>
          </div>
          {/* Acceso a formulario para agregar movimientos */}
          <div className="h-[80%]">
            <ResumenFinancieroPorSede showData={false} />
          </div>

          {/* Modal del formulario */}
          {showForm && (
            <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center ">
              <div className="bg-gray-700 rounded-lg shadow-lg w-full max-w-xl p-6 relative w-[50vw]">
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
        </div>
      </div>
    </div>
  );
}
