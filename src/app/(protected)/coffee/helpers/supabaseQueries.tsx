import { supabase } from "@/app/utils/supabaseClients";

export async function fetchCategorias() {
  const { data, error } = await supabase
    .from("man_categorias")
    .select("id, nombre, descripcion, imagen_url")
    .eq("company_id", "9f9bac89-409d-435c-95f3-33fd6137d69f")
    .is("sede_id", null)
    .eq("estado", "activo")
    .order("nombre", { ascending: true });

  if (error) {
    console.error("Error al cargar categorías:", error.message);
    return [];
  }
  return data; // array de { id, nombre, descripcion, imagen_url }
}

export async function fetchProductosPorCategoria(categoryId: string) {
  const { data, error } = await supabase
    .from("man_productos")
    .select("id, nombre, descripcion, precio, imagen_url, stock, unidad_medida")
    .eq("company_id", "9f9bac89-409d-435c-95f3-33fd6137d69f")
    .is("sede_id", null)
    .eq("estado", "activo")
    .eq("categoria_id", categoryId)
    .order("nombre", { ascending: true });

  if (error) {
    console.error("Error al cargar productos por categoría:", error.message);
    return [];
  }
  return data;
}

export async function fetchProducts() {
  const { data, error } = await supabase
    .from("man_productos")
    .select(
      `
      id,
      nombre,
      descripcion,
      precio,
      imagen_url,
      stock,
      unidad_medida,
      categoria:man_categorias(nombre)
    `
    )
    .eq("man_productos.company_id", "9f9bac89-409d-435c-95f3-33fd6137d69f")
    .is("man_productos.sede_id", null)
    .eq("man_productos.estado", "activo")
    .eq("man_categorias.estado", "activo")
    .is("man_categorias.sede_id", null)
    .order("nombre", { ascending: true });

  if (error) {
    console.error("Error al cargar productos:", error.message);
    return [];
  }
  // Cada elemento de data tendrá: { id, nombre, descripcion, precio, imagen_url, stock, unidad_medida, categoria: { nombre } }
  return data;
}

// recibe productId como string
export async function fetchDetalleProducto(productId: string) {
  // 1. Traer datos básicos de producto
  const { data: producto, error: errProd } = await supabase
    .from("man_productos")
    .select("id, nombre, descripcion, precio, imagen_url, stock, unidad_medida")
    .eq("id", productId)
    .eq("company_id", "9f9bac89-409d-435c-95f3-33fd6137d69f")
    .is("sede_id", null)
    .eq("estado", "activo")
    .single();

  if (errProd || !producto) {
    console.error("Error al cargar producto:", errProd?.message);
    return null;
  }

  // 2. Traer variaciones activas de ese producto
  const { data: variantes, error: errVar } = await supabase
    .from("man_variaciones")
    .select("id, nombre_variacion, precio, stock")
    .eq("product_id", productId)
    .eq("estado", "activo");

  if (errVar) {
    console.error("Error al cargar variaciones:", errVar.message);
    return { ...producto, variaciones: [] };
  }

  return {
    ...producto,
    variaciones: variantes, // array de { id, nombre_variacion, precio, stock }
  };
}
