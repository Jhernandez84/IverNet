"use client";
// /pages/orders/ingreso.tsx

import { useState, useEffect, ReactElement, JSX } from "react";
import { fetchCategorias, fetchProducts } from "./helpers/supabaseQueries";
import { supabase } from "@/app/utils/supabaseClients";
import { OffCanvaRigthOrder } from "./OffCanvaMenu/OffCanvasOrderDetails";
import { ProductGrid } from "./Components/ProductsGrid";

type Categoria = {
  id: string;
  nombre: string;
  descripcion: string;
  imagen_url: string | null;
};

type Producto = {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen_url: string | null;
  stock: number;
  unidad_medida: string;
};

export default function POSpage() {
  const [openMenu, setOpenMenu] = useState(false);

  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [allProducts, setAllProducts] = useState<Producto[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [cantidades, setCantidades] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState({
    cats: true,
    prods: true,
    saving: false,
  });

  // 1. Al montar, cargar categorías

  useEffect(() => {
    let mounted = true;

    async function loadCategorias() {
      const storedCats = localStorage.getItem("pos_categorias");
      if (storedCats) {
        const parsed: Categoria[] = JSON.parse(storedCats);
        if (mounted) {
          setCategorias(parsed);
          if (parsed.length > 0) {
            setSelectedCategory(parsed[0].id);
          }
          setLoading((s) => ({ ...s, cats: false }));
        }
      } else {
        const fetchedCats = await fetchCategorias();
        if (mounted) {
          setCategorias(fetchedCats);
          if (fetchedCats.length > 0) {
            setSelectedCategory(fetchedCats[0].id);
          }
          localStorage.setItem("pos_categorias", JSON.stringify(fetchedCats));
          setLoading((s) => ({ ...s, cats: false }));
        }
      }
    }

    async function loadProducts() {
      const storedProds = localStorage.getItem("pos_productos");
      if (storedProds) {
        const parsed: Producto[] = JSON.parse(storedProds);
        if (mounted) {
          setAllProducts(parsed);
          setLoading((s) => ({ ...s, prods: false }));
        }
      } else {
        const fetchedProds = await fetchProducts();
        if (mounted) {
          setAllProducts(fetchedProds);
          localStorage.setItem("pos_productos", JSON.stringify(fetchedProds));
          setLoading((s) => ({ ...s, prods: false }));
        }
      }
    }

    loadCategorias();
    loadProducts();

    return () => {
      mounted = false;
    };
  }, []);

  // 5. Renderizado
  return (
    <>
      <OffCanvaRigthOrder open={openMenu} setOpen={setOpenMenu} crear={false} />

      <div>
        {/* Contenedor del componente */}
        <div className="grid grid-rows-[15%_85%] h-[93vh] w-full bg-gray-700">
          <div className="grid grid-cols-[90%_10%] h-[70px] pt-4">
            <div className="grid grid-cols-8 overflow-y-auto gap-4 pl-6 p-2 h-[120px]">
              {/* {loading.cats ? (
                <p>Cargando productos</p>
              ) : (
                categorias.map((cat) => (
                  <CategoryList
                    key={cat.id}
                    categoria={cat}
                    isSelected={cat.id === selectedCategory}
                    onSelect={setSelectedCategory}
                  />
                ))
              )} */}
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
            {/* <p className="pl-6">Productos disponibles (números de )</p> */}
            <h2 className="text-lg font-semibold mb-2">
              {selectedCategory
                ? `Productos en “${
                    categorias.find((c) => c.id === selectedCategory)?.nombre
                  }”`
                : "Selecciona una categoría"}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 h-[100%] overflow-y-auto">
              {loading.prods ? (
                <p>Cargando productos...</p>
              ) : length === 0 ? (
                <p>No hay productos en esta categoría</p>
              ) : (
                // productos.map((prod) => (
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
                            {/* {prod.nombre} */}
                          </span>
                          <p className="text-xs text-gray-500">
                            {/* {prod.descripcion} */}
                          </p>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-gray-900">
                            {/* ${prod.precio} */}
                          </span>
                          <div className="flex items-center border border-gray-900 rounded-lg overflow-hidden">
                            <button
                              // onClick={onDecrement}
                              className="px-2 bg-gray-900 hover:bg-gray-800"
                            >
                              −
                            </button>
                            <span className="px-2 text-sm text-gray-900">
                              0
                            </span>
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
                // ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
