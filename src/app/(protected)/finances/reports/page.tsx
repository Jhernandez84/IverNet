"use client";

import FinanzasTable from "../components/FinanzasTable";
import FinanceFilters from "../components/FinanceFilters";

export default function ReportesFinancieros() {
  return (
    <div className="p-2 bg-gray-900 h-[90vh]">
      <div className="pb-2">
        <FinanceFilters />
      </div>

      <FinanzasTable />
    </div>
  );
}
