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
  { date: "2022-01-03", title: "Design review", time: "10AM" },
  { date: "2022-01-03", title: "Sales meeting", time: "2PM" },
  { date: "2022-01-07", title: "Date night", time: "6PM" },
  { date: "2022-01-12", title: "Sam's birthday party", time: "2PM" },
  { date: "2022-01-22", title: "Maple syrup museum", time: "3PM" },
  { date: "2022-01-22", title: "Hockey game", time: "7PM" },
];

export default function MonthlyCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const header = () => (
    <div className="flex justify-between items-center px-4 py-2 border-b">
      <div className="text-xl font-bold">
        {format(currentMonth, "MMMM yyyy")}
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="px-2 py-1 bg-gray-100 rounded hover:bg-gray-200"
        >
          &lt;
        </button>
        <button
          onClick={() => setCurrentMonth(new Date())}
          className="px-2 py-1 bg-gray-100 rounded hover:bg-gray-200"
        >
          Today
        </button>
        <button
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="px-2 py-1 bg-gray-100 rounded hover:bg-gray-200"
        >
          &gt;
        </button>
        <button className="ml-2 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 text-sm">
          Add event
        </button>
      </div>
    </div>
  );

  const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const renderDays = () => (
    <div className="grid grid-cols-7 text-sm text-center border-b bg-gray-50">
      {weekdays.map((day) => (
        <div key={day} className="py-2 font-medium text-gray-600">
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
            className={`h-32 border p-1 align-top text-left ${
              !isSameMonth(day, monthStart) ? "bg-gray-50 text-gray-400" : ""
            }`}
          >
            <div
              className={`text-xs font-semibold mb-1 ${
                isSameDay(day, new Date())
                  ? "bg-blue-600 text-white w-6 h-6 rounded-full text-center"
                  : ""
              }`}
            >
              {format(day, "d")}
            </div>
            <div className="space-y-1">
              {thisDayEvents.map((event, idx) => (
                <div key={idx} className="text-xs truncate font-medium">
                  {event.title}{" "}
                  {event.time && (
                    <span className="text-xs text-gray-500">{event.time}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div key={day.toISOString()} className="grid grid-cols-7">
          {days}
        </div>
      );
      days = [];
    }

    return <div>{rows}</div>;
  };

  return (
    <div className="border rounded shadow overflow-hidden">
      {header()}
      {renderDays()}
      {renderCells()}
    </div>
  );
}
