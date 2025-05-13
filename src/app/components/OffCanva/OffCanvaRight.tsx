import {
  Dispatch,
  SetStateAction,
  useState,
  FormEvent,
  useEffect,
} from "react";
import { supabase } from "@/app/utils/supabaseClients";
import { useUserSession } from "@/hooks/useUserSession";
import { useCalendarEvents } from "../calendar/useCalendarEvents";

interface OffCanvasProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  date?: string | null; // o string, según cómo lo uses
  crear?: boolean;
  // puedes añadir más props aquí
}

export function OffCanvasRight({ open, setOpen, date, crear }: OffCanvasProps) {
  const [title, setTitle] = useState("");
  const [eventDate, setEventDate] = useState<string>(date || "");

  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [refresh, setRefresh] = useState(0);

  // Validación de campos requeridos
  const canSave =
    title.trim() !== "" &&
    eventDate !== "" &&
    startTime !== "" &&
    endTime !== "";

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!canSave) return;

    // Construye los timestamps combinando fecha + hora
    const startDateTime = new Date(`${eventDate}T${startTime}:00Z`);
    const endDateTime = new Date(`${eventDate}T${endTime}:00Z`);

    // Inserción en Supabase
    const { data, error } = await supabase.from("events").insert([
      {
        company_id: user?.company_id,
        user_id: user?.id,
        title,
        description,
        location,
        category,
        start_date: startDateTime.toISOString(),
        end_date: endDateTime.toISOString(),
        all_day: false,
      },
    ]);

    if (error) {
      console.error("Error al guardar evento:", error);
      // podrías mostrar una notificación de error aquí
    } else {
      console.log("Evento creado:", data);
      // limpia el formulario si quisieras
      setTitle("");
      setLocation("");
      setCategory("");
      setDescription("");
      // cierra el off-canvas
      setOpen(false);
    }
  };

  useEffect(() => {
    if (!date) {
      setEventDate("");
      return;
    }
    // Si viene como string, créale un Date
    const parsed = typeof date === "string" ? new Date(date) : date;
    setEventDate(parsed.toISOString().slice(0, 10));
  }, [date]);

  const { user, loading } = useUserSession();
  if (loading) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`bg-gray-800 fixed inset-0 bg-black bg-opacity-50 transition-opacity ${
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        } z-40`}
        onClick={() => setOpen(false)}
      />

      {/* Sidebar desde la derecha */}
      {/* Off-canvas */}
      <aside
        className={`fixed top-0 right-0 h-full w-80 bg-gray-700 text-gray-700 shadow-lg transform transition-transform ${
          open ? "translate-x-0" : "translate-x-full"
        } p-6 z-50`}
      >
        <div className="flex justify-between items-center mb-6">
          {crear === true ? (
            <h2 className="text-xl font-bold text-white">Editar Evento</h2>
          ) : (
            <h2 className="text-xl font-bold text-white">Nuevo evento</h2>
          )}

          <button
            onClick={() => setOpen(false)}
            className="text-gray-600 text-2xl leading-none"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          {/* 1. Fecha (requerido) */}
          <div className="flex flex-col text-white">
            <label className="mb-1 font-medium">Fecha *</label>
            <input
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="border rounded px-3 py-2  text-gray-700"
            />
          </div>

          {/* 2. Título (requerido) */}
          <div className="flex flex-col">
            <label className="mb-1 font-medium text-white ">Título *</label>
            <input
              type="text"
              placeholder="Nombre del evento..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border rounded px-3 py-2 text-gray-700"
            />
          </div>

          {/* 3. Hora de inicio (requerido) */}
          <div className="flex flex-col">
            <label className="mb-1 font-medium text-white">Hora inicio *</label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="border rounded px-3 py-2 text-gray-700"
            />
          </div>

          {/* 4. Hora de fin (requerido) */}
          <div className="flex flex-col">
            <label className="mb-1 font-medium text-white">Hora fin *</label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="border rounded px-3 py-2 text-gray-800"
            />
          </div>

          {/* 5. Ubicación */}
          <div className="flex flex-col">
            <label className="mb-1 font-medium text-white">Ubicación</label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="border rounded px-3 py-2"
            >
              <option value="">Sin categoría</option>
              <option value="Reunión">Reunión</option>
              <option value="Tarea">Tarea</option>
              <option value="Recordatorio">Recordatorio</option>
            </select>
          </div>

          {/* 6. Categoría */}
          <div className="flex flex-col">
            <label className="mb-1 font-medium text-white">Categoría</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border rounded px-3 py-2"
            >
              <option value="">Sin categoría</option>
              <option value="Reunión">Reunión</option>
              <option value="Tarea">Tarea</option>
              <option value="Recordatorio">Recordatorio</option>
            </select>
          </div>

          {/* 7. Descripción */}
          <div className="flex flex-col">
            <label className="mb-1 font-medium text-white">Descripción</label>
            <textarea
              value={description}
              placeholder="Puedes agregar detalles aquí..."
              onChange={(e) => setDescription(e.target.value)}
              className="border rounded px-3 py-2 h-24 resize-none text-gray-700"
            />
          </div>

          {/* Botón Guardar */}
          <button
            type="submit"
            disabled={!canSave}
            className={`mt-4 py-2 rounded text-white transition-colors ${
              canSave
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Guardar
          </button>
        </form>
      </aside>
    </>
  );
}
