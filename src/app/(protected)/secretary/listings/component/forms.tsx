// components/InventarioForm.tsx
import { useEffect, useState } from "react";
import { supabase } from "@/app/utils/supabaseClients";
import { useUserSession } from "@/hooks/useUserSession";

// agregar modo Admin
// agregar opción de formulario adaptable

export default function InventarioForm() {
  const { user } = useUserSession();
  const [form, setForm] = useState({
    nombre: "",
    codigo: "",
    descripcion: "",
    estado: "operativo",
    ubicacion: "",
    responsable: "",
    observaciones: "",
    fecha_ingreso: "",
    imagen_url: "",
    category_id: "",
    subCategoryID: "",
    quantity: "",
    sede_id: user?.sede_id,
  });
  const [categorias, setCategorias] = useState<
    {
      id: string;
      category: string;
      category_description: string;
      category_name: string;
      isActive: boolean;
    }[]
  >([]);
  const [subcategorias, setSubcategorias] = useState<
    {
      id: string;
      category_id: string;
      subcategory_name: string;
      subcategory_description: string;
      subcategory_isActive: boolean;
    }[]
  >([]);
  const [adminMode, setAdminMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [loadSedes, setLoadSedes] = useState(false);
  const [errorSedes, setErrorSedes] = useState<string | null>(null);
  const [sedes, setSedes] = useState<{ id: string; nombre: string }[]>([]);

  const fetchCategorias = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("church_inventories_category_manager")
      .select("id, category, category_description, category_name, isActive")
      .eq("company_id", user.company_id)
      .order("category", { ascending: true });
    if (!error && data) setCategorias(data);
  };

  const fetchSubCategorias = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("church_inventories_sub_category_manager")
      .select(
        "id, category_id, subcategory_name, subcategory_description, subcategory_isActive"
      )
      .eq("company_id", user.company_id)
      .order("subcategory_name", { ascending: true });
    if (!error && data) setSubcategorias(data);
  };

  const fetchSedes = async () => {
    setLoadSedes(true);
    setErrorSedes(null);
    try {
      const { data, error } = await supabase
        .from("sedes")
        .select("id, nombre")
        .eq("company_id", user?.company_id)
        .order("nombre", { ascending: true });
      if (error) {
        console.error("Error al cargar sedes:", error.message);
        setErrorSedes(error.message);
        return;
      }
      console.log("Sedes cargadas:", data);
      setSedes(data || []);
    } catch (err: any) {
      console.error("Error inesperado al cargar sedes:", err.message);
      setErrorSedes(err.message);
    } finally {
      setLoadSedes(false);
    }
  };

  const setUserAdminMode = () => {
    user?.role === "admin" ? setAdminMode(true) : setAdminMode(false);
  };

  useEffect(() => {
    fetchCategorias();
    fetchSubCategorias();
    setUserAdminMode();
    if (!user?.scopedBySede) fetchSedes();
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    console.log("Formulario Ingreso", form);
    console.log(subcategorias);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    setSuccess(false);
    setError(null);

    const { error } = await supabase.from("church_inventories").insert({
      ...form,
      company_id: user.company_id,
      user_id: user.id,
    });

    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
      setForm({
        nombre: "",
        codigo: "",
        descripcion: "",
        estado: "operativo",
        ubicacion: "",
        responsable: "",
        observaciones: "",
        fecha_ingreso: "",
        imagen_url: "",
        category_id: "",
        subCategoryID: "",
        quantity: "",
        sede_id: "",
      });
    }

    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 bg-gray-900 text-white rounded-md border border-gray-700 max-w-2xl modal"
    >
      {/* <h2 className="text-lg font-semibold mb-4">
        Registrar Item de Inventario
      </h2> */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <select
          name="category_id"
          value={form.category_id}
          onChange={handleChange}
          className="p-2 rounded bg-gray-800 border border-gray-700"
        >
          <option value="">Seleccionar Categoría</option>
          {categorias.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.category_name}
            </option>
          ))}
          {user?.role === "admin" ? (
            <option key="nueva" value="nueva">
              Agregar nueva Categoría
            </option>
          ) : null}
        </select>
        <select
          name="subCategoryID"
          value={form.subCategoryID}
          onChange={handleChange}
          className="p-2 rounded bg-gray-800 border border-gray-700"
        >
          <option value="">Seleccionar SubCategoría</option>
          {subcategorias.map((subCat) => {
            if (subCat.category_id === form.category_id) {
              return (
                <option key={subCat.id} value={subCat.id}>
                  {subCat.subcategory_name}
                </option>
              );
            }
            return null;
          })}
          {user?.role === "admin" ? (
            <option key="nueva" value="nueva">
              Agregar nueva SubCategoría
            </option>
          ) : null}
        </select>
        <input
          type="number"
          name="quantity"
          value={form.quantity}
          onChange={handleChange}
          className="p-2 rounded bg-gray-800 border border-gray-700"
          placeholder="Cantidad a registrar"
        />

        <select
          name="estado"
          value={form.estado}
          onChange={handleChange}
          className="p-2 rounded bg-gray-800 border border-gray-700"
        >
          <option value="operativo">Operativo</option>
          <option value="en reparación">En reparación</option>
          <option value="prestado">Prestado</option>
          <option value="inactivo">Inactivo</option>
        </select>
        <input
          name="fecha_ingreso"
          type="date"
          value={form.fecha_ingreso}
          onChange={handleChange}
          className="p-2 rounded bg-gray-800 border border-gray-700"
        />
        {user?.scopedBySede === true ? (
          []
        ) : (
          <select
            name="sede_id"
            value={form.sede_id || ""}
            onChange={handleChange}
            className="p-2 rounded bg-gray-800 border border-gray-700"
          >
            <option value="">Seleccione Sede</option>
            {sedes.map((sede) => (
              <option key={sede.id} value={sede.id}>
                {sede.nombre}
              </option>
            ))}
          </select>
        )}

        <textarea
          name="descripcion"
          value={form.descripcion}
          onChange={handleChange}
          className="col-span-2 p-2 rounded bg-gray-800 border border-gray-700"
          placeholder="Descripción"
        ></textarea>
        <textarea
          name="observaciones"
          value={form.observaciones}
          onChange={handleChange}
          className="col-span-2 p-2 rounded bg-gray-800 border border-gray-700"
          placeholder="Observaciones adicionales"
        ></textarea>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
      >
        {loading ? "Guardando..." : "Guardar Registro"}
      </button>

      {success && (
        <p className="mt-3 text-green-400">✅ Item registrado correctamente.</p>
      )}
      {error && <p className="mt-3 text-red-400">❌ Error: {error}</p>}
    </form>
  );
}
