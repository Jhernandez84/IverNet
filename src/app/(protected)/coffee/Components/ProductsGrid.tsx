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
