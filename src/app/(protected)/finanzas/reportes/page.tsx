"use client";

import { format, startOfMonth, startOfWeek, startOfYear } from "date-fns";
import { es } from "date-fns/locale";

import { useEffect, useState } from "react";
import FinanzasTable from "../components/FinanzasTable";

export default function ReportesFinancieros() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const toISO = (d: Date) => format(d, "yyyy-MM-dd");

  const today = new Date();
  const fechaHoy = toISO(today);
  const fechaSemana = toISO(startOfWeek(today, { weekStartsOn: 1 }));
  const fechaMes = toISO(startOfMonth(today));
  const fechaAnio = toISO(startOfYear(today));

  const [dateRange, setDateRange] = useState("current");

  const [filtros, setFiltros] = useState({
    dateView: "current",
    fechaDesde: fechaHoy,
    fechaHasta: fechaHoy,
    sedeId: "",
    tipo: "",
    estado: "",
    medioPago: "",
  });

  useEffect(() => {
    const fecha =
      dateRange === "custom"
        ? fechaHoy
        : dateRange === "wtd"
        ? fechaSemana
        : dateRange === "mtd"
        ? fechaMes
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

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Reportes Financieros</h1>

      {/* Filtros */}
      <div className="grid grid-cols-6 md:grid-cols-7 gap-4 mb-6 text-gray-800">
        <select
          name="dateView"
          value={filtros.dateView}
          onChange={handleChange}
          className="border p-2 rounded"
        >
          <option value="current">Hoy</option>
          {/* <option value="wtd">Esta semana</option>
          <option value="mtd">Este Mes</option>
          <option value="ytd">Este año</option> */}
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
          <option value="Egreso">Traspaso</option>
        </select>
        <select
          name="sede"
          value={filtros.sedeId}
          onChange={handleChange}
          className="border p-2 rounded"
        >
          <option value="">Sedes</option>
          <option value="Ingreso">Ingreso</option>
          <option value="Egreso">Egreso</option>
        </select>
        <select
          name="estado"
          value={filtros.estado}
          onChange={handleChange}
          className="border p-2 rounded"
        >
          <option value="">Estado</option>
          <option value="Ingreso">Ingreso</option>
          <option value="Egreso">Egreso</option>
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
        refresh={refreshTrigger}
        setRefresh={setRefreshTrigger}
      />
    </div>
  );
}
