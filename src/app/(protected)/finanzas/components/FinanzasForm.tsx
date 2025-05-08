"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/utils/supabaseClients";
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
  const { user, loading: sessionLoading } = useUserSession();
  const [tipoPrincMov, setTipoPrincMov] = useState("Ingreso");
  const [form, setForm] = useState({
    fecha: "",
    tipo: tipoPrincMov,
    tipo_mov: "",
    metodo_pago: "Efectivo",
    monto: "0",
    observaciones: "",
    estado: "Ingresado",
    sede_id: user?.sede_id,
  });
  const [loadTipoMovimiento, setLoadTipoMovimiento] = useState(false);
  const [errorTipoMovimiento, setErrorTipoMovimiento] = useState<string | null>(
    null
  );
  const [tipoMovimiento, setTipoMovimiento] = useState<
    { tipo_mov_generico: string }[]
  >([]);
  const [loadSedes, setLoadSedes] = useState(false);
  const [errorSedes, setErrorSedes] = useState<string | null>(null);
  const [sedes, setSedes] = useState<{ id: string; nombre: string }[]>([]);
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const cargarTipoMovmiento = async () => {
    setLoadTipoMovimiento(true);
    setErrorTipoMovimiento(null);
    try {
      const { data, error } = await supabase
        .from("tipos_movimiento")
        .select("tipo_mov_generico")
        .eq("company_id", companyId)
        .eq("tipo_movimiento", tipoPrincMov);

      if (error) {
        console.error("Error al cargar tipos de movimiento:", error.message);
        setErrorTipoMovimiento(error.message);
        return;
      }
      console.log("Tipos de movimiento cargados:", data);
      setTipoMovimiento(data || []);
    } catch (err: any) {
      console.error(
        "Error inesperado al cargar tipos de movimiento:",
        err.message
      );
      setErrorTipoMovimiento(err.message);
    } finally {
      setLoadTipoMovimiento(false);
    }
  };

  const cargaSedes = async () => {
    setLoadSedes(true);
    setErrorSedes(null);
    try {
      const { data, error } = await supabase
        .from("sedes")
        .select("id, nombre")
        .eq("company_id", companyId)
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

  useEffect(() => {
    if (companyId) {
      cargarTipoMovmiento();
    }
  }, [companyId, tipoPrincMov]);

  useEffect(() => {
    if (companyId) {
      cargaSedes();
    }
  }, [companyId]);

  if (sessionLoading || !user) return <div>Cargando...</div>;
  console.log(user?.sede_id?.length);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (e.target.name === "tipo") {
      setTipoPrincMov(e.target.value);
      setForm({ ...form, tipo: e.target.value, tipo_mov: "" }); // Reset tipo_mov when tipo changes
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveLoading(true);
    setSaveError(null);

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
      console.error(
        "Error al guardar movimiento financiero:",
        insertError.message
      );
      setSaveError(insertError.message);
    } else {
      console.log("Movimiento financiero guardado exitosamente");
      if (onSaved) onSaved();
      setForm({
        fecha: "",
        tipo: tipoPrincMov,
        tipo_mov: "",
        metodo_pago: "Efectivo",
        monto: "0",
        observaciones: "",
        estado: "Ingresado",
        sede_id: user?.sede_id,
      });
    }

    setSaveLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-gray-700 p-4 rounded">
      {saveError && <p className="text-red-600">{saveError}</p>}
      <div className="grid grid-rows-3 gap-2">
        <div className="grid grid-cols-2 gap-2">
          <label className="block text-sm font-medium text-white mb-1">
            Fecha
          </label>
          <input
            type="date"
            name="fecha"
            required
            onChange={handleChange}
            className="w-full border rounded p-2 text-gray-800"
          />

          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Tipo de movimiento
            </label>
            <select
              name="tipo"
              value={form.tipo}
              required
              onChange={handleChange}
              className="w-full border rounded p-2 text-gray-800"
            >
              <option value="Ingreso">Ingreso</option>
              <option value="Egreso">Egreso</option>
              <option value="Traspaso">Traspaso</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Clasificación del movimiento
            </label>
            {loadTipoMovimiento ? (
              <div className="w-full border rounded p-2 text-gray-800 italic text-gray-400">
                Cargando clasificaciones...
              </div>
            ) : errorTipoMovimiento ? (
              <div className="w-full border rounded p-2 text-red-600">
                Error al cargar: {errorTipoMovimiento}
              </div>
            ) : (
              <select
                name="tipo_mov"
                value={form.tipo_mov}
                required
                onChange={handleChange}
                className="w-full border rounded p-2 text-gray-800"
                disabled={tipoMovimiento.length === 0}
              >
                <option value="">Selecciona una clasificación</option>
                {tipoMovimiento.map((movimiento) => (
                  <option
                    key={movimiento.tipo_mov_generico}
                    value={movimiento.tipo_mov_generico}
                  >
                    {movimiento.tipo_mov_generico}
                  </option>
                ))}
                {tipoMovimiento.length === 0 && (
                  <option disabled>
                    No hay clasificaciones disponibles para {form.tipo}
                  </option>
                )}
              </select>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-1">
            Observaciones
          </label>
          <textarea
            name="observaciones"
            rows={2}
            required
            onChange={handleChange}
            className="w-full border rounded p-2 text-gray-800"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-1">
            Monto
          </label>
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
            <option value="Efectivo">Efectivo</option>
            <option value="Transferencia">Transferencia</option>
            <option value="Tarjeta">Tarjeta</option>
            <option value="Otro">Otro</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-1">
            Sede
          </label>

          {user?.sede_id?.length === 1 ? ["sede bloqueada"] : []}
          {loadSedes ? (
            <div className="w-full border rounded p-2 text-gray-800 italic text-gray-400">
              Cargando sedes...
            </div>
          ) : errorSedes ? (
            <div className="w-full border rounded p-2 text-red-600">
              Error al cargar: {errorSedes}
            </div>
          ) : (
            <select
              name="sede_id"
              // value={form.sede_id}
              required
              onChange={handleChange}
              className="w-full border rounded p-2 text-gray-800"
              disabled={sedes.length === 0}
            >
              {sedes.map((sede) => (
                <option key={sede.id} value={sede.id}>
                  {sede.nombre}
                </option>
              ))}
              {sedes.length === 0 && (
                <option disabled>No hay sedes disponibles</option>
              )}
            </select>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-1">
            Estado
          </label>
          <select
            name="estado"
            value={form.estado}
            onChange={handleChange}
            className="w-full border rounded p-2 text-gray-800"
          >
            <option value="Ingresado">Ingresado</option>
            <option value="Procesado">Procesado</option>
            <option value="Modificado">Modificado</option>
          </select>
        </div>
      </div>
      <div className="text-right">
        <button
          type="submit"
          disabled={saveLoading || loadTipoMovimiento || loadSedes}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed"
        >
          {saveLoading ? "Guardando..." : "Guardar"}
        </button>
      </div>
    </form>
  );
}
