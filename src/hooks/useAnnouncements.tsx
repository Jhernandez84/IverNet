// hooks/useAnnouncements.ts
import { useEffect, useState } from "react";
import { supabase } from "@/app/utils/supabaseClients";
import { useUserSession } from "@/hooks/useUserSession";

export type Announcement = {
  id: string;
  message: string;
  message_type: string;
  status: string;
  created_at: string;
  read: boolean;
};

export function useAnnouncements() {
  const { user } = useUserSession();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnnouncements = async () => {
    if (!user) return;

    setLoading(true);
    const { data, error } = await supabase
      .from("announcements")
      .select(
        `
        id,
        message,
        message_type,
        status,
        created_at,
        announcement_reads(user_id)
      `
      )
      .eq("company_id", user.company_id)
      // .or(`sede_id.eq.${user.sede_id},sede_id.is.null`)
      .order("created_at", { ascending: false });

    if (error) {
      setError(error.message);
      setAnnouncements([]);
    } else {
      const formatted = (data || []).map((a) => ({
        id: a.id,
        message: a.message,
        message_type: a.message_type,
        status: a.status,
        created_at: a.created_at,
        read:
          a.announcement_reads?.some((r: any) => r.user_id === user.id) ||
          false,
      }));
      setAnnouncements(formatted);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchAnnouncements();
  }, [user]);

  return { announcements, loading, error, refetch: fetchAnnouncements };
}
