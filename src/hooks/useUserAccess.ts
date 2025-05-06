import { useEffect, useState } from "react";
import { supabase } from "@/app/utils/supabaseClients";

export function useUserAccess() {
  const [accessKeys, setAccessKeys] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAccess = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("user_access")
        .select("menu_items (key)")
        .eq("user_id", user.id);

      if (!error && data) {
        const keys = data.map((item: any) => item.menu_items.key);
        setAccessKeys(keys);
      }

      setLoading(false);
    };

    fetchAccess();
  }, []);

  return { accessKeys, loading };
}
