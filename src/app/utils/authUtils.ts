// utils/authUtils.ts
import { supabase } from "@/app/utils/supabaseClients";

export async function crearUsuarioConCorreo(email: string) {
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    email_confirm: false, // cambia a true si quieres que confirme
    // puedes incluir password si lo deseas
  });

  if (error) throw error;
  return data?.user;
}
