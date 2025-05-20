"use client";

import { useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addMonths,
  addWeeks,
  subMonths,
  isSameMonth,
  isSameDay,
} from "date-fns";
import { addDays } from "date-fns/addDays";
import {
  EventType,
  OffCanvasRightEventForm,
} from "../OffCanva/OffCanvasRightEventForm";
import { OffCanvasRightTimeSelector } from "../OffCanva/OffCanvaRightTimeSelector";
import { useCalendarEvents } from "./useCalendarEvents";

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

type ViewMode = "month" | "week";

export default function MonthlyCalendar() {
  const [refresh, setRefresh] = useState(0);
  const { events, loading } = useCalendarEvents(refresh);

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>("month");

  const [timeSelected, setIsTimeSelected] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [evt_Id, setEvtId] = useState<string>("");

  const [openTimeSelector, setOpenTimeSelector] = useState(false); // OffCanvasRightDateSelector
  const [openEventForm, setOpenEventForm] = useState(false); // OffCanvasRightEventForm
  const [createEvent, setCreateEvent] = useState(false);

  const createNewEvent = (
    val: any,
    editEvent: boolean
    // eDetails: EventType
  ) => {
    setCreateEvent(editEvent);
    setSelectedDate(val);
    setOpenEventForm(true);
    console.log(editEvent, "Detalle del Evento:");
  };

  const createNewEventTime = (val: any, editEvent: boolean) => {
    setSelectedDate(val);
    Appointments(selectedDate);
    setCreateEvent(editEvent);
    setOpenTimeSelector(true);
  };

  const next = () => {
    setCurrentMonth(
      viewMode === "month"
        ? addMonths(currentMonth, 1)
        : addWeeks(currentMonth, 1)
    );
  };
  const prev = () => {
    setCurrentMonth(
      viewMode === "month"
        ? addMonths(currentMonth, -1)
        : addWeeks(currentMonth, -1)
    );
  };

  const Appointments = (selectedDate: string): string[] => {
    console.log("Fecha seleccionada:", selectedDate);
    const appointmentsSlots: string[] = [];

    events
      .filter((ev) => {
        console.log("Fecha en calendario", ev.evtStartDate);
        return ev.evtStartDate === selectedDate;
      })
      .forEach((ev) => {
        if (ev.evtStartTime) {
          appointmentsSlots.push(ev.evtStartTime); // ej. "14:00"
        }
      });
    // console.log(appointmentsSlots);
    return appointmentsSlots.sort();
  };

  const header = () => (
    <div className="flex justify-between items-center px-4 py-2 bg-gray-800 border-b border-gray-700">
      <div className="w-[170px]"></div>
      <div className="flex justify-between items-center bg-gray-800 w-[300px]">
        <button
          onClick={prev}
          className="bg-blue-600 w-[30px] px-3 py-1 rounded"
        >
          ‹
        </button>
        <h2 className="text-md rounded px-3 py-1 bg-blue-600">
          {viewMode === "month"
            ? format(currentMonth, "MMMM yyyy")
            : `${format(
                startOfWeek(currentMonth, { weekStartsOn: 1 }),
                "d MMM"
              )} - ${format(
                endOfWeek(currentMonth, { weekStartsOn: 1 }),
                "d MMM yyyy"
              )}`}
        </h2>
        <button
          onClick={next}
          className="bg-blue-600 w-[30px] px-3 py-1 rounded"
        >
          ›
        </button>
      </div>
      <div>
        <button
          className={`px-3 py-1 mr-2 rounded ${
            viewMode === "month"
              ? "bg-blue-600 text-white"
              : "rounded bg-gray-900"
          }`}
          onClick={() => setViewMode("month")}
        >
          Mes
        </button>
        <button
          className={`px-3 py-1 rounded ${
            viewMode === "week" ? "bg-blue-600 text-white" : "bg-gray-900"
          }`}
          onClick={() => setViewMode("week")}
        >
          Semana
        </button>
      </div>
      <OffCanvasRightTimeSelector
        open={openTimeSelector}
        setOpen={setOpenTimeSelector}
        openEventForm={openEventForm}
        setOpenEventForm={setOpenEventForm}
        date={selectedDate}
        setTime={setSelectedTime}
        crear={createEvent}
      />
      <OffCanvasRightEventForm
        open={openEventForm}
        setOpen={setOpenEventForm}
        selectedDate={selectedDate}
        crear={createEvent}
        refresh={refresh}
        setRefresh={setRefresh}
        selectedTime={selectedTime}
        evt_Id={evt_Id}
      />
    </div>
  );

  const weekdays = [
    "Horarios",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
    "Domingo",
  ];

  const renderDays = () => (
    <div className="grid grid-cols-8 text-sm text-center bg-gray-600 text-white">
      {weekdays.map((day) => (
        <div key={day} className="py-2 font-medium text-gray-100">
          {day}
        </div>
      ))}
    </div>
  );

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const formattedDate = format(day, "yyyy-MM-dd");
        const thisDayEvents = events.filter(
          (event) => event.evtStartDate === formattedDate
        );

        days.push(
          <div
            key={day.toISOString()}
            onClick={
              isSameMonth(day, monthStart)
                ? () => createNewEventTime(formattedDate, true)
                : undefined
            }
            className={`border border-gray-700 p-1 align-top text-left ${
              rows.length > 5 ? "h-28" : "h-28"
            } ${
              !isSameMonth(day, monthStart)
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-gray-800 text-white cursor-pointer"
            }`}
          >
            <div
              className={`text-xs font-semibold mb-1 ${
                isSameDay(day, new Date())
                  ? "bg-blue-800 rounded-full text-white w-6 h-5 text-center"
                  : ""
              }`}
            >
              {format(day, "d")}
            </div>
            <div className="space-y-1">
              {thisDayEvents.map((event, idx) => (
                <div
                  key={event.evtId}
                  className="text-xs truncate font-medium hover:bg-sky-600 rounded-lg p-1"
                  onClick={(e) => {
                    e.stopPropagation(); // ← evita que suba al padre
                    createNewEvent(formattedDate, false);
                    setEvtId(event.evtId);
                  }}
                >
                  {event.evtStartTime && <span>{event.evtStartTime}</span>}{" "}
                  {event.evtTitle}
                </div>
              ))}
            </div>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <>
          <div key={day.toISOString()} className="grid grid-cols-7 bg-gray-600">
            {days}
          </div>
        </>
      );
      days = [];
    }
    // console.log(rows.length);
    return (
      <div>
        {renderDays()}
        {rows}
      </div>
    );
  };

  const renderWeek = () => {
    const weekStart = startOfWeek(currentMonth, { weekStartsOn: 1 });

    return (
      <div className="h-[78vh] rounded">
        {renderDays()}
        <div className="h-[78vh] overflow-y-auto">
          {hours.map((hour) => (
            <div
              key={hour}
              className="grid grid-cols-8 border border-gray-600 bg-gray-800"
            >
              {/* columna de la hora */}
              <div className="p-2 text-xs text-white h-[70px]">
                {`${hour}:00`}
              </div>

              {/* celdas para cada día */}
              {Array.from({ length: 7 }).map((_, i) => {
                const day = addDays(weekStart, i);
                const dateString = format(day, "yyyy-MM-dd");
                const eventsAtHour = events.filter((ev) => {
                  if (!ev.evtStartTime) return false;
                  const num = parseInt(ev.evtStartTime, 0);
                  const isPM = ev.evtStartTime.toUpperCase().includes("PM");
                  const evHour =
                    isPM && num < 12 ? num + 12 : num === 12 && !isPM ? 0 : num;
                  console.log(
                    ev.evtStartDate,
                    dateString,
                    ev.evtStartTime,
                    hour
                  );
                  return (
                    ev.evtStartDate === dateString && ev.evtStartTime === hour
                  );
                });

                // Handler unificado: si click en celda, creas evento nuevo (isExisting = false)
                // Si click en un evento, creas con isExisting = true
                return (
                  <div
                    key={i}
                    className="p-1 border-l border-gray-600 relative cursor-pointer bg-gray-800"
                    onClick={() => {
                      createNewEvent(dateString, true), setEvtId("");
                    }}
                  >
                    {eventsAtHour.map((ev, idx) => (
                      <div
                        key={ev.evtId}
                        className="absolute w-[90%] m-2 left-0 bg-sky-600 text-xs p-1 rounded mb-1 truncate"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEvtId(ev.evtId);
                          createNewEvent(dateString, false);
                        }}
                      >
                        {ev.evtTitle}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (loading) return <p>Cargando eventos…</p>;

  // console.log(events);

  return (
    <div className="rounded shadow h-[88vh]">
      {header()}
      {viewMode === "week" ? renderWeek() : <>{renderCells()}</>}
    </div>
  );
}
