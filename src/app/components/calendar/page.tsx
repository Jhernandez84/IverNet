"use client";

import { useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
} from "date-fns";
import { addDays } from "date-fns/addDays";

interface CalendarEvent {
  date: string; // ISO format: yyyy-MM-dd
  title: string;
  time?: string;
}

const events: CalendarEvent[] = [
  { date: "2025-05-03", title: "Design review", time: "10AM" },
  { date: "2025-05-03", title: "Sales meeting", time: "2PM" },
  { date: "2025-05-07", title: "Date night", time: "6PM" },
  { date: "2025-05-12", title: "Sam's birthday party", time: "2PM" },
  { date: "2025-05-22", title: "Maple syrup museum", time: "3PM" },
  { date: "2025-05-22", title: "Hockey game", time: "7PM" },
];

export default function MonthlyCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const header = () => (
    <div className="flex justify-between items-center px-4 py-2 bg-gray-800 border-b border-gray-700">
      <div className="text-xl font-bold">
        {format(currentMonth, "MMMM yyyy")}
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="px-2 py-1 bg-gray-900 rounded hover:bg-gray-900"
        >
          &lt;
        </button>
        <button
          onClick={() => setCurrentMonth(new Date())}
          className="px-2 py-1 bg-gray-900 rounded hover:bg-gray-900"
        >
          Today
        </button>
        <button
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="px-2 py-1 bg-gray-900 rounded hover:bg-gray-900"
        >
          &gt;
        </button>
        <button className="ml-2 px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-700 text-sm">
          + Nuevo Evento
        </button>
      </div>
    </div>
  );

  const weekdays = [
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
    "Domingo",
  ];

  const renderDays = () => (
    <div className="grid grid-cols-7 text-sm text-center bg-gray-800 text-white ">
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
          (event) => event.date === formattedDate
        );

        days.push(
          <div
            key={day.toISOString()}
            onClick={() => alert("Nuevo Evento")}
            className={`border border-gray-700 p-1 align-top text-left ${
              rows.length === 5 ? "h-16" : "h-28"
            } ${
              !isSameMonth(day, monthStart)
                ? "bg-gray-300 text-gray-600"
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
                  key={idx}
                  className="text-xs truncate font-medium"
                  onClick={() => alert("hiciste click")}
                >
                  {event.title}{" "}
                  {event.time && (
                    <span className="text-xs text-white">{event.time}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div key={day.toISOString()} className="grid grid-cols-7 bg-gray-600">
          {days}
        </div>
      );
      days = [];
    }
    console.log(rows.length);
    return <div>{rows}</div>;
  };

  return (
    <div className="rounded shadow overflow-hidden h-[90vh]">
      {header()}
      {renderDays()}
      {renderCells()}
    </div>
  );
}
