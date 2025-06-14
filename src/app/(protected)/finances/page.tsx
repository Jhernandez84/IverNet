"use client";

import { useState } from "react";
import FinanzasForm from "./components/FinanzasForm";
import FinanzasTable from "./components/FinanzasTable";
import { useUserSession } from "@/hooks/useUserSession";
import ChartTable from "./components/Charts/Chart";
import ResumenFinancieroPorSede from "./components/Charts/ChartSummary";
import MonthlyReport from "./components/monthlyReport";
import FinanceFilters from "./components/FinanceFilters";

import PieChart from "./components/Charts/PieChart";
import { CogIcon, DocumentIcon } from "@heroicons/react/24/solid";

export default function FinanzasDashboard() {
  const [refreshTrigger, setRefreshTrigger] = useState(0); // ✅ contador de refresco
  const [showForm, setShowForm] = useState(false);

  const { user, loading } = useUserSession();

  if (loading || !user) return <p className="p-4">Cargando...</p>;

  return (
    <div className="p-2 space-y-2 h-[100%] bg-gray-900">
      <FinanceFilters />

      <div className="grid grid-cols-[40%_60%] gap-2">
        <div className="grid grid-rows-[40%_60%] h-[82vh] gap-2">
          <div className="bg-gray-800 shadow rounded p-2">
            <ChartTable showData={false} />
          </div>
          <div className="bg-gray-800 shadow rounded p-2">
            <ResumenFinancieroPorSede showData={true} />
          </div>
        </div>
        <div className="bg-gray-800 shadow rounded p-2 w-[99%] h-[82vh]">
          <div className="h-[10%]">
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              + Agregar movimiento
            </button>
          </div>
          <div className="h-[90%]">
            {/* <ResumenFinancieroPorSede showData={false} /> */}
            <MonthlyReport />
            {/* <PieChart showData={false} /> */}
          </div>
        </div>
      </div>
      {/* Modal para el ingreso de más movimientos */}
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
  );
}
