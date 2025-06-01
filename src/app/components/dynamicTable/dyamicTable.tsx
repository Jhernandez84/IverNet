import { useState, useMemo, useRef, useEffect } from "react";

interface DynamicTableProps {
  data: any[];
  title?: string;
}

export default function DynamicTable({ data, title }: DynamicTableProps) {
  const [globalSearch, setGlobalSearch] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);
  const [columnFilters, setColumnFilters] = useState<{
    [key: string]: string | null;
  }>({});
  const [activeHeader, setActiveHeader] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const columns = data.length > 0 ? Object.keys(data[0]) : [];

  const filteredData = useMemo(() => {
    let result = data;

    if (globalSearch) {
      result = result.filter((row) =>
        Object.values(row).some((value) =>
          String(value).toLowerCase().includes(globalSearch.toLowerCase())
        )
      );
    }

    for (const key of Object.keys(columnFilters)) {
      const value = columnFilters[key];
      if (value) {
        result = result.filter((row) => String(row[key]) === value);
      }
    }

    if (sortConfig) {
      result = [...result].sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];
        if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [data, globalSearch, columnFilters, sortConfig]);

  const handleHeaderClick = (key: string) => {
    setActiveHeader((prev) => (prev === key ? null : key));
  };

  const handleSort = (key: string, direction: "asc" | "desc") => {
    setSortConfig({ key, direction });
    setActiveHeader(null);
  };

  const handleFilter = (key: string, value: string | null) => {
    setColumnFilters((prev) => ({ ...prev, [key]: value }));
    setActiveHeader(null);
  };

  const uniqueValues = (key: string): string[] => {
    return Array.from(new Set(data.map((row) => String(row[key]))));
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setActiveHeader(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="p-4 relative">
      {title && <h2 className="text-xl font-semibold mb-4">{title}</h2>}

      <input
        type="text"
        placeholder="Filtrar globalmente..."
        className="mb-3 px-3 py-1 border rounded w-full sm:w-1/3"
        value={globalSearch}
        onChange={(e) => setGlobalSearch(e.target.value)}
      />

      <div className="overflow-auto">
        <table className="min-w-full border border-gray-300 text-sm">
          <thead>
            <tr className="bg-gray-100">
              {columns.map((col) => (
                <th
                  key={col}
                  className="relative text-left px-4 py-2 cursor-pointer select-none"
                  onClick={() => handleHeaderClick(col)}
                >
                  {col}
                  {sortConfig?.key === col
                    ? sortConfig.direction === "asc"
                      ? " ▲"
                      : " ▼"
                    : ""}
                  {activeHeader === col && (
                    <div
                      ref={dropdownRef}
                      className="absolute z-10 top-full left-0 mt-2 w-48 bg-white border rounded shadow"
                    >
                      <button
                        onClick={() => handleSort(col, "asc")}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                      >
                        Ordenar Ascendente
                      </button>
                      <button
                        onClick={() => handleSort(col, "desc")}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                      >
                        Ordenar Descendente
                      </button>
                      <div className="border-t my-1" />
                      <div className="max-h-40 overflow-y-auto">
                        <button
                          onClick={() => handleFilter(col, null)}
                          className="block w-full text-left px-4 py-2 hover:bg-gray-100 font-semibold"
                        >
                          Todos
                        </button>
                        {uniqueValues(col).map((val) => (
                          <button
                            key={val}
                            onClick={() => handleFilter(col, val)}
                            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                          >
                            {val}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((row, idx) => (
                <tr key={idx} className="border-t">
                  {columns.map((col) => (
                    <td key={col} className="px-4 py-2">
                      {String(row[col])}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="text-center py-4">
                  Sin resultados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
