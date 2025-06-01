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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Reportes Financieros</h1>

      {/* Filtros */}

      <div
        className={`grid gap-2 ${
          !user?.scopedBySede
            ? "grid grid-cols-7 md:grid-cols-7 gap-4 mb-6 text-gray-800"
            : "grid grid-cols-6 md:grid-cols-6 gap-4 mb-6 text-gray-800"
        }`}
      >
        <select
          name="dateView"
          value={filtros.dateView}
          onChange={handleChange}
          className="border p-2 rounded"
        >
          <option value="mtd">Este mes</option>
          <option value="mtd">Esta semana</option>
          <option value="ytd">Este año</option>
          <option value="custom">Rango de fecha</option>
        </select>
        <input
          type="date"
          name="fechaDesde"
          value={filtros.fechaDesde}
          onChange={handleChange}
          className="border p-2 rounded"
          disabled={filtros.dateView != "custom"}
        />
        <input
          type="date"
          name="fechaHasta"
          value={filtros.fechaHasta}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <select
          name="tipo"
          value={filtros.tipo}
          onChange={handleChange}
          className="border p-2 rounded"
        >
          <option value="">Movimiento</option>
          <option value="Ingreso">Ingreso</option>
          <option value="Egreso">Egreso</option>
          <option value="Traspaso">Traspaso</option>
        </select>
        {!user?.scopedBySede && (
          <select
            name="sedeId"
            value={filtros.sedeId}
            onChange={handleChange}
            className="border p-2 rounded"
          >
            <option value="">Sedes</option>
            {sedes.map((seleccionSede) => (
              <option key={seleccionSede.id} value={seleccionSede.id}>
                {seleccionSede.nombre}
              </option>
            ))}
          </select>
        )}
        <select
          name="estado"
          value={filtros.estado}
          onChange={handleChange}
          className="border p-2 rounded"
        >
          <option value="">Estado</option>
          <option value="Ingresado">Ingresado</option>
          <option value="Confirmado">Confirmado</option>
          <option value="Por Confirmar">Por Confirmar</option>
        </select>
        <select
          name="medioPago"
          value={filtros.medioPago}
          onChange={handleChange}
          className="border p-2 rounded"
        >
          <option value="">Medios de pago</option>
          <option value="Transferencia">Transferencia</option>
          <option value="Efectivo">Efectivo</option>
        </select>
        {/* Agrega más filtros: sede, estado, medio_pago... */}
      </div>

      <FinanzasTable
        filtros={filtros}
        // refresh={refreshTrigger}
        // setRefresh={setRefreshTrigger}
      />
    </div>
  );
}
