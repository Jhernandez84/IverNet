"use client";

import { useState } from "react";
import FinanzasForm from "./components/FinanzasForm";
import FinanzasTable from "./components/FinanzasTable";
import { useUserSession } from "@/hooks/useUserSession";
import ChartTable from "./components/Charts/Chart";
import ResumenFinancieroPorSede from "./components/Charts/ChartSummary";
import PieChart from "./components/Charts/PieChart";
import { CogIcon, DocumentIcon } from "@heroicons/react/24/solid";

export default function FinanzasDashboard() {
  const [refreshTrigger, setRefreshTrigger] = useState(0); // ✅ contador de refresco
  const [showForm, setShowForm] = useState(false);

  const { user, loading } = useUserSession();

  if (loading || !user) return <p className="p-4">Cargando...</p>;

  return (
    <div className="p-2 space-y-2 h-[80vh]">
      <div className="bg-gray-800 shadow rounded">
        <select
          name=""
          id=""
          className="rounded bg-gray-900 text-sm text-white m-2 border-none"
        >
          <option value="">Este mes</option>
          <option value="">Esta semana</option>
          <option value="">Este año</option>
          <option value="">Rango de fecha</option>
          <option value="">Hoy</option>
        </select>
        <input
          type="date"
          className="rounded bg-gray-900 text-sm text-white m-2 border-none"
        />
        <input
          type="date"
          className="rounded bg-gray-900 text-sm text-white m-2 border-none"
        />

        <select
          name=""
          id=""
          className="rounded bg-gray-900 text-sm text-white m-2 border-none"
        >
          <option value="" selected>
            Tipo movimiento
          </option>
          <option value="">Ingresos</option>
          <option value="">Egresos</option>
          <option value="">Traspasos</option>
        </select>

        <select
          name=""
          id=""
          className="rounded bg-gray-900 text-sm text-white m-2 border-none"
        >
          <option value="" selected>
            Clasificación
          </option>
          <option value="">Ingresos</option>
          <option value="">Egresos</option>
          <option value="">Traspasos</option>
        </select>

        <select
          name=""
          id=""
          className="rounded bg-gray-900 text-sm text-white m-2 border-none"
        >
          <option value="" selected>
            Estado del movimiento
          </option>
          <option value="">Ingresado</option>
          <option value="">En Revisión</option>
          <option value="">Confirmado</option>
        </select>
        <select
          name=""
          id=""
          className="rounded bg-gray-900 text-sm text-white m-2 border-none"
        >
          <option value="" selected>
            Medio de pago
          </option>
          <option value="">Efectivo</option>
          <option value="">Tranferencia</option>
          <option value="">Cosa</option>
        </select>
        <select
          name=""
          id=""
          className="rounded bg-gray-900 text-sm text-white m-2 border-none"
        >
          <option value="" selected>
            Sede
          </option>
          <option value="">Sede 1</option>
          <option value="">Sede 2</option>
          <option value="">Sede 3</option>
        </select>
        <select
          name=""
          id=""
          className="rounded bg-gray-900 text-sm text-white m-2 border-none"
        >
          <option value="" selected>
            Opciones
          </option>
          <option value="">
            <DocumentIcon aria-hidden="true" className="size-6" /> Reportes
          </option>
          <option value="">
            <CogIcon aria-hidden="true" className="size-6" />
          </option>
        </select>
      </div>
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
            <PieChart showData={false} />
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
