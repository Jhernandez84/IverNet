"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/utils/supabaseClients";

type ResumenItem = {
  sede_id: string;
  //sede_nombre: string;
  ingresos: number;
  egresos: number;
  saldo: number;
};

type Props = {
  companyId: string;
  sedeId: string;
  refresh: number;
};

export default function ResumenPorSede({ companyId, sedeId, refresh }: Props) {
  const [resumen, setResumen] = useState<ResumenItem[]>([]);

  const fetchData = async () => {
    // 1. Cargar movimientos financieros
    let query = supabase
      .from("finanzas")
      .select("monto, tipo, sedes(nombre)")
      .eq("company_id", companyId);

    if (sedeId) {
      query = query.eq("sede_id", sedeId);
    }

    const { data: movimientos, error } = await query;

    if (error) {
      console.error("Error al cargar movimientos", error);
      return;
    }

    // 2. Agrupar por sede
    const agrupado: Record<string, ResumenItem> = {};

    for (const m of movimientos || []) {
      const sedeNombre = m.sedes?.nombre || "Sin sede";

      if (!agrupado[sedeNombre]) {
        agrupado[sedeNombre] = {
          sede_id: sedeNombre, // puedes cambiarlo a `sede_nombre` si prefieres
          ingresos: 0,
          egresos: 0,
          saldo: 0,
        };
      }

      if (m.tipo === "Ingreso") agrupado[sedeNombre].ingresos += m.monto;
      else if (m.tipo === "Egreso") agrupado[sedeNombre].egresos += m.monto;

      agrupado[sedeNombre].saldo =
        agrupado[sedeNombre].ingresos - agrupado[sedeNombre].egresos;
    }

    setResumen(Object.values(agrupado));
  };

  useEffect(() => {
    fetchData();
  }, [companyId]);

  useEffect(() => {
    fetchData();
  }, [refresh]);

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Resumen por sede</h3>
      <table className="w-full table-auto text-sm ">
        <thead className="bg-gray-100 text-white bg-gray-700">
          <tr>
            <th className="text-left p-2">Sede</th>
            <th className="text-right p-2">Ingresos</th>
            <th className="text-right p-2">Egresos</th>
            <th className="text-right p-2">Saldo</th>
          </tr>
        </thead>
        <tbody>
          {resumen.map((r) => (
            <tr key={r.sede_id} className="border-t">
              <td className="p-2">{r.sede_id}</td>
              <td className="p-2 text-right">${r.ingresos.toLocaleString()}</td>
              <td className="p-2 text-right">${r.egresos.toLocaleString()}</td>
              <td className="p-2 text-right font-bold">
                ${r.saldo.toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
