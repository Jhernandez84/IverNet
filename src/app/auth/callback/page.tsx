"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function AuthCallback() {
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: sessionData } = await supabase.auth.getSession();

      if (!sessionData.session) {
        const { data: listener } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            if (event === "SIGNED_IN" && session?.user) {
              listener?.subscription.unsubscribe();
              router.replace("/myaccount");
            }
          }
        );

        setTimeout(() => {
          router.push("/myaccount")
          router.replace("/myaccount");

        }, 2500);
      } else {
        router.replace("/myaccount");
      }
    };

    checkAuth();
  }, [router, supabase]);

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid mb-4" />
      <p className="text-lg text-gray-700">Autenticando...</p>
    </div>
  );
}
