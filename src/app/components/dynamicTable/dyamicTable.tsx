// DynamicTable.tsx
import { useState, useMemo, useRef, useEffect } from "react";

interface DynamicTableProps {
  data: any[];
  title?: string;
  rowsPerPage?: number;
  actionButton?: {
    label: string;
    onClick: () => void;
  };
}

export default function DynamicTable({
  data,
  title,
  rowsPerPage = 5,
  actionButton,
}: DynamicTableProps) {
  const [globalSearch, setGlobalSearch] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);
  const [columnFilters, setColumnFilters] = useState<{
    [key: string]: string | null;
  }>({});
  const [activeHeader, setActiveHeader] = useState<string | null>(null);
  const [showColumnDropdown, setShowColumnDropdown] = useState(false);
  const [columnSearch, setColumnSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const columns = data.length > 0 ? Object.keys(data[0]) : [];

  const dropdownRef = useRef<HTMLDivElement>(null);
  const columnDropdownRef = useRef<HTMLDivElement>(null);

  const [visibleColumns, setVisibleColumns] = useState<string[]>(columns);

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

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredData.slice(start, start + rowsPerPage);
  }, [filteredData, currentPage, rowsPerPage]);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

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

  const handleClearFilter = (key: string) => {
    setColumnFilters((prev) => ({ ...prev, [key]: null }));
  };

  const uniqueValues = (key: string): string[] => {
    return Array.from(new Set(data.map((row) => String(row[key]))));
  };

  const toggleColumnVisibility = (key: string) => {
    setVisibleColumns((prev) =>
      prev.includes(key) ? prev.filter((col) => col !== key) : [...prev, key]
    );
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setActiveHeader(null);
      }
      if (
        columnDropdownRef.current &&
        !columnDropdownRef.current.contains(event.target as Node)
      ) {
        setShowColumnDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className="p-4 relative text-white bg-gray-800 rounded-xl border border-gray-600"
      style={{ height: "calc(100vh - 120px)" }}
    >
      {title && <h2 className="text-xl font-semibold mb-4">{title}</h2>}

      <div className="flex justify-between items-center mb-4">
        {actionButton && (
          <button
            onClick={actionButton.onClick}
            className="text-white px-4 py-1.5 rounded-md text-sm font-medium bg-blue-700 hover:bg-blue-600"
          >
            {actionButton.label}
          </button>
        )}
        <input
          type="text"
          placeholder="🔍 Filtrar globalmente..."
          className="px-3 py-1 border border-gray-600 rounded bg-gray-900 w-full sm:w-1/3 text-white text-sm"
          value={globalSearch}
          onChange={(e) => {
            setGlobalSearch(e.target.value);
            setCurrentPage(1);
          }}
        />

        <div className="relative" ref={columnDropdownRef}>
          <button
            onClick={() => setShowColumnDropdown((prev) => !prev)}
            className="border border-gray-700 bg-gray-500 px-3 py-1.5 rounded-md text-sm hover:bg-gray-800"
          >
            ⚙️
          </button>

          {showColumnDropdown && (
            <div className="absolute right-0 mt-2 w-56 bg-gray-900 border border-gray-700 rounded-md shadow-lg text-sm z-30 p-2">
              <input
                type="text"
                placeholder="Buscar columna..."
                className="w-full px-2 py-1 mb-2 rounded bg-black border border-gray-600 text-white"
                value={columnSearch}
                onChange={(e) => setColumnSearch(e.target.value)}
              />
              {columns
                .filter((col) =>
                  col.toLowerCase().includes(columnSearch.toLowerCase())
                )
                .map((col) => (
                  <label
                    key={col}
                    className="flex items-center px-2 py-1 hover:bg-gray-800 rounded cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={visibleColumns.includes(col)}
                      onChange={() => toggleColumnVisibility(col)}
                      className="mr-2 accent-gray-500"
                    />
                    <span className="truncate">{col}</span>
                  </label>
                ))}
            </div>
          )}
        </div>
      </div>

      <div className="overflow-auto">
        <table className="min-w-full border border-gray-700 text-sm rounded-md">
          <thead>
            <tr className="bg-gray-900 text-gray-300 text-center ">
              {visibleColumns.map((col) => (
                <th
                  key={col}
                  className="relative text-left px-4 py-2 cursor-pointer select-none"
                  onClick={() => handleHeaderClick(col)}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate">
                      {col}
                      {sortConfig?.key === col
                        ? sortConfig.direction === "asc"
                          ? " ▲"
                          : " ▼"
                        : ""}
                      {columnFilters[col] && (
                        <span className="text-blue-400 ml-1">
                          {/* 🔍 {columnFilters[col]} */}
                        </span>
                      )}
                    </span>
                    {columnFilters[col] && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleClearFilter(col);
                        }}
                        className="text-red-500 text-xs hover:text-red-700"
                      >
                        ❌
                      </button>
                    )}
                  </div>

                  {activeHeader === col && (
                    <div
                      ref={dropdownRef}
                      className="absolute z-20 top-full left-0 mt-2 w-48 bg-gray-900 border border-gray-700 rounded shadow"
                    >
                      <button
                        onClick={() => handleSort(col, "asc")}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-800"
                      >
                        Ordenar Ascendente
                      </button>
                      <button
                        onClick={() => handleSort(col, "desc")}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-800"
                      >
                        Ordenar Descendente
                      </button>
                      <div className="border-t my-1 border-gray-700" />
                      <div className="max-h-40 overflow-y-auto">
                        <button
                          onClick={() => handleFilter(col, null)}
                          className="block w-full text-left px-4 py-2 hover:bg-gray-800 font-semibold"
                        >
                          Todos
                        </button>
                        {uniqueValues(col).map((val) => (
                          <button
                            key={val}
                            onClick={() => handleFilter(col, val)}
                            className="block w-full text-left px-4 py-2 hover:bg-gray-800"
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
            {paginatedData.length > 0 ? (
              paginatedData.map((row, idx) => (
                <tr
                  key={idx}
                  className="border-t border-gray-700  cursor-pointer"
                >
                  {visibleColumns.map((col) => (
                    <td key={col} className="px-4 py-2">
                      {String(row[col])}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={visibleColumns.length}
                  className="text-center py-4"
                >
                  Sin resultados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="text-xs text-gray-500 mt-4 flex justify-between">
        <span>{`${(currentPage - 1) * rowsPerPage + 1} - ${Math.min(
          currentPage * rowsPerPage,
          filteredData.length
        )} de ${filteredData.length} filas`}</span>
        <div>
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            className="px-3 py-1 bg-gray-800 text-gray-400 rounded-l-md border border-gray-700 disabled:opacity-50"
          >
            Previous
          </button>
          <button
            disabled={currentPage === totalPages}
            onClick={() =>
              setCurrentPage((prev) => Math.min(totalPages, prev + 1))
            }
            className="px-3 py-1 bg-gray-800 text-gray-400 rounded-r-md border border-gray-700 ml-[-1px] disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
