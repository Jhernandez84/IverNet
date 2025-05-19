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
  selectedDate?: string; // o string, según cómo lo uses
  crear?: boolean;
  refresh: number;
  setRefresh: Dispatch<SetStateAction<number>>;
  selectedTime?: string | null; // o string, según cómo lo uses
  evt_Id?: string | null;
  // eventDetails: EventType[] | null; // estoy pasando un valor como array
}

export interface EventType {
  evtId: "";
  evtCompanyId: "";
  evtUserId: "";
  evtStartDate: "";
  evtEndDate: "";
  evtStartTime: "";
  evtEndTime: "";
  evtDuration: "";
  evtTitle: "";
  evtDescription: "";
  evtAccessLink: "";
  evtLocation: "";
  evtCategory: "";
  evtAllDay: boolean | null;
  evtStatus: "";
}

export function OffCanvasRightEventForm({
  open,
  setOpen,
  selectedDate,
  crear,
  refresh,
  setRefresh,
  selectedTime,
  evt_Id,
}: // eventDetails,
OffCanvasProps) {
  console.log("Es crear evento?", crear, "Hora seleccionada ", selectedTime);
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    console.log(form);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!canSave) return;

    // Construye los timestamps combinando fecha + hora
    const startDateTime = new Date(`${form.evtStartDate}T${form.evtStartTime}`);
    const endDateTime = new Date(`${form.evtEndDate}T${form.evtEndTime}`);

    console.log("Fecha", startDateTime);

    // Inserción en Supabase
    const { data, error } = await supabase.from("events").insert([
      {
        company_id: form.evtCompanyId,
        user_id: form.evtUserId,
        title: form.evtTitle,
        description: form.evtDescription,
        location: form.evtLocation,
        category: form.evtCategory,
        start_date: startDateTime,
        end_date: endDateTime,
        duration_time: form.evtDuration,
        all_day: form.evtAllDay,
        access_link: form.evtAccessLink,
        evt_status: form.evtStatus,
      },
    ]);

    if (error) {
      console.error("Error al guardar evento:", error);
      // podrías mostrar una notificación de error aquí
    } else {
      console.log("Evento creado:", data);
      // limpia el formulario si quisieras

      // cierra el off-canvas
      setOpen(false);
      setRefresh((r) => r + 1);
    }
  };

  const { user, loading } = useUserSession();

  console.log("Fecha para el form:", selectedDate, "Evento ID", evt_Id);

  const [form, setForm] = useState({
    evtId: "", // Id del evento, único
    evtCompanyId: user?.company_id,
    evtUserId: user?.id,
    evtStartDate: selectedDate, // "YYYY-MM-DD"
    evtEndDate: selectedDate, // "YYYY-MM-DD"
    evtStartTime: selectedTime, // "YYYY-MM-DD"
    evtEndTime: selectedTime, // "YYYY-MM-DD"
    evtDuration: 0, // "YYYY-MM-DD"
    evtTitle: "",
    evtDescription: "",
    evtAccessLink: "",
    evtLocation: "",
    evtCategory: "",
    evtAllDay: false,
    evtStatus: "Activo",
  });

  useEffect(() => {
    if (user?.company_id) {
      setForm((prev) => ({
        ...prev,
        evtCompanyId: user.company_id,
      }));
    }
    if (user?.id) {
      setForm((prev) => ({
        ...prev,
        evtUserId: user.id,
      }));
    }
  }, [user]);

  useEffect(() => {
    if (selectedDate) {
      setForm((prev) => ({
        ...prev,
        evtStartDate: selectedDate,
        evtEndDate: selectedDate,
      }));
    }
  }, [selectedDate]);

  useEffect(() => {
    if (selectedTime) {
      setForm((prev) => ({
        ...prev,
        evtStartTime: selectedTime,
        evtEndTime: selectedTime,
      }));
    }
  }, [selectedTime]);

  // Validación de campos requeridos
  const canSave =
    form.evtTitle.trim() !== "" &&
    form.evtStartDate !== "" &&
    form.evtStartTime !== null;

  if (loading) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`bg-gray-800 fixed inset-0 bg-black bg-opacity-50 transition-opacity ${
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        } z-50`}
        onClick={() => {
          setOpen(false);
        }}
      />

      {/* Sidebar desde la derecha */}
      {/* Off-canvas */}
      <aside
        className={`fixed top-0 right-0 h-full w-80 bg-gray-700 text-gray-700 shadow-lg transform transition-transform ${
          open ? "translate-x-0" : "translate-x-full"
        } p-6 z-50`}
      >
        <div className="flex justify-between items-center mb-6">
          {crear === false ? (
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
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col text-white">
              <label className="mb-1 font-medium">Fecha Inicial</label>
              <input
                type="date"
                name="evtStartDate"
                required
                value={form.evtStartDate ?? ""}
                onChange={handleChange}
                className="border rounded px-3 py-2  text-gray-700"
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-1 font-medium text-white">
                Hora inicio *
              </label>
              <input
                type="time"
                name="evtStartTime"
                value={form.evtStartTime ?? ""}
                onChange={handleChange}
                className="border rounded px-3 py-2 text-gray-700"
              />
            </div>
          </div>
          {/* <div className="flex flex-col">
            <label className="mb-1 font-medium text-white">
              Duración del Evento
            </label>
            <input
              type="number"
              name="evtDuration"
              value={form.evtDuration}
              onChange={handleChange}
              className="border rounded px-3 py-2 text-gray-700"
            />
          </div> */}
          {/* {form.evtDuration > 0 ? ( */}
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col text-white">
              <label className="mb-1 font-medium">Fecha Final</label>
              <input
                type="date"
                name="evtEndDate"
                required
                value={form.evtEndDate}
                onChange={handleChange}
                className="border rounded px-3 py-2  text-gray-700"
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-1 font-medium text-white">Hora fin *</label>
              <input
                type="time"
                name="evtEndTime"
                value={form.evtEndTime ?? ""}
                onChange={handleChange}
                className="border rounded px-3 py-2 text-gray-800"
              />
            </div>
          </div>
          {/* ) : (
            []
          )} */}
          <div className="flex flex-col">
            <label className="mb-1 font-medium text-white ">Título *</label>
            <input
              type="text"
              name="evtTitle"
              placeholder="Nombre del evento..."
              value={form.evtTitle}
              onChange={handleChange}
              className="border rounded px-3 py-2 text-gray-700"
            />
          </div>
          {/* 5. Ubicación */}
          <div className="flex flex-col">
            <label className="mb-1 font-medium text-white">Ubicación</label>
            <select
              // value={location}
              onChange={handleChange}
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
              value={form.evtCategory}
              name="evtCategory"
              onChange={handleChange}
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
              value={form.evtDescription}
              name="evtDescription"
              placeholder="Puedes agregar detalles aquí..."
              onChange={handleChange}
              className="border rounded px-3 py-2 h-24 resize-none text-gray-700"
            />
          </div>
          {crear === false ? (
            <div className="grid grid-cols-2 gap-2 w-[100%]">
              <div>
                <button
                  type="submit"
                  className="mt-4 py-2 w-[100%] rounded text-white transition-colors bg-yellow-600 hover:bg-yellow-700"
                >
                  Actualizar
                </button>
              </div>
              <div>
                <button
                  type="submit"
                  className="mt-4 py-2 w-[100%] rounded text-white transition-colors bg-red-600 hover:bg-red-700"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 w-[100%]">
              <button
                type="submit"
                disabled={!canSave}
                className="mt-4 py-2 rounded text-white transition-colors bg-blue-600 hover:bg-blue-700"
              >
                Guardar
              </button>
            </div>
          )}
        </form>
      </aside>
    </>
  );
}
