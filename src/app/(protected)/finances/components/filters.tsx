//Importar el contexto y pasarle los valores que estoy seleccionando acá
//Importar el contexto y pasarle los valores que estoy seleccionando acá

export default function financeFilters() {
  return (
    <>
      <div className="bg-gray-800 shadow rounded">
        <select
          name=""
          id=""
          className="rounded bg-gray-900 text-sm text-white m-2 border-none"
        >
          <option value="">Este mes</option>
          <option value="">Esta semana</option>
          <option value="">Este año</option>
          <option value="">Rango de fecha</option>
          <option value="">Hoy</option>
        </select>
        <input
          type="date"
          className="rounded bg-gray-900 text-sm text-white m-2 border-none"
        />
        <input
          type="date"
          className="rounded bg-gray-900 text-sm text-white m-2 border-none"
        />

        <select
          name=""
          id=""
          className="rounded bg-gray-900 text-sm text-white m-2 border-none"
        >
          <option value="" selected>
            Tipo movimiento
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
        <select
          name=""
          id=""
          className="rounded bg-gray-900 text-sm text-white m-2 border-none"
        >
          <option value="" selected>
            Opciones
          </option>
        </select>
      </div>
    </>
  );
}
