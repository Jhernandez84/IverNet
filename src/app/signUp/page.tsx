"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/utils/supabaseClients";

export default function SignupPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        router.push("/login");
        return;
      }

      // ⚠️ Supabase no permite saber directamente si tiene contraseña,
      // pero puedes usar un campo en tu tabla `users` para marcar si está registrado
      const { data: perfil } = await supabase
        .from("users")
        .select("id, full_name")
        .eq("id", user.id)
        .single();

      if (!perfil) {
        router.push("/login");
      } else {
        setShowForm(true); // mostrar formulario
      }

      setLoading(false);
    };

    checkSession();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirm) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setError(null);

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError("❌ Error al establecer la contraseña.");
    } else {
      alert("✅ Contraseña guardada.");
      router.push("/dashboard"); // o donde prefieras
    }
  };

  if (loading) return <p className="p-6">Verificando sesión...</p>;
  if (!showForm) return null;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-xl font-bold mb-4 text-center">
        Establecer contraseña
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-red-600">{error}</p>}

        <div>
          <label className="block text-sm font-medium">Contraseña</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">
            Confirmar contraseña
          </label>
          <input
            type="password"
            required
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700"
        >
          Guardar contraseña
        </button>
      </form>
    </div>
  );
}
