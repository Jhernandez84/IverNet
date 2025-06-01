import { useMemo, useState } from "react";
import Chart from "react-apexcharts";
import useFinanzas from "../../hooks/useFinanzas";
interface chartRender {
  showData: boolean;
}

export default function ResumenFinancieroPorSede({ showData }: chartRender) {
  const [refresh, setRefresh] = useState(0);

  // Puedes ajustar filtros por defecto aquí
  const [filtros, setFiltros] = useState({
    fechaDesde: undefined,
    fechaHasta: undefined,
    sedeId: undefined,
    tipo: undefined,
    estado: undefined,
    medioPago: undefined,
  });

  const { movimientos, loadingFinanceData } = useFinanzas({
    refresh,
    setRefresh,
    filtros,
  }) ?? {
    movimientos: [],
    loadingFinanceData: true,
  };

  const resumenPorSede = useMemo(() => {
    const resultado: {
      sede: string;
      ingresos: number;
      egresos: number;
      saldo: number;
    }[] = [];

    movimientos.forEach((mov) => {
      const sede = mov.sede;
      const isIngreso = mov.tipo === "Ingreso";
      const isEgreso = mov.tipo === "Egreso";

      let sedeResumen = resultado.find((r) => r.sede === sede);

      if (!sedeResumen) {
        sedeResumen = { sede, ingresos: 0, egresos: 0, saldo: 0 };
        resultado.push(sedeResumen);
      }

      if (isIngreso) sedeResumen.ingresos += mov.monto;
      if (isEgreso) sedeResumen.egresos += mov.monto;

      sedeResumen.saldo = sedeResumen.ingresos - sedeResumen.egresos;
    });

    return resultado;
  }, [movimientos]);

  const saldoChart = useMemo(() => {
    return {
      series: [
        {
          name: "Saldo",
          data: resumenPorSede.map((r) => r.saldo),
        },
      ],
      categories: resumenPorSede.map((r) => r.sede),
      colors: resumenPorSede.map((r) => (r.saldo >= 0 ? "#16a34a" : "#dc2626")),
    };
  }, [resumenPorSede]);

  return (
    <div className="mt-10">
      {loadingFinanceData ? (
        <div className="text-gray-500">Cargando datos...</div>
      ) : (
        <>
          {showData ? (
            <>
              <h2 className="text-lg font-bold mb-2">
                Resumen Financiero por Sede
              </h2>
              <table className="table-auto w-full text-sm mb-6">
                <thead className="bg-gray-800 text-white">
                  <tr>
                    <th className="p-2">Sede</th>
                    <th className="p-2 text-right">Ingresos</th>
                    <th className="p-2 text-right">Egresos</th>
                    <th className="p-2 text-right">Saldo</th>
                  </tr>
                </thead>
                <tbody>
                  {resumenPorSede.map((r, idx) => (
                    <tr key={idx} className="border-t">
                      <td className="p-2">{r.sede}</td>
                      <td className="p-2 text-right text-green-600">
                        ${r.ingresos.toLocaleString()}
                      </td>
                      <td className="p-2 text-right text-red-600">
                        ${r.egresos.toLocaleString()}
                      </td>
                      <td
                        className={`p-2 text-right ${
                          r.saldo >= 0 ? "text-green-700" : "text-red-700"
                        }`}
                      >
                        ${r.saldo.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          ) : (
            <Chart
              type="bar"
              height={300}
              options={{
                chart: {
                  type: "bar",
                  toolbar: { show: false },
                },
                // xaxis: {
                //   categories: saldoChart.categories,
                //   title: { text: "Sedes" },
                // },
                yaxis: {
                  title: { text: "Saldo ($)" },
                  labels: {
                    formatter: (val) => `$${val.toLocaleString()}`,
                  },
                },
                tooltip: {
                  y: {
                    formatter: (val) => `$${val.toLocaleString()}`,
                  },
                },
                plotOptions: {
                  bar: {
                    distributed: true,
                    columnWidth: "90%",
                  },
                },
                colors: saldoChart.colors,
              }}
              series={saldoChart.series}
            />
          )}
        </>
      )}
    </div>
  );
}
