"use client";
// /pages/orders/ingreso.tsx

import { useState, useEffect, ReactElement } from "react";
import { supabase } from "@/app/utils/supabaseClients";
import { OffCanvaRigthOrder } from "./OffCanvaMenu/OffCanvasOrderDetails";
import {
  FaCoffee,
  FaUtensils,
  FaSoap,
  FaIceCream,
  FaHamburger,
  FaUtensilSpoon,
  FaDrumstickBite,
  FaGlassMartiniAlt,
} from "react-icons/fa";
import { IconType } from "react-icons";
import { rootTaskDispose } from "next/dist/build/swc/generated-native";

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

  type Category = {
    id: string;
    title: string;
    subtitle: string;
    icon?: IconType;
  };

  const categories: Category[] = [
    {
      id: "breakfast",
      title: "Breakfast",
      subtitle: "12 Menú In Stock",
      icon: FaCoffee,
    },
    {
      id: "lunch",
      title: "Lunch",
      subtitle: "12 Menú In Stock",
      icon: FaUtensils,
    },
    {
      id: "dinner",
      title: "Dinner",
      subtitle: "12 Menú In Stock",
      icon: FaUtensils,
    },
    {
      id: "soup",
      title: "Soup",
      subtitle: "12 Menú In Stock",
      icon: FaSoap,
    },
    {
      id: "breakfast",
      title: "Breakfast",
      subtitle: "12 Menú In Stock",
      icon: FaCoffee,
    },
    {
      id: "lunch",
      title: "Lunch",
      subtitle: "12 Menú In Stock",
      icon: FaUtensils,
    },
    {
      id: "dinner",
      title: "Dinner",
      subtitle: "12 Menú In Stock",
      icon: FaUtensils,
    },
    {
      id: "soup",
      title: "Soup",
      subtitle: "12 Menú In Stock",
      icon: FaSoap,
    },
    {
      id: "breakfast",
      title: "Breakfast",
      subtitle: "12 Menú In Stock",
      icon: FaCoffee,
    },
    {
      id: "lunch",
      title: "Lunch",
      subtitle: "12 Menú In Stock",
      icon: FaUtensils,
    },
    {
      id: "dinner",
      title: "Dinner",
      subtitle: "12 Menú In Stock",
      icon: FaUtensils,
    },
    {
      id: "soup",
      title: "Soup",
      subtitle: "12 Menú In Stock",
      icon: FaSoap,
    },
  ];

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
  const [selected, setSelected] = useState(false);

  const productosTest = [
    {
      id: "1",
      name: "Mentitas",
      category: "Mentitas verdes",
      price: 350,
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
      price: 350,
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
      name: "Mentitas",
      category: "Mentitas verdes",
      price: 350,
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
      price: 350,
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
      name: "Mentitas",
      category: "Mentitas verdes",
      price: 350,
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
      price: 350,
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
      name: "Mentitas",
      category: "Mentitas verdes",
      price: 350,
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
      price: 350,
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
      name: "Mentitas",
      category: "Mentitas verdes",
      price: 350,
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
      price: 350,
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
        {/* Contenedor del componente */}
        <div className="grid grid-rows-[15%_85%] h-[93vh] w-full bg-gray-700">
          <div className="grid grid-cols-[90%_10%] h-[70px] pt-4">
            <div className="grid grid-cols-8 overflow-y-auto gap-4 pl-6 p-2 h-[120px]">
              {categories.map((cat) => {
                return (
                  <div
                    key={cat.id}
                    className={`w-[120px] items-center px-2 rounded-lg cursor-pointer ${
                      selected
                        ? "bg-blue-500 text-white"
                        : "bg-white text-gray-700 border border-gray-200"
                    }`}
                  >
                    {/* <Icon /> */}
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{cat.title}</span>
                      <span className="text-xs">{cat.subtitle}</span>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="rounded-lg p-2">
              <button
                className="flex flex-col items-center justify-center bg-green-600 rounded-lg h-[100%] w-[120px]"
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
                <span className="text-sm mt-1">$Monto</span>
              </button>
            </div>
          </div>

          <div className="w-full h-[95%] p-2">
            <p className="pl-6">Productos disponibles (números de )</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 h-[100%] overflow-y-auto">
              {productosTest.map((prod) => (
                <>
                  <div className="h-full p-4 bg-gray-700">
                    <div className="bg-white rounded-lg shadow flex overflow-hidden">
                      <div className="h-24 w-24 p-2">
                        <img
                          src="https://www.ambrosoli.cl/wp-content/uploads/2021/09/mentitas.png"
                          alt="cosa"
                          className="object-cover w-full h-full rounded-lg"
                        />
                      </div>
                      <div className="flex flex-1 flex-col justify-between p-2">
                        <div>
                          <span className="text-sm font-medium text-gray-800">
                            {prod.name}
                          </span>
                          <p className="text-xs text-gray-500">
                            {prod.category}
                          </p>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-gray-900">
                            ${prod.price}
                          </span>
                          <div className="flex items-center border border-gray-900 rounded-lg overflow-hidden">
                            <button
                              // onClick={onDecrement}
                              className="px-2 bg-gray-900 hover:bg-gray-800"
                            >
                              −
                            </button>
                            <span className="px-2 text-sm text-gray-900">0</span>
                            <button
                              // onClick={onIncrement}
                              className="px-2 bg-gray-900 hover:bg-gray-800"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
