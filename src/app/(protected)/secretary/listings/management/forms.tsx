// components/InventarioForm.tsx
import { useEffect, useState } from "react";
import { supabase } from "@/app/utils/supabaseClients";
import { useUserSession } from "@/hooks/useUserSession";

export default function InventarioManagerForm() {
  const { user } = useUserSession();
  const [categoryData, setCategoryData] = useState({
    category_id: "",
    category_name: "",
    category_description: "",
    isActive: true,
  });
  const [subCategoryData, setSubCategoryData] = useState({
    category_id: "",
    subcategory_name: "",
    subcategory_description: "",
    subcategory_isActive: true,
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

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    fetchCategorias();
    fetchSubCategorias();
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setCategoryData((prev) => ({ ...prev, [name]: value }));
    setSubCategoryData((prev) => ({ ...prev, [name]: value }));
    console.log(categoryData, subCategoryData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    setSuccess(false);
    setError(null);

    const { error } = await supabase
      .from("church_inventories_category_manager")
      .insert({
        ...categoryData,
        company_id: user.company_id,
        sede_id: user.sede_id,
        user_id: user.id,
      });

    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
      setCategoryData({
        category_id: "",
        category_name: "",
        category_description: "",
        isActive: true,
      });
      setSubCategoryData({
        category_id: "",
        subcategory_name: "",
        subcategory_description: "",
        subcategory_isActive: true,
      });
    }

    setLoading(false);
  };

  const createCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    setSuccess(false);
    setError(null);

    const { error } = await supabase
      .from("church_inventories_category_manager")
      .insert({
        ...categoryData,
        company_id: user.company_id,
        sede_id: user.sede_id,
        user_id: user.id,
      });

    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
      setCategoryData({
        category_id: "",
        category_name: "",
        category_description: "",
        isActive: true,
      });
      setSubCategoryData({
        category_id: "",
        subcategory_name: "",
        subcategory_description: "",
        subcategory_isActive: true,
      });
    }

    setLoading(false);
  };

  const createSubCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    setSuccess(false);
    setError(null);

    const { error } = await supabase
      .from("church_inventories_sub_category_manager")
      .insert({
        ...subCategoryData,
        company_id: user.company_id,
        // sede_id: user.sede_id,
        user_id: user.id,
      });

    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
      setCategoryData({
        category_id: "",
        category_name: "",
        category_description: "",
        isActive: true,
      });
      setSubCategoryData({
        category_id: "",
        subcategory_name: "",
        subcategory_description: "",
        subcategory_isActive: true,
      });
    }

    setLoading(false);
  };

  const resetForm = () => {
    setCategoryData({
      category_id: "",
      category_name: "",
      category_description: "",
      isActive: true,
    });
    setSubCategoryData({
      category_id: "",
      subcategory_name: "",
      subcategory_description: "",
      subcategory_isActive: true,
    });
  };

  return (
    <form
      // onSubmit={handleSubmit}
      className="p-4 bg-gray-900 text-white rounded-md border border-gray-700 max-w-2xl modal"
    >
      <h2 className="text-lg font-semibold mb-4">Crear Item de Inventario</h2>

      <div className="grid grid-cols-1 gap-4">
        <select
          name="category_id"
          value={categoryData.category_id}
          onChange={handleChange}
          className="p-2 rounded bg-gray-800 border border-gray-700"
        >
          <option value="">Seleccionar Categoría</option>
          {categorias.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.category_name}
            </option>
          ))}
          <option key="nueva" value="nueva">
            Agregar nueva categoría
          </option>
        </select>
        {categoryData.category_id !== "nueva" ? (
          <>
            {categoryData.category_id !== "" ? (
              <input
                name="subcategory_name"
                value={subCategoryData.subcategory_name}
                onChange={handleChange}
                className="p-2 rounded bg-gray-800 border border-gray-700"
                placeholder="Nombre de la subcategoría"
              />
            ) : (
              []
            )}
          </>
        ) : (
          <>
            <input
              name="category_name"
              value={categoryData.category_name}
              onChange={handleChange}
              required
              className="p-2 rounded bg-gray-800 border border-gray-700"
              placeholder="Nombre de la categoría"
            />
            <input
              name="subcategory_name"
              value={subCategoryData.subcategory_name}
              onChange={handleChange}
              className="p-2 rounded bg-gray-800 border border-gray-700"
              placeholder="Nombre de la subcategoría"
            />
          </>
        )}
        <select
          name="estado"
          // value={categoryData.isActive}
          onChange={handleChange}
          className="p-2 rounded bg-gray-800 border border-gray-700"
        >
          <option value="True">Activo</option>
          <option value="False">Inactivo</option>
        </select>
        <textarea
          name="category_description"
          value={categoryData.category_description}
          onChange={handleChange}
          className="p-2 rounded bg-gray-800 border border-gray-700"
          placeholder="Descripción"
        ></textarea>
      </div>

      {categoryData.category_id === "nueva" ? (
        <button
          type="button"
          disabled={loading}
          onClick={createCategory}
          className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
        >
          {loading ? "Guardando..." : "Crear nueva categoría"}
        </button>
      ) : (
        <button
          type="button"
          disabled={loading}
          onClick={createSubCategory}
          className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
        >
          {loading ? "Guardando..." : "Agregar sub categoría"}
        </button>
      )}
      {/* {categoryData.category_id === "" ? (
        <button
          type="submit"
          disabled={loading}
          className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
        >
          {loading ? "Guardando..." : "Crear nueva categoría"}
        </button>
      ) : (
        []
      )} */}

      <button
        type="button"
        disabled={loading}
        onClick={resetForm}
        className="ml-4 mt-4 px-4 py-2 bg-green-600 hover:bg-green-700 rounded"
      >
        {loading ? "Guardando..." : "Limpiar formulario"}
      </button>

      {success && (
        <p className="mt-3 text-green-400">✅ Item registrado correctamente.</p>
      )}
      {error && <p className="mt-3 text-red-400">❌ Error: {error}</p>}
    </form>
  );
}
