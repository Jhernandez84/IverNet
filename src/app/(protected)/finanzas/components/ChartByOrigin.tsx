"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/utils/supabaseClients";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

type Props = {
  companyId: string;
  sedeId: string;
  refresh: number;
};

type Sede = {
  nombre: string;
};

type Movimiento = {
  monto: number;
  tipo: "Ingreso" | "Egreso";
  sedes?: Sede;
};

export default function GraficoPorSede({ companyId, sedeId, refresh }: Props) {
  const [chartData, setChartData] = useState<any>(null);

  const fetchData = async () => {
    let query = supabase
      .from("finanzas")
      .select("monto, tipo, sedes!sede_id(nombre)")
      .eq("company_id", companyId);

    if (sedeId) {
      query = query.eq("sede_id", sedeId);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error al cargar datos", error);
      return;
    }

    const movimientos = data as Movimiento[];
    const resumen: Record<string, { nombre: string; saldo: number }> = {};

    for (const m of movimientos) {
      const nombreSede = m.sedes?.nombre || "Sin sede";

      if (!resumen[nombreSede]) {
        resumen[nombreSede] = { nombre: nombreSede, saldo: 0 };
      }

      if (m.tipo === "Ingreso") {
        resumen[nombreSede].saldo += m.monto;
      } else if (m.tipo === "Egreso") {
        resumen[nombreSede].saldo -= m.monto;
      }
    }

    const labels = Object.values(resumen).map((r) => r.nombre);
    const saldos = Object.values(resumen).map((r) => r.saldo);

    setChartData({
      labels,
      datasets: [
        {
          label: "Saldo",
          data: saldos,
          backgroundColor: "#60a5fa",
        },
      ],
    });
  };

  useEffect(() => {
    fetchData();
  }, [companyId, sedeId, refresh]);

  if (!chartData)
    return <p className="text-sm text-gray-500">Cargando gráfico...</p>;

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Saldos por sede</h3>
      <Bar
        data={chartData}
        height="100%"
        options={{
          responsive: true,
          plugins: {
            legend: { display: false },
          },
          scales: {
            y: { beginAtZero: true },
          },
        }}
      />
    </div>
  );
}
