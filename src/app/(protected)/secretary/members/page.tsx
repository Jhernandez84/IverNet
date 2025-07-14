// src/app/dashboard/page.tsx
"use client";
import DynamicTable from "@/app/components/dynamicTable/dyamicTable";
import { useChurchMembers } from "./useChurchMembers";
import { renameFields } from "@/app/components/dynamicTable/renameFields";

export default function Secretary() {
  const { members, loading, error } = useChurchMembers();

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error al obtener la información...</p>;

  const fieldMap = {
    first_name: "Nombres",
    last_name: "Ap. Paterno",
    second_last_name: "Ap. Materno",
    email: "Correo",
    rut: "rut",
    gender: "Genero",
    birth_date: "Fecha de Nac.",
    phone: "Contacto",
    church_role: "Rol",
  };

  const dataForTable = renameFields(members, fieldMap);

  return (
    <div className="bg-gray-900 p-2">
      {/* <h1 className="text-2xl font-bold">Listado de miembros de la iglesia</h1> */}
      <DynamicTable
        data={dataForTable}
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