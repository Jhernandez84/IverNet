// src/app/api/create-user/route.ts

import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Esta key debe ser la "Service Role"
);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { full_name, email, role_id, sede_id, company_id } = body;

    // 1. Crear usuario en Auth
    const { data: authUser, error: authError } =
      await supabaseAdmin.auth.admin.inviteUserByEmail(email);

    if (authError) {
      console.error("Auth error:", authError.message);
      return NextResponse.json({ error: authError.message }, { status: 500 });
    }

    const userId = authUser?.user?.id;

    if (!userId) {
      return NextResponse.json(
        { error: "No se pudo obtener ID de usuario." },
        { status: 500 }
      );
    }

    // 2. Insertar en tabla 'users'
    const { error: insertError } = await supabaseAdmin.from("users").insert([
      {
        id: userId,
        full_name,
        email,
        role_id,
        sede_id,
        company_id,
      },
    ]);

    if (insertError) {
      console.error("Insert error:", insertError.message);
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Unexpected error:", err.message);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
