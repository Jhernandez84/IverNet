// src/app/dashboard/page.tsx
import MonthlyCalendar from "../../components/calendar/page";
export default function Calendar() {
  return (
    <div className="p-2 bg-gray-900">
      {/* <h1 className="text-2xl font-bold">Panel Principal (Calendar)</h1> */}
      <MonthlyCalendar />
    </div>
  );
}
