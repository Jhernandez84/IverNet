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

type Movimiento = {
  monto: number;
  tipo: "Ingreso" | "Egreso";
  sede_nombre: string;
  sede_id?: string; // Agregamos sede_id al tipo Movimiento
};

export default function GraficoPorSede({ companyId, sedeId, refresh }: Props) {
  const [chartData, setChartData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      let query = supabase
        .from("finanzas")
        .select("monto, tipo, sede_id, sedes(nombre)")
        .eq("company_id", companyId);

      if (sedeId) {
        query = query.eq("sede_id", sedeId); // Añade el filtro de sede_id si se proporciona
      }

      const { data, error: fetchError } = await query;

      console.log(data);

      if (fetchError) {
        setError(`Error al cargar datos: ${fetchError.message}`);
        return;
      }

      // Procesamiento de los datos
      const movimientos: Movimiento[] = data
        ? data.map((item: any) => ({
            monto: item.monto,
            tipo: item.tipo,
            sede_nombre: item.sedes?.nombre || "Sin sede",
            sede_id: item.sede_id,
          }))
        : [];

      const resumen: Record<
        string,
        { nombre: string; saldo: number; sede_id: number }
      > = {};

      for (const m of movimientos) {
        const nombreSede = m.sede_nombre;

        if (!resumen[nombreSede]) {
          resumen[nombreSede] = {
            nombre: nombreSede,
            saldo: 0,
            sede_id: m.sede_id,
          };
        }

        if (m.tipo === "Ingreso") {
          resumen[nombreSede].saldo += m.monto;
        } else if (m.tipo === "Egreso") {
          resumen[nombreSede].saldo -= m.monto;
        }
      }

      const labels = Object.values(resumen).map((r) => r.nombre);
      const saldos = Object.values(resumen).map((r) => r.saldo);

      useEffect(() => {
        fetchData();
      }, [refresh]);

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
    } catch (err: any) {
      setError(`Error inesperado: ${err.message || "Error desconocido"}`);
    } finally {
      setLoading(false);
    }
  };

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
