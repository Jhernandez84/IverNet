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

export default function ChartTable({ showData }: chartRender) {
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
  const finanzas = useFinanzas({ refresh, setRefresh }) ?? {
    movimientos: [],
    loadingFinanceData: true,
  };

  const { movimientos, loadingFinanceData } = finanzas;

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

  // === DATOS PARA APEXCHARTS ===
  const chartData = useMemo(() => {
    const tiposUnicos = Array.from(new Set(resumen.map((r) => r.tipo)));
    const sedesUnicas = Array.from(new Set(resumen.map((r) => r.sede)));

    const series = tiposUnicos.map((tipo) => {
      return {
        name: tipo,
        data: sedesUnicas.map((sede) => {
          const match = resumen.find((r) => r.sede === sede && r.tipo === tipo);
          return match ? match.total : 0;
        }),
      };
    });

    return { series, categories: sedesUnicas };
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
                Resumen por Sede y Tipo
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
            <Chart
              type="bar"
              height={200}
              options={{
                chart: {
                  type: "bar",
                  stacked: false,
                  toolbar: { show: false },
                },
                xaxis: {
                  categories: chartData.categories,
                },
                yaxis: {
                  labels: {
                    formatter: (val) => `$${val.toLocaleString()}`,
                  },
                },
                tooltip: {
                  y: {
                    formatter: (val) => `$${val.toLocaleString()}`,
                  },
                },
                legend: {
                  position: "right",
                },
                plotOptions: {
                  bar: {
                    horizontal: true,
                    columnWidth: "40%",
                  },
                },
              }}
              series={chartData.series}
            />
          )}
        </>
      )}
    </div>
  );
}
