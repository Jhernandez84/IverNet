"use client";

import { useState } from "react";
import FinanzasTable from "../components/FinanzasTable";

export default function ReportesFinancieros() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const [filtros, setFiltros] = useState({
    fechaDesde: "",
    fechaHasta: "",
    sedeId: "",
    tipo: "",
    estado: "",
    medioPago: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFiltros({ ...filtros, [e.target.name]: e.target.value });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Reportes Financieros</h1>

      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-gray-800">
        <input
          type="date"
          name="fechaDesde"
          value={filtros.fechaDesde}
          onChange={handleChange}
          className="border p-2 rounded"
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
          <option value="">Todos los tipos de movimiento</option>
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
          <option value="">Todas las sedes</option>
          <option value="Ingreso">Ingreso</option>
          <option value="Egreso">Egreso</option>
        </select>
        <select
          name="estado"
          value={filtros.estado}
          onChange={handleChange}
          className="border p-2 rounded"
        >
          <option value="">Todos los estados</option>
          <option value="Ingreso">Ingreso</option>
          <option value="Egreso">Egreso</option>
        </select>
        <select
          name="medioPago"
          value={filtros.medioPago}
          onChange={handleChange}
          className="border p-2 rounded"
        >
          <option value="">Todos los medios de pago</option>
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
