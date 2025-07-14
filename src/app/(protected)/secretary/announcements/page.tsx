'use client'

// components/CreateAnnouncementForm.tsx
import { useState } from "react";
import { supabase } from "@/app/utils/supabaseClients";
import { useUserSession } from "@/hooks/useUserSession";

export default function CreateAnnouncementForm() {
  const { user } = useUserSession();
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    setError(null);
    setSuccess(false);

    const { error } = await supabase.from("announcements").insert({
      company_id: user.company_id,
      sede_id: user.sede_id,
      user_id: user.id,
      message,
      message_type: messageType,
      status: "activa",
    });

    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
      setMessage("");
      setMessageType("info");
    }

    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 bg-gray-900 text-white rounded-md border border-gray-700 max-w-lg"
    >
      <h2 className="text-lg font-semibold mb-4">Nueva Notificación</h2>

      <div className="mb-4">
        <label className="block mb-1 text-sm">Mensaje</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full p-2 border border-gray-700 bg-black rounded"
          rows={3}
          required
        ></textarea>
      </div>

      <div className="mb-4">
        <label className="block mb-1 text-sm">Tipo</label>
        <select
          value={messageType}
          onChange={(e) => setMessageType(e.target.value)}
          className="w-full p-2 border border-gray-700 bg-black rounded"
        >
          <option value="info">ℹ️ Info</option>
          <option value="warning">⚠️ Alerta</option>
          <option value="success">✅ Éxito</option>
          <option value="error">❌ Error</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white"
      >
        {loading ? "Guardando..." : "Publicar Notificación"}
      </button>

      {success && (
        <p className="mt-3 text-green-400">
          ✅ Notificación guardada correctamente.
        </p>
      )}
      {error && <p className="mt-3 text-red-400">❌ Error: {error}</p>}
    </form>
  );
}
