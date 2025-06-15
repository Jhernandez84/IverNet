"use client";

import {
  format,
  startOfMonth,
  startOfWeek,
  startOfYear,
  endOfMonth,
  endOfWeek,
} from "date-fns";
import { es } from "date-fns/locale";
import { useUserSession } from "@/hooks/useUserSession";
import { supabase } from "@/app/utils/supabaseClients";

import { useEffect, useState } from "react";
import FinanzasTable from "../components/FinanzasTable";

import FinanceFilters from "../components/FinanceFilters";

export default function ReportesFinancieros() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const [loadSedes, setLoadSedes] = useState(false);
  const [errorSedes, setErrorSedes] = useState<string | null>(null);
  const [sedes, setSedes] = useState<{ id: string; nombre: string }[]>([]);

  const { user, loading } = useUserSession();

  const toISO = (d: Date) => format(d, "yyyy-MM-dd");

  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth).toISOString().slice(0, 10);
  console.log(monthStart);
  const monthEnd = endOfMonth(monthStart).toISOString().slice(0, 10);

  const today = new Date();
  const fechaHoy = toISO(today);
  const fechaSemana = toISO(startOfWeek(today, { weekStartsOn: 1 }));
  const fechaMes = toISO(startOfMonth(today));
  const fechaAnio = toISO(startOfYear(today));

  const [dateRange, setDateRange] = useState("mtd");

  const [filtros, setFiltros] = useState({
    dateView: "mtd",
    fechaDesde: monthStart,
    fechaHasta: monthEnd,
    sedeId: "",
    tipo: "",
    estado: "",
    medioPago: "",
  });

  useEffect(() => {
    const cargaSedes = async () => {
      setLoadSedes(true);
      setErrorSedes(null);
      try {
        const { data, error } = await supabase
          .from("sedes")
          .select("id, nombre")
          .eq("company_id", user?.company_id)
          .order("nombre", { ascending: true });
        if (error) {
          console.error("Error al cargar sedes:", error.message);
          setErrorSedes(error.message);
          return;
        }
        console.log("Sedes cargadas:", data);
        setSedes(data || []);
      } catch (err: any) {
        console.error("Error inesperado al cargar sedes:", err.message);
        setErrorSedes(err.message);
      } finally {
        setLoadSedes(false);
      }
    };

    cargaSedes();
  }, [user]);

  useEffect(() => {
    const fecha =
      dateRange === "custom"
        ? fechaHoy
        : dateRange === "wtd"
        ? fechaSemana
        : dateRange === "mtd"
        ? monthStart
        : dateRange === "ytd"
        ? fechaAnio
        : fechaHoy;

    setFiltros((prev) => ({
      ...prev,
      dateView: dateRange,
      fechaDesde: fecha,
      fechaHasta: fechaHoy,
    }));
  }, [dateRange]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFiltros({ ...filtros, [e.target.name]: e.target.value });
  };

  // console.log(filtros);
  // user?.access.map((ac) => console.log(access));

  return (
    <div className="p-2 bg-gray-900 h-[90vh]">
      <div className="pb-2">
        <FinanceFilters />
      </div>

      <FinanzasTable
        filtros={filtros}
        // refresh={refreshTrigger}
        // setRefresh={setRefreshTrigger}
      />
    </div>
  );
}
