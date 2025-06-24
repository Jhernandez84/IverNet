import { useFilters } from "../context/financeContext";
import { useUserSession } from "@/hooks/useUserSession";
import { useEffect, useState } from "react";
import { supabase } from "@/app/utils/supabaseClients";

export default function FinanceFilters() {
  const { user, loading } = useUserSession();
  const { filters, setFilters } = useFilters();

  const [loadSedes, setLoadSedes] = useState(false);
  const [errorSedes, setErrorSedes] = useState<string | null>(null);
  const [sedes, setSedes] = useState<{ id: string; nombre: string }[]>([]);

  const [loadMovimientos, setLoadMovimientos] = useState(false);
  const [errorMovimientos, setErrorMovimientos] = useState<string | null>(null);
  const [movimientos, setMovimientos] = useState<
    { id: string; tipo_mov_generico: string }[]
  >([]);

  const handleChange = (name: keyof typeof filters, value: string) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

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

  const cargaMovimientos = async () => {
    setLoadMovimientos(true);
    setErrorMovimientos(null);
    try {
      const { data, error } = await supabase
        .from("tipos_movimiento")
        .select("id, tipo_mov_generico")
        .eq("company_id", user?.company_id)
        .order("tipo_mov_generico", { ascending: true });
      if (error) {
        console.error("Error al cargar movimientos:", error.message);
        setErrorMovimientos(error.message);
        return;
      }
      console.log("Sedes cargadas:", movimientos);
      setMovimientos(data || []);
    } catch (err: any) {
      console.error("Error inesperado al cargar movimientos:", err.message);
      setErrorMovimientos(err.message);
    } finally {
      setLoadMovimientos(false);
    }
  };

  useEffect(() => {
    cargaSedes();
    cargaMovimientos();
  }, []);

  return (
    <div className="bg-gray-800 shadow rounded">
      <select
        value={filters.filterPeriod ?? ""}
        onChange={(e) => handleChange("filterPeriod", e.target.value)}
        className="rounded bg-gray-900 text-sm text-white m-2 border-none"
        defaultValue="dia"
      >
        <option value="dia">Hoy</option>
        <option value="semana">Esta semana</option>
        <option value="mes">Este mes</option>
        <option value="ultmes">Mes anterior</option>
        <option value="anio">Este año</option>
        <option value="custom">Rango de fecha</option>
      </select>

      <input
        type="date"
        value={filters.filterStartDate ?? ""}
        onChange={(e) => handleChange("filterStartDate", e.target.value)}
        className="rounded bg-gray-900 text-sm text-white m-2 border-none"
        disabled={filters.filterPeriod !== "custom"}
      />
      <input
        type="date"
        value={filters.filterEndDate ?? ""}
        onChange={(e) => handleChange("filterEndDate", e.target.value)}
        className="rounded bg-gray-900 text-sm text-white m-2 border-none"
        disabled={filters.filterPeriod !== "custom"}
      />
      <select
        value={filters.filterMovement ?? ""}
        onChange={(e) => handleChange("filterMovement", e.target.value)}
        className="rounded bg-gray-900 text-sm text-white m-2 border-none"
      >
        <option value="">Tipo movimiento</option>
        <option value="Ingreso">Ingresos</option>
        <option value="Egreso">Egresos</option>
        <option value="Traspaso">Traspasos</option>
      </select>

      <select
        name=""
        id=""
        value={filters.filterClass ?? ""}
        onChange={(e) => handleChange("filterClass", e.target.value)}
        className="rounded bg-gray-900 text-sm text-white m-2 border-none"
      >
        <option value="">Clasificación</option>
        {movimientos.map((mov) => (
          <option key={mov.id} value={mov.tipo_mov_generico}>
            {mov.tipo_mov_generico.slice(0, 25)}
          </option>
        ))}
      </select>

      <select
        name=""
        id=""
        value={filters.filterMovStatus ?? ""}
        onChange={(e) => handleChange("filterMovStatus", e.target.value)}
        className="rounded bg-gray-900 text-sm text-white m-2 border-none"
      >
        <option value="">Estado del movimiento</option>
        <option value="Ingresado">Ingresado</option>
        <option value="En Revisión">En Revisión</option>
        <option value="Confirmado">Confirmado</option>
      </select>
      <select
        name=""
        id=""
        value={filters.filterPaymentMethod ?? ""}
        onChange={(e) => handleChange("filterPaymentMethod", e.target.value)}
        className="rounded bg-gray-900 text-sm text-white m-2 border-none"
      >
        <option value="">Medio de pago</option>
        <option value="Efectivo">Efectivo</option>
        <option value="Transferencia">Tranferencia</option>
        <option value="Otros">Otros</option>
      </select>
      {user?.scopedBySede !== true ? (
        <select
          name=""
          id=""
          value={filters.filterBranch ?? ""}
          onChange={(e) => handleChange("filterBranch", e.target.value)}
          className="rounded bg-gray-900 text-sm text-white m-2 border-none"
        >
          <option value="">Seleccione Sede</option>
          {sedes.map((sede) => (
            <option key={sede.id} value={sede.id}>
              {sede.nombre}
            </option>
          ))}
        </select>
      ) : (
        []
      )}
    </div>
  );
}
