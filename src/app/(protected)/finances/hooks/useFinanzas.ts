// hooks/useFinanzas.ts
import { useState, useEffect } from "react";
import { supabase } from "@/app/utils/supabaseClients";
import { useUserSession } from "@/hooks/useUserSession";

type Movimiento = {
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

type FiltrosFinanzas = {
  fechaDesde?: string;
  fechaHasta?: string;
  sedeId?: string;
  tipo?: string;
  estado?: string;
  medioPago?: string;
};

type Props = {
  refresh: number;
  setRefresh: React.Dispatch<React.SetStateAction<number>>;
  filtros?: FiltrosFinanzas;
};

export default function useFinanzas({ refresh, filtros }: Props) {
  const { user, loading } = useUserSession();

  const [loadingFinanceData, setLoadingFinanceData] = useState(false);

  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
  const [orden, setOrden] = useState<{ key: keyof Movimiento; asc: boolean }>({
    key: "fecha",
    asc: false,
  });

  const cargarMovimientos = async () => {
    let query = supabase.from("finanzas").select("*, sedes(nombre)");

    if (filtros?.fechaDesde) query = query.gte("fecha", filtros.fechaDesde);
    if (filtros?.fechaHasta) query = query.lte("fecha", filtros.fechaHasta);

    // Si el usuario está limitado por sede, forzar el filtro por sede
    if (user?.scopedBySede && user.sede_id) {
      query = query.eq("sede_id", user.sede_id);
    } else if (filtros?.sedeId) {
      query = query.eq("sede_id", filtros.sedeId);
    }

    if (filtros?.tipo) query = query.eq("tipo", filtros.tipo);
    if (filtros?.estado) query = query.eq("estado", filtros.estado);
    if (filtros?.medioPago) query = query.eq("metodo_pago", filtros.medioPago);

    query = query.order(orden.key, { ascending: orden.asc });

    const { data, error } = await query;
    // console.log(data);
    if (!error) {
      const movimientosConSede = (data || []).map((mov) => ({
        ...mov,
        sede: mov.sedes?.nombre || "—",
      }));

      setMovimientos(movimientosConSede);
    } else {
      console.error("Error al cargar movimientos:", error);
    }
  };

  useEffect(() => {
    if (!loading && user) cargarMovimientos();
  }, [orden, refresh, filtros, loading, user]);

  if (loading || !user) return null;
  console.log('Movimientos del periodo',movimientos);
  return { movimientos, loadingFinanceData };
}