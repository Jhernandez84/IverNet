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

export default function GraficoPorSede({ companyId, sedeId, refresh }: Props) {
  const [chartData, setChartData] = useState<any>(null);

  const fetchData = async () => {
    let query = supabase
      .from("finanzas")
      .select("monto, tipo, sedes(nombre)")
      .eq("company_id", companyId);

    if (sedeId) {
      query = query.eq("sede_id", sedeId);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error al cargar datos", error);
      return;
    }

    const movimientos = (data || []).map((mov) => ({
      ...mov,
      sede: mov.sedes?.nombre || "Sin sede", // aplanar
    }));

    const resumen: Record<string, { nombre: string; saldo: number }> = {};

    for (const m of movimientos) {
      const sede = m.sede;

      if (!resumen[sede]) {
        resumen[sede] = { nombre: sede, saldo: 0 };
      }

      if (m.tipo === "Ingreso") resumen[sede].saldo += m.monto;
      else if (m.tipo === "Egreso") resumen[sede].saldo -= m.monto;
    }

    const labels = Object.values(resumen).map((r) => r.nombre);
    const saldos = Object.values(resumen).map((r) => r.saldo);

    setChartData({
      labels,
      datasets: [
        //   {
        //     label: "Ingresos",
        //     data: ingresos,
        //     backgroundColor: "#4ade80",
        //   },
        //   {
        //     label: "Egresos",
        //     data: egresos,
        //     backgroundColor: "#f87171",
        //   },
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
  }, [companyId, refresh]);

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
            // legend: { position: "bottom" },
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
