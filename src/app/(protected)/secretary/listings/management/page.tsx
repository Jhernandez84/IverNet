"use client";
import InventarioManagerForm from "./forms";
import DynamicTable from "@/app/components/dynamicTable/dyamicTable";

export default function ListingManagement() {
  return (
    <div className="p-6">
      <div className="grid grid-cols-2">
        <div>
          <InventarioManagerForm />
        </div>
        <div>
          <DynamicTable
            data={[]}
            title="Plantilla de inventarios"
            rowsPerPage={7}
            actionButton={{
              label: "➕ Registrar Inventario",
              onClick: () => alert("click"),
            }}
          />
        </div>
      </div>
    </div>
  );
}
