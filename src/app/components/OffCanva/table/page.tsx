"use client";

import { useState } from "react";

export default function Table() {
  const [isOpen, setIsOpen] = useState(false);

  const data = [
    {
      id: 1,
      nombre: "Juan Pérez",
      rol: "Secretaría",
      email: "juan@iglesia.cl",
      telefono: "+56 9 1234 5678",
      creado: "2024-01-15",
    },
    {
      id: 2,
      nombre: "Ana López",
      rol: "Finanzas",
      email: "ana@iglesia.cl",
      telefono: "+56 9 2345 6789",
      creado: "2024-02-20",
    },
    {
      id: 3,
      nombre: "Carlos Ruiz",
      rol: "Administrador",
      email: "carlos@iglesia.cl",
      telefono: "+56 9 3456 7890",
      creado: "2023-12-05",
    },
    {
      id: 4,
      nombre: "Lucía Gómez",
      rol: "Pastor",
      email: "lucia@iglesia.cl",
      telefono: "+56 9 4567 8901",
      creado: "2023-11-12",
    },
    {
      id: 5,
      nombre: "Diego Fuentes",
      rol: "Voluntario",
      email: "diego@iglesia.cl",
      telefono: "+56 9 5678 9012",
      creado: "2024-03-01",
    },
    {
      id: 6,
      nombre: "Diego Fuentes",
      rol: "Voluntario",
      email: "diego@iglesia.cl",
      telefono: "+56 9 5678 9012",
      creado: "2024-03-01",
    },
    {
      id: 7,
      nombre: "Diego Fuentes",
      rol: "Voluntario",
      email: "diego@iglesia.cl",
      telefono: "+56 9 5678 9012",
      creado: "2024-03-01",
    },
    {
      id: 8,
      nombre: "Diego Fuentes",
      rol: "Voluntario",
      email: "diego@iglesia.cl",
      telefono: "+56 9 5678 9012",
      creado: "2024-03-01",
    },
    {
      id: 9,
      nombre: "Diego Fuentes",
      rol: "Voluntario",
      email: "diego@iglesia.cl",
      telefono: "+56 9 5678 9012",
      creado: "2024-03-01",
    },
    {
      id: 10,
      nombre: "Diego Fuentes",
      rol: "Voluntario",
      email: "diego@iglesia.cl",
      telefono: "+56 9 5678 9012",
      creado: "2024-03-01",
    },
    {
      id: 11,
      nombre: "Diego Fuentes",
      rol: "Voluntario",
      email: "diego@iglesia.cl",
      telefono: "+56 9 5678 9012",
      creado: "2024-03-01",
    },
  ];

  return (
    <div className="relative p-4">
      {/* Botón de entrada rápida */}
      <div className="flex justify-end mb-2">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition text-sm font-medium"
        >
          ➕ Ingreso rápido
        </button>
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Nuevo miembro</h2>
            <form className="space-y-4">
              <input
                className="w-full border px-3 py-2 rounded"
                placeholder="Nombre completo"
              />
              <input
                className="w-full border px-3 py-2 rounded"
                placeholder="Email"
              />
              <input
                className="w-full border px-3 py-2 rounded"
                placeholder="Teléfono"
              />
              <select className="w-full border px-3 py-2 rounded">
                <option value="">Seleccionar rol</option>
                <option value="Administrador">Administrador</option>
                <option value="Secretaría">Secretaría</option>
                <option value="Finanzas">Finanzas</option>
                <option value="Pastor">Pastor</option>
                <option value="Voluntario">Voluntario</option>
              </select>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Contenedor con scroll y encabezado sticky */}
      <div className="overflow-x-auto max-h-[500px] border rounded shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 sticky top-0 z-10 border-b border-gray-300">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">
                Nombre
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">
                Rol
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">
                Email
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">
                Teléfono
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">
                Creado
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((user) => (
              <tr key={user.id}>
                <td className="px-4 py-3 text-gray-900">{user.nombre}</td>
                <td className="px-4 py-3 text-gray-900">{user.rol}</td>
                <td className="px-4 py-3 text-gray-900">{user.email}</td>
                <td className="px-4 py-3 text-gray-900">{user.telefono}</td>
                <td className="px-4 py-3 text-gray-900">{user.creado}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
