// utils/useChurchMembers.ts
import { useEffect, useState } from "react";
import { supabase } from "@/app/utils/supabaseClients";

export function useChurchMembers() {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  type MemberWithSede = {
    id: string;
    rut: string;
    first_name: string;
    last_name: string;
    second_last_name: string;
    birth_date: string;
    phone: string;
    gender: string;
    church_role: string;
    sede_id: string;
    sedes?: {
      nombre: string;
    };
  };

  useEffect(() => {
    const fetchMembers = async () => {
      setLoading(true);
      const { data, error } = (await supabase.from("church_members").select(`
          id,
          rut,
          first_name,
          last_name,
          second_last_name,
          birth_date,
          phone,
          gender,
          church_role,
          sede_id,
          sedes(nombre)
        `)) as { data: MemberWithSede[]; error: any };

      if (error) {
        setError(error.message);
        setMembers([]);
      } else {
        const renamed = data.map((m) => ({
          Nombre: m.first_name,
          "Apellido Paterno": m.last_name,
          "Apellido Materno": m.second_last_name,
          Rut: m.rut,
          "Fecha de Nacimiento": m.birth_date,
          Teléfono: m.phone,
          Género: m.gender,
          Rol: m.church_role,
          Sede: m.sedes?.nombre || "—",
        }));
        setMembers(renamed);
        setError(null);
      }
      setLoading(false);
    };

    fetchMembers();
  }, []);

  return { members, loading, error };
}
