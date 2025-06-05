import {
  Dispatch,
  SetStateAction,
  useState,
  FormEvent,
  useEffect,
} from "react";
import { supabase } from "@/app/utils/supabaseClients";
import { useUserSession } from "@/hooks/useUserSession";

interface OffCanvasProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  // selectedDate?: string; // o string, según cómo lo uses
  crear?: boolean;
  // refresh: number;
  // setRefresh: Dispatch<SetStateAction<number>>;
  // selectedTime?: string | null; // o string, según cómo lo uses
  // evt_Id?: string | null;
  // eventDetails: EventType[] | null; // estoy pasando un valor como array
}

export interface EventType {
  evtId: "";
  evtCompanyId: "";
  evtUserId: "";
  evtStartDate: "";
  evtEndDate: "";
  evtStartTime: "";
  evtEndTime: "";
  evtDuration: "";
  evtTitle: "";
  evtDescription: "";
  evtAccessLink: "";
  evtLocation: "";
  evtCategory: "";
  evtAllDay: boolean | null;
  evtStatus: "";
}

export function OffCanvaRigthOrder({
  open,
  setOpen,
  // selectedDate,
  crear,
}: // refresh,
// setRefresh,
// selectedTime,
// evt_Id,
// eventDetails,
OffCanvasProps) {
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    // setForm({ ...form, [e.target.name]: e.target.value });
    // console.log(form);
  };

  // Ejemplo de array con pedidos ficticios para renderizar en HTML
  const pedidosFicticios = [
    {
      id: "order_001",
      cliente: "Juan Pérez",
      company_id: "company_123",
      sede_id: "sede_001",
      status: "Pendiente",
      created_at: "2025-06-03T10:15:00Z",
      total: 11500,
      items: [
        {
          productId: "prod_01",
          nombre: "Café Latte",
          cantidad: 2,
          unitPrice: 2500,
          subtotal: 5000,
          status: "Pendiente",
        },
        {
          productId: "prod_05",
          nombre: "Tostada Integral",
          cantidad: 1,
          unitPrice: 3000,
          subtotal: 3000,
          status: "Pendiente",
        },
        {
          productId: "prod_09",
          nombre: "Jugo de Naranja",
          cantidad: 1,
          unitPrice: 3500,
          subtotal: 3500,
          status: "Pendiente",
        },
      ],
    },
    {
      id: "order_002",
      cliente: "María González",
      company_id: "company_123",
      sede_id: "sede_001",
      status: "En Proceso",
      created_at: "2025-06-03T10:30:00Z",
      total: 8000,
      items: [
        {
          productId: "prod_02",
          nombre: "Espresso Doble",
          cantidad: 1,
          unitPrice: 3000,
          subtotal: 3000,
          status: "En Proceso",
        },
        {
          productId: "prod_07",
          nombre: "Pan con Palta",
          cantidad: 1,
          unitPrice: 5000,
          subtotal: 5000,
          status: "En Proceso",
        },
      ],
    },
    {
      id: "order_003",
      cliente: "Carlos Ramírez",
      company_id: "company_123",
      sede_id: "sede_001",
      status: "Listo",
      created_at: "2025-06-03T10:45:00Z",
      total: 6500,
      items: [
        {
          productId: "prod_03",
          nombre: "Capuchino",
          cantidad: 1,
          unitPrice: 3000,
          subtotal: 3000,
          status: "Listo",
        },
        {
          productId: "prod_10",
          nombre: "Muffin de Chocolate",
          cantidad: 1,
          unitPrice: 3500,
          subtotal: 3500,
          status: "Listo",
        },
      ],
    },
  ];

  // Ejemplo de cómo podrías renderizarlo en HTML (sin framework)

  const { user, loading } = useUserSession();

  return (
    <>
      {/* Backdrop */}
      <div
        className={`bg-gray-800 fixed inset-0 bg-black bg-opacity-50 transition-opacity ${
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        } z-50`}
        onClick={() => {
          setOpen(false);
        }}
      />

      {/* Sidebar desde la derecha */}
      {/* Off-canvas */}
      <aside
        className={`
    fixed top-0 right-0 h-full w-[35vw] bg-gray-700 text-gray-700 shadow-lg
    transform transition-transform duration-300 ease-in-out
    ${open ? "translate-x-0" : "translate-x-full"}
    p-6 z-50
  `}
      >
        <div className="flex justify-between items-center mb-6">
          <p className="text-xl font-bold text-white">Detalle del pedido</p>
          <button
            onClick={() => setOpen(false)}
            className="text-gray-600 text-2xl leading-none"
          >
            &times;
          </button>
        </div>
        <section className="grid grid-template-rows gap-4">
          {pedidosFicticios.map((order) => {
            return (
              <div className="h-[70px] w-full grid grid-cols-[20%_60%_20%] bg-white rounded shadow overflow-hidden">
                {/* Primera columna: imagen */}
                <div className="p-2 h-[70px] w-[70px] rounded">
                  <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShdukLxuTXkJ8HUsVDhoXStlwiv52EO7Ba5g&s"
                    alt="Producto"
                    className="w-full h-full object-cover rounded"
                  />
                </div>

                {/* Segunda columna: descripción y totales */}
                <div className="px-2 flex flex-col justify-center">
                  <p className="text-sm font-medium">Nombre del Producto</p>
                  <p className="text-xs text-gray-600">
                    Descripción breve del producto
                  </p>
                  <p className="text-sm font-semibold mt-1">Total: $3.500</p>
                </div>

                {/* Tercera columna: manipular cantidad */}
                <div className="flex items-center justify-center bg-gray-100">
                  <button className="px-2 py-1 bg-red-500 text-white rounded-l hover:bg-red-600">
                    −
                  </button>
                  <span className="px-2 text-sm">1</span>
                  <button className="px-2 py-1 bg-green-500 text-white rounded-r hover:bg-green-600">
                    +
                  </button>
                </div>
              </div>
            );
          })}
        </section>

        <button className="mt-4 p-2 text-white bg-green-700 hover:bg-green-600 xt-md leading-non w-full rounded">
          Pagar
        </button>
      </aside>
    </>
  );
}
