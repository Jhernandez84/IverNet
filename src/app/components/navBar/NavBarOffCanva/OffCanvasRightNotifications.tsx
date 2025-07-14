import {
  Dispatch,
  SetStateAction,
  useState,
  FormEvent,
  useEffect,
} from "react";
import { supabase } from "@/app/utils/supabaseClients";
import { useUserSession } from "@/hooks/useUserSession";
import { useAnnouncements } from "@/hooks/useAnnouncements";

interface OffCanvasProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  // selectedDate?: string; // o string, según cómo lo uses
  crear?: boolean;
  // refresh: number;
  // setRefresh: Dispatch<SetStateAction<number>>;
  // selectedTime?: string | null; // o string, según cómo lo uses
  // evt_Id?: string | null;
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

export function OffCanvasRightNotifications({
  open,
  setOpen,
  // selectedDate,
  crear,
}: // refresh,
// setRefresh,
// selectedTime,
// evt_Id,
// eventDetails,
OffCanvasProps) {
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    // setForm({ ...form, [e.target.name]: e.target.value });
    // console.log(form);
  };

  // const { user, loading } = useUserSession();
  const { announcements, loading, refetch } = useAnnouncements();

  useEffect(() => {
    if (open) {
      refetch();
    }
  }, [open]);

  // if (loading) return;

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
        className={`
    fixed top-0 right-0 h-full w-[25vw] bg-gray-700 text-gray-700 shadow-lg
    transform transition-transform duration-300 ease-in-out
    ${open ? "translate-x-0" : "translate-x-full"}
    p-6 z-50
  `}
      >
        <div className="flex flex-col h-full">
          {/* Header fijo */}
          <div className="flex justify-between items-center pb-4 border-b border-gray-600 sticky top-0 bg-gray-700 z-10">
            <p className="text-xl font-bold text-white">Notificaciones</p>
            <button
              onClick={() => setOpen(false)}
              className="text-gray-300 text-2xl leading-none hover:text-white"
            >
              &times;
            </button>
          </div>

          {/* Contenido scrollable */}
          <div className="overflow-y-auto mt-4 pr-2 flex-1 space-y-3">
            {announcements.map((n) => (
              <div
                key={n.id}
                className="border p-3 rounded bg-gray-900 text-white shadow-sm"
              >
                <div className="font-semibold">
                  {n.message_type.toUpperCase()}
                </div>
                <p>{n.message}</p>
                {!n.read && (
                  <span className="text-sm text-yellow-400">🔔 Nuevo</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
}
