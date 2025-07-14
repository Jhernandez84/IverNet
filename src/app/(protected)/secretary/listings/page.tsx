"use client";

import DynamicTable from "@/app/components/dynamicTable/dyamicTable";
import { renameFields } from "@/app/components/dynamicTable/renameFields";
import { useState, useEffect } from "react";
import InventarioForm from "./component/forms";
import ModalBase from "./component/modal";
import { useUserSession } from "@/hooks/useUserSession";
import { supabase } from "@/app/utils/supabaseClients";

// src/app/dashboard/page.tsx
type RawInventoryRecord = {
  id: string;
  nombre: string;
  descripcion: string;
  fecha_ingreso: string;
  quantity: string;
  category_id: string | { category_name: string };
  subCategoryID: string | { subcategory_name: string };
};

export default function ListingPage() {
  const [modal, setModal] = useState(false);
  const { user } = useUserSession();

  const [records, setRecords] = useState<
    {
      id: string;
      nombre: string;
      descripcion: string;
      fecha_ingreso: string;
      quantity: string;
      category_id: string;
      category_name: string;
      subcategory_id: string;
      subcategory_name: string;
    }[]
  >([]);

  const modalHandler = () => {
    modal === true ? setModal(false) : setModal(true);
  };

  const fetchRecords = async () => {
    if (!user) return;

    let query = supabase
      .from("church_inventories")
      .select(
        `
      id,
      nombre,
      descripcion,
      fecha_ingreso,
      quantity,
      category_id (
        id,
        category_name
      ),
      subCategoryID (
        id,
        subcategory_name
      ),
      sede_id(nombre)
    `
      )
      .eq("company_id", user.company_id);

    if (user?.scopedBySede === true) {
      query = query.eq("sede_id", user.sede_id);
    }

    query = query.order("fecha_ingreso", { ascending: true });

    const { data, error } = (await query) as unknown as {
      data: RawInventoryRecord[];
      error: any;
    };

    if (!error && data) {
      const transformed = data.map((rec) => ({
        id: rec.id,
        nombre: rec.nombre,
        descripcion: rec.descripcion,
        fecha_ingreso: rec.fecha_ingreso,
        quantity: rec.quantity,
        category_id: (rec.category_id as any)?.id ?? "",
        category_name: (rec.category_id as any)?.category_name ?? "—",
        subcategory_id: (rec.subCategoryID as any)?.id ?? "",
        subcategory_name: (rec.subCategoryID as any)?.subcategory_name ?? "—",
      }));
      setRecords(transformed);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [user]);

  const fieldMap = {
    id: "rec_ID",
    category_name: "Categoría",
    subcategory_name: "SubCategoría",
    nombre: "Nombre",
    descripcion: "Descripción",
    quantity: "Cantidad",
  };

  const dataForTable = renameFields(records, fieldMap);

  return (
    <>
      <div className="bg-gray-900 p-2">
        <ModalBase
          open={modal}
          onClose={modalHandler}
          title="Ingreso de nuevo Inventario"
          children={<InventarioForm />}
        />
        {/* <h1 className="text-2xl font-bold">Panel principal de inventarios </h1> */}
        <DynamicTable
          data={dataForTable}
          title="Plantilla de inventarios"
          rowsPerPage={10}
          actionButton={{
            label: "➕ Registrar Inventario",
            onClick: () => modalHandler(),
          }}
        />
      </div>
    </>
  );
}
