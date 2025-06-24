// hooks/useFinanzas.ts
import { useState, useEffect } from "react";
import { supabase } from "@/app/utils/supabaseClients";
import { useUserSession } from "@/hooks/useUserSession";
import { useFilters } from "../context/financeContext";

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

type Props = {
  refresh: number;
  setRefresh: React.Dispatch<React.SetStateAction<number>>;
};

export default function useFinanzas({ refresh }: Props) {
  const { user, loading } = useUserSession();
  const { filters, setFilters } = useFilters();

  console.log(filters);

  const [loadingFinanceData, setLoadingFinanceData] = useState(false);

  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
  const [orden, setOrden] = useState<{ key: keyof Movimiento; asc: boolean }>({
    key: "fecha",
    asc: false,
  });

  const cargarMovimientos = async () => {
    let query = supabase.from("finanzas").select("*, sedes(nombre)");

    if (filters?.filterStartDate)
      query = query.gte("fecha", filters.filterStartDate);
    if (filters?.filterEndDate)
      query = query.lte("fecha", filters.filterEndDate);

    // Si el usuario está limitado por sede, forzar el filtro por sede
    if (user?.scopedBySede && user.sede_id) {
      query = query.eq("sede_id", user.sede_id);
    } else if (filters?.filterBranch !== null && filters?.filterBranch !== "") {
      query = query.eq("sede_id", filters.filterBranch);
    }

    if (filters?.filterMovement !== null && filters?.filterMovement !== "")
      query = query.eq("tipo", filters.filterMovement);
    if (filters?.filterMovStatus !== null && filters?.filterMovStatus !== "")
      query = query.eq("estado", filters.filterMovStatus);
    if (
      filters?.filterPaymentMethod !== null &&
      filters?.filterPaymentMethod !== ""
    )
      query = query.eq("metodo_pago", filters.filterPaymentMethod);

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
  }, [orden, refresh, filters, loading, user]);

  if (loading || !user) return null;
  // console.log("Movimientos del periodo", movimientos);
  return { movimientos, loadingFinanceData };
}
