// src/app/dashboard/page.tsx
"use client";
import DynamicTable from "@/app/components/dynamicTable/dyamicTable";

export default function Secretary() {
  return (
    <div className="bg-gray-900 p-2">
      {/* <h1 className="text-2xl font-bold">Listado de miembros de la iglesia</h1> */}
      <DynamicTable
        data={[]}
        title="Listado de miembros"
        rowsPerPage={20}
        actionButton={{
          label: "➕ Agregar nuevo miembro",
          onClick: () => alert("Nueva acción ejecutada"),
        }}
      />
    </div>
  );
}
