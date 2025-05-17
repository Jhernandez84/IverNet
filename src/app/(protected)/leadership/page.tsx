"use client";

import { useState } from "react";
import { Dialog } from "@headlessui/react";

import { useUserSession } from "@/hooks/useUserSession";

// Tipo de Usuario
interface User {
  id: string;
  name: string;
  email: string;
}

export default function LeadershipPage() {
  const { user, loading } = useUserSession();

  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openCreateModal = () => {
    setSelectedUser({ id: "", name: "", email: "" });
    setIsModalOpen(true);
  };

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedUser(null);
    setIsModalOpen(false);
  };

  const saveUser = (user: User) => {
    if (user.id) {
      setUsers((prev) => prev.map((u) => (u.id === user.id ? user : u)));
    } else {
      //setUsers(prev => [...prev, { ...user, id: null }]);
    }
    closeModal();
  };

  if (loading) return <p className="p-6">Cargando...</p>;
  if (!user)
    return <p className="p-6 text-red-500">No se pudo cargar el perfil.</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Usuarios</h1>
      <button
        onClick={openCreateModal}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Crear Usuario
      </button>

      <table className="min-w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Nombre</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="p-2 border">{user.name}</td>
              <td className="p-2 border">{user.email}</td>
              <td className="p-2 border">
                <button
                  className="text-sm text-blue-600 hover:underline"
                  onClick={() => openEditModal(user)}
                >
                  Editar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Dialog open={isModalOpen} onClose={closeModal} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white p-6 rounded shadow-md w-full max-w-md">
            <Dialog.Title className="text-xl font-semibold mb-4">
              {selectedUser?.id ? "Editar Usuario" : "Crear Usuario"}
            </Dialog.Title>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (selectedUser) saveUser(selectedUser);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium">Nombre</label>
                <input
                  type="text"
                  value={selectedUser?.name || ""}
                  onChange={(e) =>
                    setSelectedUser((prev) =>
                      prev ? { ...prev, name: e.target.value } : null
                    )
                  }
                  className="w-full border px-2 py-1 rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Email</label>
                <input
                  type="email"
                  value={selectedUser?.email || ""}
                  onChange={(e) =>
                    setSelectedUser((prev) =>
                      prev ? { ...prev, email: e.target.value } : null
                    )
                  }
                  className="w-full border px-2 py-1 rounded"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-200 rounded"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  Guardar
                </button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
