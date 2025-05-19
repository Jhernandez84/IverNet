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
import { OffCanvasRightEventForm } from "./OffCanvasRightEventForm";

interface OffCanvasProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  openEventForm: boolean;
  setOpenEventForm: Dispatch<SetStateAction<boolean>>;
  date?: string | null; // o string, según cómo lo uses
  crear?: boolean;
  setTime: Dispatch<SetStateAction<string>>;
  // puedes añadir más props aquí
}

export function OffCanvasRightDateSelector({
  open,
  setOpen,
  openEventForm,
  setOpenEventForm,
  date,
  crear,
  setTime,
}: OffCanvasProps) {
  // const [eventDate, setEventDate] = useState<string>(date || "");
  console.log(date);
  const [timeSelected, setTimeSelected] = useState(false);

  // console.log(eventDate);

  const hours = Array.from({ length: 28 }, (_, i) => {
    const totalMinutes = 8 * 60 + i * 30;
    const hour = Math.floor(totalMinutes / 60);
    const minute = totalMinutes % 60;
    // const hour12 = hour % 12 === 0 ? 12 : hour % 12;
    const ampm = hour >= 12 ? "PM" : "AM";
    return `${hour.toString().padStart(2, "0")}:${minute
      .toString()
      .padStart(2, "0")}`;
  });

  return (
    <>
      {/* Backdrop */}
      <div
        className={`bg-gray-800 fixed inset-0 bg-black bg-opacity-50 transition-opacity ${
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        } z-40`}
        onClick={() => setOpen(true)}
      />

      {/* Sidebar desde la derecha */}
      {/* Off-canvas */}
      <aside
        className={`fixed top-0 right-0 h-full bg-gray-700 text-gray-700 shadow-lg transform transition-transform ${
          open ? "translate-x-0" : "translate-x-full"
        } p-6 z-40`}
      >
        <div>
          <div className="flex justify-between items-center mb-6">
            <h5 className="text-xl font-bold text-white">Horarios {date}</h5>

            <button
              onClick={() => {
                setTimeSelected(false);
                setOpen(false);
              }}
              className="text-gray-500 text-2xl leading-none"
            >
              &times;
            </button>
          </div>
          <div className="h-[90vh]">
            <div className="h-[88vh] overflow-y-auto">
              {hours.map((hour) => (
                <div
                  key={hour}
                  className="grid grid-cols-8 border border-gray-600 bg-gray-800 cursor-pointer"
                  onClick={() => {
                    setTimeSelected(true),
                      setTime(hour),
                      setOpenEventForm(true);
                  }}
                >
                  {/* columna de la hora */}
                  <div className="p-2 text-xs text-white h-[50px] cursor-pointer">
                    {`${hour}:00`}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
