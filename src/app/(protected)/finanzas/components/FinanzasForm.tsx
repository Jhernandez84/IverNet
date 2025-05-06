"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/utils/supabaseClients";
import { monthsInQuarter } from "date-fns/constants";
import { useUserSession } from "@/hooks/useUserSession";

export default function FinanzasForm({
  userId,
  companyId,
  onSaved,
}: {
  userId: string;
  companyId: string;
  onSaved?: () => void;
}) {
  const { user, loading } = useUserSession();
  // console.log("Datos del usuario", user);

  const [tipoPrincMov, setTipoPrincMov] = useState("Ingreso");

  const [form, setForm] = useState({
    fecha: "",
    tipo: tipoPrincMov,
    tipo_mov: "",
    metodo_pago: "Efectivo",
    monto: "0",
    observaciones: "",
    estado: "Activo",
    sede_id: user?.sede_id,
  });

  const [load, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tipoMovimiento, setTipoMovimiento] = useState([]);
  const [sedes, setSedes] = useState([]);

  const cargarTipoMovmiento = async () => {
    const { data, error } = await supabase
      .from("tipos_movimiento")
      .select("tipo_mov_generico")
      .eq("company_id", companyId)
      .eq("tipo_movimiento", tipoPrincMov);
    //.order("nombre", { ascending: true }); // opcional: ordenar por nombre
    if (error) {
      console.error("Error al cargar tipos de movimiento:", error.message);
      return;
    }
    console.log("tipo de movimiento", data);
    setTipoMovimiento(data || []);
  };

  const cargaSedes = async () => {
    const { data, error } = await supabase
      .from("sedes")
      .select("id, nombre")
      .eq("company_id", companyId)
      .order("nombre", { ascending: true }); // opcional: ordenar por nombre
    if (error) {
      console.error("Error al cargar tipos de movimiento:", error.message);
      return;
    }

    setSedes(data || []);
  };

  useEffect(() => {
    cargarTipoMovmiento();
    cargaSedes();
  }, [tipoPrincMov]);

  if (loading || !user) return null;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    console.log([e.target.name], e.target.value);
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: insertError } = await supabase.from("finanzas").insert([
      {
        fecha: form.fecha,
        tipo: form.tipo,
        tipo_mov: form.tipo_mov,
        metodo_pago: form.metodo_pago,
        monto: parseFloat(form.monto),
        observaciones: form.observaciones,
        estado: form.estado,
        sede_id: form.sede_id,
        responsable_id: userId,
        company_id: companyId,
      },
    ]);

    if (insertError) {
      setError(insertError.message);
    } else {
      if (onSaved) onSaved();
      setForm({
        fecha: "",
        tipo: tipoPrincMov,
        tipo_mov: "",
        metodo_pago: "Efectivo",
        monto: "0",
        observaciones: "",
        estado: "Activo",
        sede_id: form.sede_id,
      });
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-gray-700">
      {error && <p className="text-red-600">{error}</p>}

      <div>
        <label className="block text-sm font-medium mb-1">Fecha</label>
        <input
          type="date"
          name="fecha"
          required
          onChange={handleChange}
          className="w-full border rounded p-2 text-gray-800"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Tipo de movimiento
        </label>
        <select
          name="tipo"
          value={form.tipo}
          required
          onChange={(e) => {
            handleChange(e);
            setTipoPrincMov(e.target.value);
          }}
          className="w-full border rounded p-2 text-gray-800"
        >
          <option>Ingreso</option>
          <option>Egreso</option>
          <option>Traspaso</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Clasificación del movimiento
        </label>
        <select
          name="tipo_mov"
          value={form.tipo_mov}
          required
          onChange={handleChange}
          className="w-full border rounded p-2 text-gray-800"
        >
          {tipoMovimiento.map((movimiento) => {
            return (
              <option value={movimiento.tipo_mov_generico}>
                {movimiento.tipo_mov_generico}
              </option>
            );
          })}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Observaciones</label>
        <textarea
          name="observaciones"
          rows={2}
          required
          onChange={handleChange}
          className="w-full border rounded p-2 text-gray-800"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Monto</label>
        <input
          type="number"
          name="monto"
          placeholder={form.monto}
          required
          onChange={handleChange}
          className="w-full border rounded p-2 text-gray-800"
        />
      </div>

      <div>
        <label className="block text-sm text-white font-medium mb-1">
          Método de pago
        </label>
        <select
          name="metodo_pago"
          value={form.metodo_pago}
          onChange={handleChange}
          className="w-full border rounded p-2 text-gray-800"
        >
          <option>Efectivo</option>
          <option>Transferencia</option>
          <option>Tarjeta</option>
          <option>Otro</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Sede</label>
        <select
          name="sede_id"
          value={form.sede_id}
          required
          onChange={handleChange}
          className="w-full border rounded p-2 text-gray-800"
        >
          {sedes.map((sede) => {
            return <option value={sede.id}>{sede.nombre}</option>;
          })}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Estado</label>
        <select
          name="estado"
          value={form.estado}
          onChange={handleChange}
          className="w-full border rounded p-2 text-gray-800"
        >
          <option>Ingresado</option>
          <option>Procesado</option>
          <option>Modificado</option>
        </select>
      </div>

      <div className="text-right">
        <button
          type="submit"
          disabled={load}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {load ? "Guardando..." : "Guardar"}
        </button>
      </div>
    </form>
  );
}
