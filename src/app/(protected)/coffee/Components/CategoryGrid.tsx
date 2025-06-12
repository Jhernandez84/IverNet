// CategoryItem.tsx
import type { FC } from "react";

type TypeCategory = {
  id: string;
  sede_id: string;
  nombre: string;
  product_id: string;
  descripcion: string;
  imagen_url: string;
  estado: string;
  parent_id: string;
};

type Props = {
  categoria: TypeCategory;
  isSelected: boolean;
  onSelect: (id: string) => void;
};

// const CategoryItem: FC<Props> = ({ categoria, isSelected, onSelect }) => {
// export function CategoryItem({ Category }: { Category: TypeCategory[] }) {

//   return (
//     <button
//       onClick={() => onSelect(categoria.id)}
//       className={`px-4 py-2 rounded-lg cursor-pointer ${
//         isSelected
//           ? "bg-blue-500 text-white"
//           : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//       }`}
//     >
//       {categoria.nombre}
//     </button>
//   );
// };

// export default CategoryItem;

// Dentro de ProductGrid.tsx
import { useState } from "react";

type Producto = {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen_url: string | null;
  stock: number;
  unidad_medida: string;
};

export function ProductGrid({ productos }: { productos: Producto[] }) {
  const [cantidades, setCantidades] = useState<Record<string, number>>({});

  const increment = (id: string) => {
    setCantidades((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };
  const decrement = (id: string) => {
    setCantidades((prev) => {
      const cur = prev[id] || 0;
      if (cur <= 0) return prev;
      return { ...prev, [id]: cur - 1 };
    });
  };

  return (
    <div className="grid …">
      {productos.map((prod) => {
        const qty = cantidades[prod.id] || 0;
        return (
          <div key={prod.id} className="…">
            {/* ... */}
            <button onClick={() => decrement(prod.id)}>−</button>
            <span>{qty}</span>
            <button onClick={() => increment(prod.id)}>+</button>
          </div>
        );
      })}
    </div>
  );
}

