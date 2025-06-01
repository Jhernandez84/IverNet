import { useState, useMemo, Dispatch, SetStateAction } from "react";
import useFinanzas from "../../hooks/useFinanzas";
import Chart from "react-apexcharts";

type ResumenPorSede = {
  sede: string;
  tipo: string;
  total: number;
};

interface chartRender {
  showData: boolean;
}

export default function PieChart({ showData }: chartRender) {
  const [refresh, setRefresh] = useState(0);

  const [filtros, setFiltros] = useState({
    fechaDesde: undefined,
    fechaHasta: undefined,
    sedeId: undefined,
    tipo: undefined,
    estado: undefined,
    medioPago: undefined,
  });

  // hook que siempre devuelve un objeto (mejor que pueda devolver null)
  const finanzas = useFinanzas({ refresh, setRefresh, filtros }) ?? {
    movimientos: [],
    loadingFinanceData: true,
  };

  const { movimientos, loadingFinanceData } = finanzas;

  // === 1. Construimos un arreglo "resumen" con: { sede, tipo, total } ===
  const resumen: ResumenPorSede[] = useMemo(() => {
    const result: ResumenPorSede[] = [];

    movimientos.forEach((mov) => {
      const existing = result.find(
        (r) => r.sede === mov.sede && r.tipo === mov.tipo
      );
      if (existing) {
        existing.total += mov.monto;
      } else {
        result.push({
          sede: mov.sede,
          tipo: mov.tipo,
          total: mov.monto,
        });
      }
    });

    return result;
  }, [movimientos]);

  // === 2. Datos para pie chart: totales acumulados POR SEDE ===
  //    Labels = sedes únicas
  //    Series = suma de todos los "total" correspondientes a cada sede
  const pieData = useMemo(() => {
    // obtenemos listado de sedes únicas
    const sedesUnicas = Array.from(new Set(resumen.map((r) => r.sede)));

    // para cada sede, sumamos todos los valores de "total" (independiente del tipo)
    const series = sedesUnicas.map((sede) => {
      // filtramos resumen para esa sede y sumamos
      const totalPorSede = resumen
        .filter((r) => r.sede === sede)
        .reduce((acc, curr) => acc + curr.total, 0);
      return totalPorSede;
    });

    return {
      labels: sedesUnicas,
      series,
    };
  }, [resumen]);

  return (
    <div className="mt-4">
      {loadingFinanceData ? (
        <div className="text-gray-500">Cargando datos...</div>
      ) : (
        <>
          {showData ? (
            <>
              <h2 className="text-lg font-bold mb-2">
                Resumen por Sede y Tipo (tabla)
              </h2>
              <table className="table-auto w-full text-sm">
                <thead className="bg-gray-800 text-white">
                  <tr>
                    <th className="p-2">Sede</th>
                    <th className="p-2">Tipo</th>
                    <th className="p-2">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {resumen.map((r, idx) => (
                    <tr key={idx} className="border-t">
                      <td className="p-2">{r.sede}</td>
                      <td className="p-2">{r.tipo}</td>
                      <td className="p-2">${r.total.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          ) : (
            <>
              <h2 className="text-lg font-bold mb-2">
                Distribución del total por Sede (pie chart)
              </h2>
              <Chart
                type="pie"
                height={300}
                options={{
                  labels: pieData.labels,
                  legend: {
                    position: "bottom",
                  },
                  tooltip: {
                    y: {
                      formatter: (val: number) => `$${val.toLocaleString()}`,
                    },
                  },
                  dataLabels: {
                    formatter: (val: number, opts) => {
                      // Opcional: mostrar porcentaje junto con el valor
                      const idx = opts.seriesIndex;
                      const nombreSede = pieData.labels[idx];
                      return `${nombreSede}: ${val.toFixed(1)}%`;
                    },
                  },
                }}
                series={pieData.series}
              />
            </>
          )}
        </>
      )}
    </div>
  );
}
