// app/auth/callback/route.ts
// Este archivo se ejecuta en el servidor.
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    // Crea una instancia del cliente Supabase del lado del servidor.
    // Esto le permite leer y establecer cookies HTTP-only de forma segura.
    const supabase = createRouteHandlerClient({ cookies });

    // Intercambia el 'code' por una sesión de usuario.
    // Supabase automáticamente establecerá las cookies de sesión.
    await supabase.auth.exchangeCodeForSession(code);
  }

  // IMPORTANTE: Después de procesar el callback, redirige al usuario a tu página principal
  // o dashboard. Esto elimina el 'code' de la URL y completa el flujo de autenticación.
  // Asegúrate de que '/myaccount' sea la URL a la que quieres redirigir después del login exitoso.
  return NextResponse.redirect(new URL("/myaccount", request.url));
}
