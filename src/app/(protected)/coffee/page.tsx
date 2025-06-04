"use client";
// /pages/orders/ingreso.tsx

import { useState, useEffect } from "react";
import { supabase } from "@/app/utils/supabaseClients";
import { OffCanvaRigthOrder } from "./OffCanvaMenu/OffCanvasOrderDetails";

type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
};

type OrderItem = {
  productId: string;
  quantity: number;
  notes?: string;
};

export default function IngresoPedido() {
  const [productos, setProductos] = useState<Product[]>([]);
  const [selectedItems, setSelectedItems] = useState<OrderItem[]>([]);
  const [cliente, setCliente] = useState<string>("Anónimo");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [openMenu, setOpenMenu] = useState(false);

  // 1. Cargar lista de productos desde Supabase
  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("category", { ascending: true });
      if (error) {
        console.error("Error cargando productos:", error.message);
      } else {
        setProductos(data || []);
      }
    }
    fetchProducts();
  }, []);

  // 2. Función para agregar un ítem al pedido
  const agregarItem = (productId: string) => {
    // Si ya existe, aumentar cantidad; si no, insertar
    setSelectedItems((prev) => {
      const idx = prev.findIndex((item) => item.productId === productId);
      if (idx !== -1) {
        const copia = [...prev];
        copia[idx].quantity += 1;
        return copia;
      }
      return [...prev, { productId, quantity: 1 }];
    });
  };

  // 3. Función para quitar ítem o disminuir cantidad
  const quitarItem = (productId: string) => {
    setSelectedItems((prev) => {
      const idx = prev.findIndex((item) => item.productId === productId);
      if (idx === -1) return prev;
      const copia = [...prev];
      if (copia[idx].quantity > 1) {
        copia[idx].quantity -= 1;
        return copia;
      }
      // Si solo 1, eliminar completamente
      return copia.filter((item) => item.productId !== productId);
    });
  };

  // 4. Enviar pedido a Supabase
  const handleSubmit = async () => {
    if (selectedItems.length === 0) {
      setErrorMsg("Agrega al menos un producto al pedido.");
      return;
    }
    setIsSubmitting(true);
    setErrorMsg(null);

    // 4.1 Insertar en tabla `orders`
    const { data: orderData, error: orderError } = await supabase
      .from("orders")
      .insert([{ cliente, status: "Pendiente", created_at: new Date() }])
      .single();

    if (orderError || !orderData) {
      setErrorMsg("Error creando el pedido. Inténtalo de nuevo.");
      setIsSubmitting(false);
      return;
    }

    // 4.2 Insertar en `order_items` cada ítem asociado al pedido
    const orderItemsPayload = selectedItems.map((it) => ({
      order_id: orderData,
      product_id: it.productId,
      quantity: it.quantity,
      notes: it.notes || "",
    }));
    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItemsPayload);
    if (itemsError) {
      setErrorMsg("Error añadiendo ítems al pedido.");
      setIsSubmitting(false);
      return;
    }

    // 4.3 Resetear formulario
    setSelectedItems([]);
    setCliente("Anónimo");
    setIsSubmitting(false);
    alert("Pedido creado con éxito. ID: " + orderData);
  };

  const productosTest = [
    {
      id: "1",
      name: "p1",
      category: "p2",
      price: 1,
    },
    {
      id: "1",
      name: "p1",
      category: "p2",
      price: 1,
    },
    {
      id: "1",
      name: "p1",
      category: "p2",
      price: 1,
    },
    {
      id: "1",
      name: "p1",
      category: "p2",
      price: 1,
    },
    {
      id: "1",
      name: "p1",
      category: "p2",
      price: 1,
    },
    {
      id: "1",
      name: "p1",
      category: "p2",
      price: 1,
    },
    {
      id: "1",
      name: "p1",
      category: "p2",
      price: 1,
    },
  ];

  // 5. Renderizado
  return (
    <>
      <OffCanvaRigthOrder open={openMenu} setOpen={setOpenMenu} crear={false} />

      <div>
        <div className="h-[93vh] w-full flex flex-col bg-gray-700">
          <div className="flex w-full  bg-gray-700">
            <div className="w-[90vw] p-4 overflow-x-auto bg-gray-700">
              <div className="flex space-x-4">
                <button className="px-4 py-2 bg-blue-500 w-[140px] text-white rounded">
                  Bebidas Calientes
                </button>
                <button className="px-4 py-2 bg-blue-500 text-white rounded">
                  Bebidas Frías
                </button>
                <button className="px-4 py-2 bg-blue-500 text-white rounded">
                  Snacks
                </button>
                <button className="px-4 py-2 bg-blue-500 text-white rounded">
                  Postres
                </button>
                <button className="px-4 py-2 bg-blue-500 text-white rounded">
                  Bebidas
                </button>
                <button className="px-4 py-2 bg-blue-500 text-white rounded">
                  Snacks
                </button>
                <button className="px-4 py-2 bg-blue-500 text-white rounded">
                  Postres
                </button>
                <button className="px-4 py-2 bg-blue-500 text-white rounded">
                  Bebidas Calientes
                </button>
                <button className="px-4 py-2 bg-blue-500 text-white rounded">
                  Bebidas Frías
                </button>
                <button className="px-4 py-2 bg-blue-500 text-white rounded">
                  Snacks
                </button>
                <button className="px-4 py-2 bg-blue-500 text-white rounded">
                  Postres
                </button>
              </div>
            </div>
            <div className="w-[10vw] p-4 grid grid-cols rounded border-white">
              {/* <button className="flex flex-col items-center bg-green-600 rounded w-[90px]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="m4.5 12.75 6 6 9-13.5"
                  />
                </svg>

                <span className="text-sm mt-1">Pagar</span>
              </button> */}
              <button
                className="flex flex-col items-center bg-green-600 rounded w-[90px]"
                onClick={() => setOpenMenu(true)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                  />
                </svg>
                <span className="text-sm mt-1">Pedido</span>
              </button>
            </div>
          </div>

          <div className="w-full h-[70%] p-4 overflow-y-auto">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {productosTest.map((prod) => (
                <div
                  key={prod.id}
                  className="border rounded-lg p-4 flex flex-col items-center hover:shadow-lg cursor-pointer"
                >
                  <div>
                    <p className="font-medium">{prod.name}</p>
                    <p className="text-sm text-gray-600">{prod.category}</p>
                    <p className="text-lg font-bold">
                      ${prod.price.toFixed(0)}
                    </p>
                  </div>
                  <div className="flex flex-col items-center space-y-1">
                    <button
                      onClick={() => agregarItem(prod.id)}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                    >
                      +
                    </button>
                    <button
                      onClick={() => quitarItem(prod.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      −
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
