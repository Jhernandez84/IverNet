// hooks/useCalendarEvents.ts
import { useState, useEffect } from "react";
import { supabase } from "@/app/utils/supabaseClients";

export interface CalendarEvent {
  evtId: string; // Id del evento, único
  evtCompanyId: string;
  evtUserId: string;
  evtStartDate: string; // "YYYY-MM-DD"
  evtEndDate: string; // "YYYY-MM-DD"
  evtStartTime: string; // "YYYY-MM-DD"
  evtEndTime: string; // "YYYY-MM-DD"
  evtDuration: string; // "YYYY-MM-DD"
  evtTitle: string;
  evtDescription: string;
  evtAccessLink: string;
  evtLocation: string;
  evtCategory: string;
  evtAllDay: boolean | null;
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
        .select("*")
        .order("start_date", { ascending: true });

      if (error) {
        setError(error.message);
      } else if (data) {
        const mapped = data.map((evt) => {
          const Startdt = new Date(evt.start_date);
          const Enddt = new Date(evt.end_date);
          // formatear date
          const Startdate = Startdt.toISOString().slice(0, 10);
          const EndDate = Enddt.toISOString().slice(0, 10);
          // calcular hora en AM/PM sin minutos
          const StartTime = `${Startdt.getHours()
            .toString()
            .padStart(2, "0")}:${Startdt.getMinutes()
            .toString()
            .padStart(2, "0")}`;
          const EndTime = `${Enddt.getHours()
            .toString()
            .padStart(2, "0")}:${Enddt.getMinutes()
            .toString()
            .padStart(2, "0")}`;
          const [startHourStr, startMinuteStr] = StartTime.split(":");
          const [endHourStr, endMinuteStr] = EndTime.split(":");

          const startHour = parseInt(startHourStr, 10);
          const endHour = parseInt(endHourStr, 10);

          const StartTimeHour12 = startHour % 12 === 0 ? 12 : startHour % 12;
          const EndTimeHour12 = endHour % 12 === 0 ? 12 : endHour % 12;

          const ampmStart = startHour >= 12 ? "PM" : "AM";
          const ampmEnd = endHour >= 12 ? "PM" : "AM";
          return {
            evtId: evt.id, // Id del evento, único
            evtCompanyId: evt.company_id,
            evtUserId: evt.user_id,
            evtStartDate: Startdate,
            evtEndDate: EndDate,
            evtStartTime: `${StartTimeHour12}:${startMinuteStr} ${ampmStart}`, //Pasa la hora como HH:MM:AM/PM
            evtEndTime: `${EndTimeHour12}:${endMinuteStr} ${ampmEnd}`, //Pasa la hora como HH:MM:AM/PM
            evtDuration: evt.duration_time,
            evtTitle: evt.title,
            evtDescription: evt.description,
            evtAccessLink: evt.access_link,
            evtLocation: evt.location,
            evtCategory: evt.category,
            evtAllDay: evt.all_day,
          };
        });
        setEvents(mapped);
      }

      setLoading(false);
    };

    fetchEvents();
  }, [refresh]);
  console.log(events);
  return { events, loading, error };
}
