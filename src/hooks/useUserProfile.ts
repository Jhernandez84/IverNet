"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/utils/supabaseClients";

type UserProfile = {
  user_id: string;
  menu_item_id: string;

};

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { user },
        error: sessionError,
      } = await supabase.auth.getUser();

      if (sessionError || !user) {
        setProfile(null);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("users_access")
        .select("user_id, menu_item_id")
        .eq("user_id", user.id)
        .single();

      if (error) {
        console.error("Error loading profile:", error.message);
        setProfile(null);
      } else {
        setProfile(data);
      }

      setLoading(false);
    };

    fetchProfile();
  }, []);

  return { profile, loading };
}
