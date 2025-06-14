import { useFilters } from "../context/financeContext";

export default function FinanceFilters() {
  const { filters, setFilters } = useFilters();

  const handleChange = (name: keyof typeof filters, value: string) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-gray-800 shadow rounded">
      <select
        value={filters.filterPeriod ?? ""}
        onChange={(e) => handleChange("filterPeriod", e.target.value)}
        className="rounded bg-gray-900 text-sm text-white m-2 border-none"
      >
        <option value="dia" selected>
          Hoy
        </option>
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
        <option value="ingreso">Ingresos</option>
        <option value="egreso">Egresos</option>
        <option value="traspaso">Traspasos</option>
      </select>

      <select
        name=""
        id=""
        className="rounded bg-gray-900 text-sm text-white m-2 border-none"
      >
        <option value="" selected>
          Clasificación
        </option>
        <option value="">Ingresos</option>
        <option value="">Egresos</option>
        <option value="">Traspasos</option>
      </select>

      <select
        name=""
        id=""
        className="rounded bg-gray-900 text-sm text-white m-2 border-none"
      >
        <option value="" selected>
          Estado del movimiento
        </option>
        <option value="">Ingresado</option>
        <option value="">En Revisión</option>
        <option value="">Confirmado</option>
      </select>
      <select
        name=""
        id=""
        className="rounded bg-gray-900 text-sm text-white m-2 border-none"
      >
        <option value="" selected>
          Medio de pago
        </option>
        <option value="">Efectivo</option>
        <option value="">Tranferencia</option>
        <option value="">Cosa</option>
      </select>
      <select
        name=""
        id=""
        className="rounded bg-gray-900 text-sm text-white m-2 border-none"
      >
        <option value="" selected>
          Sede
        </option>
        <option value="">Sede 1</option>
        <option value="">Sede 2</option>
        <option value="">Sede 3</option>
      </select>
    </div>
  );
}