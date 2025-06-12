// components/ResumenFinanzas.tsx
"use client";

import { useState } from "react";

import useFinanzas from "../hooks/useFinanzas";
import { useUserSession } from "@/hooks/useUserSession";

// para la generación del PDF
import jsPDF from "jspdf";
import { autoTable } from "jspdf-autotable";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Tipo que ya tienes
type movs = {
  id: string;
  company_id: string;
  responsable_id: string;
  fecha: string;
  tipo: string;
  tipo_mov: string;
  metodo_pago: string;
  observaciones: string;
  mov_grupo: string;
  num_doc: string;
  monto: number;
  estado: string;
  sede_id: string;
  sede: string;
};

// Props esperadas
type Props = {
  movs: movs[];
};

// export default function monthlyReport({ movs }: Props) {
export default function MonthlyReport() {
  const { user, loading } = useUserSession();
  // 1) refresh puede ser un contador o booleano para disparar recarga
  const [refresh, setRefresh] = useState(0);

  // Llamas al hook pasándole lo anterior

  const { movimientos, loadingFinanceData } = useFinanzas({
    refresh,
    setRefresh,
  }) ?? {
    movimientos: [],
    loadingFinanceData: true,
  };

  const [expandido, setExpandido] = useState(false);
  const [sedeExpandida, setSedeExpandida] = useState<string | null>(null);

  // Filtrar ingresos y egresos
  const ingresos = movimientos.filter((m) => m.tipo === "Ingreso");
  const egresos = movimientos.filter(
    (m) => m.tipo === "Egreso" || m.tipo === "Traspaso"
  );

  const totalIngresos = ingresos.reduce((sum, m) => sum + m.monto, 0);
  const totalEgresos = egresos.reduce((sum, m) => sum + m.monto, 0);

  const saldoFinal = totalIngresos - totalEgresos;

  // Agrupar por tipo

  // Agrupar por sede → tipo → tipo_mov
  //   const agrupado = movimientos.reduce((acc, mov) => {
  //     if (!acc[mov.sede]) acc[mov.sede] = {};
  //     if (!acc[mov.sede][mov.tipo]) acc[mov.sede][mov.tipo] = {};
  //     if (!acc[mov.sede][mov.tipo][mov.tipo_mov])
  //       acc[mov.sede][mov.tipo][mov.tipo_mov] = [];
  //     acc[mov.sede][mov.tipo][mov.tipo_mov].push(mov);
  //     return acc;
  //   }, {} as Record<string, Record<string, Record<string, movs[]>>>);

  // Agrupar por sede
  const agrupadoPorSede = movimientos.reduce((acc, mov) => {
    if (!acc[mov.sede]) acc[mov.sede] = [];
    acc[mov.sede].push(mov);
    return acc;
  }, {} as Record<string, movs[]>);

  // Función auxiliar para calcular total de ingresos - egresos
  const calcularSaldo = (movs: movs[]) => {
    const ingresos = movs
      .filter((m) => m.tipo === "Ingreso")
      .reduce((s, m) => s + m.monto, 0);
    const egresos = movs
      .filter((m) => m.tipo === "Egreso" || m.tipo === "Traspaso")
      .reduce((s, m) => s + m.monto, 0);
    return ingresos - egresos;
  };

  const generarPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Resumen Financiero por Sede", 14, 15);

    let y = 25;

    Object.entries(agrupadoPorSede).forEach(([sede, movs]) => {
      const resumen = movs.reduce((acc, m) => {
        const clave = `${m.tipo}__${m.tipo_mov}`;
        if (!acc[clave]) {
          acc[clave] = {
            tipo: m.tipo,
            tipo_mov: m.tipo_mov,
            monto: 0,
          };
        }
        acc[clave].monto += m.monto;
        return acc;
      }, {} as Record<string, { tipo: string; tipo_mov: string; monto: number }>);

      const resumenArray = Object.values(resumen).sort((a, b) => {
        if (a.tipo < b.tipo) return -1;
        if (a.tipo > b.tipo) return 1;
        if (a.tipo_mov < b.tipo_mov) return -1;
        if (a.tipo_mov > b.tipo_mov) return 1;
        return 0;
      });

      doc.setFontSize(12);
      doc.text(`Sede: ${sede}`, 14, y);
      y += 5;

      autoTable(doc, {
        startY: y,
        head: [["Tipo", "Tipo Movimiento", "Monto"]],
        body: resumenArray.map((item) => [
          item.tipo,
          item.tipo_mov,
          `$${item.monto.toLocaleString()}`,
        ]),
        theme: "striped",
        headStyles: { fillColor: [41, 128, 185] },
        styles: { fontSize: 10 },
      });

      y = (doc as any).lastAutoTable.finalY + 10;
    });

    doc.save("reporte_sedes.pdf");
  };

  if (loadingFinanceData) return <p>Cargando datos de finanzas reporte…</p>;

  if (loading || !user) return null;

  return (
    <div className="bg-white border rounded shadow">
      <div className="p-4 border-b grid grid-cols-[80%_20%]">
        <div>
          <h2 className="text-lg font-bold text-gray-500">
            📊 Resumen por Sede
          </h2>
        </div>
        <div>
          <button
            onClick={generarPDF}
            className="mb-4 px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
          >
            📄 Exportar a PDF
          </button>
        </div>
      </div>

      <div className="p-4">
        {Object.entries(agrupadoPorSede).map(([sede, movs]) => {
          const sedeSaldo = calcularSaldo(movs);

          // Agrupar por tipo + tipo_mov (ej: "Ofrenda-Ingreso")
          const resumen = movs.reduce((acc, m) => {
            const clave = `${m.tipo}__${m.tipo_mov}`;
            if (!acc[clave]) {
              acc[clave] = {
                tipo: m.tipo,
                tipo_mov: m.tipo_mov,
                monto: 0,
              };
            }
            acc[clave].monto += m.monto;
            return acc;
          }, {} as Record<string, { tipo: string; tipo_mov: string; monto: number }>);

          const resumenArray = Object.values(resumen);

          resumenArray.sort((a, b) => {
            if (a.tipo.toLowerCase() < b.tipo.toLowerCase()) return 1;
            if (a.tipo.toLowerCase() > b.tipo.toLowerCase()) return -1;
            if (a.tipo_mov.toLowerCase() < b.tipo_mov.toLowerCase()) return -1;
            if (a.tipo_mov.toLowerCase() > b.tipo_mov.toLowerCase()) return 1;
            return 0;
          });

          return (
            <div key={sede} className="mb-4 border rounded">
              <div
                className="cursor-pointer flex justify-between items-center p-3 bg-gray-100 hover:bg-gray-200"
                onClick={() =>
                  setSedeExpandida(sedeExpandida === sede ? null : sede)
                }
              >
                <span className="font-semibold text-blue-700">{sede}</span>
                <span
                  className={`font-semibold ${
                    sedeSaldo >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  Saldo: ${sedeSaldo.toLocaleString()}
                </span>
              </div>

              {sedeExpandida === sede && (
                <div className="rounded-md border mt-2">
                  <div className="bg-muted text-muted-foreground text-xs uppercase font-semibold px-4 py-2 flex">
                    <div className="w-1/3">Tipo</div>
                    <div className="w-1/3">Tipo Movimiento</div>
                    <div className="w-1/3 text-right">Monto</div>
                  </div>

                  {resumenArray.map((item, index) => (
                    <div
                      key={index}
                      className="px-4 py-2 border-t text-sm flex items-center hover:bg-accent/30"
                    >
                      <div className="w-1/3">{item.tipo}</div>
                      <div className="w-1/3">{item.tipo_mov}</div>
                      <div
                        className={`w-1/3 text-right font-medium ${
                          item.tipo === "Ingreso"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        ${item.monto.toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
