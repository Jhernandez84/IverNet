"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../utils/supabaseClients";
import { useUserSession } from "@/hooks/useUserSession";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();
  const { user, loading } = useUserSession();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      // console.log(user?.access);
      router.push("/myaccount");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white relative">
      {/* Imagen de fondo */}
      <div className="absolute inset-0">
        <img
          src="data:image/jpeg;base64,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"
          alt="Fondo"
          className="w-full h-full object-cover opacity-30"
        />
      </div>

      {/* Contenido centrado */}
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <form
          onSubmit={handleLogin}
          className="bg-white/90 text-gray-800 p-8 rounded-lg shadow-lg w-full max-w-sm space-y-4"
        >
          <h2 className="text-2xl font-bold text-center">Iniciar sesión</h2>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div>
            <label className="block text-sm font-medium">
              Correo electrónico
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Contraseña</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>
          {/* <Link
            key="signup"
            href="/signup"
            className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
          >
            Crear Cuenta
          </Link> */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
