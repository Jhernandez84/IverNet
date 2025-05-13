// hooks/useCalendarEvents.ts
import { useState, useEffect } from "react";
import { supabase } from "@/app/utils/supabaseClients";

export interface CalendarEvent {
  date: string; // "YYYY-MM-DD"
  title: string;
  time?: string; // "10AM", "2PM", etc.
}

export function useCalendarEvents(refresh: number) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      // Ajusta los filtros si necesitas company_id o user_id
      const { data, error } = await supabase
        .from("events")
        .select("start_date, title")
        .order("start_date", { ascending: true });

      if (error) {
        setError(error.message);
      } else if (data) {
        const mapped = data.map((evt) => {
          const dt = new Date(evt.start_date);
          // formatear date
          const date = dt.toISOString().slice(0, 10);
          // calcular hora en AM/PM sin minutos
          const h = dt.getHours();
          const hour12 = h % 12 === 0 ? 12 : h % 12;
          const ampm = h >= 12 ? "PM" : "AM";
          return {
            date,
            title: evt.title,
            time: `${hour12}${ampm}`,
          };
        });
        setEvents(mapped);
      }

      setLoading(false);
    };

    fetchEvents();
  }, [refresh]);

  return { events, loading, error };
}
