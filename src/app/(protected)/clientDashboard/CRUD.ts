// utils/db/createUser.ts

import { supabase } from "@/app/utils/supabaseClients";

interface CreateUserInput {
  id: string; // UUID externo
  company_id: string;
  full_name: string;
  email: string;
  role: string;
  role_id: string;
  sede_id: string;
  menu_item_id?: string; // opcional, default fijo
}

export async function createUser(input: CreateUserInput) {
  const {
    id,
    company_id,
    full_name,
    email,
    role,
    role_id,
    sede_id,
    menu_item_id = "c9f078a0-bd1d-4e73-ba5d-05119b8a35a3",
  } = input;

  const { error: userError } = await supabase.from("user").insert([
    {
      id,
      company_id,
      full_name,
      email,
      role,
      role_id,
      sede_id,
      active: true,
    },
  ]);

  if (userError) {
    console.error("Error creando usuario:", userError);
    return { success: false, error: userError };
  }

  const { error: accessError } = await supabase.from("user_access").insert([
    {
      user_id: id,
      menu_item_id,
    },
  ]);

  if (accessError) {
    console.error("Error asignando acceso:", accessError);

    // opcional: rollback
    await supabase.from("user").delete().eq("id", id);

    return { success: false, error: accessError };
  }

  return { success: true };
}
