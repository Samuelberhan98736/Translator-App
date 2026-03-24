"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { setSessionUser } from "@/store/session.store";

export default function AuthSessionSync() {
  useEffect(() => {
    let mounted = true;

    void supabase.auth.getSession().then(({ data }) => {
      if (!mounted) {
        return;
      }

      const user = data.session?.user;
      if (!user) {
        setSessionUser(null);
        return;
      }

      setSessionUser({
        id: user.id,
        email: user.email ?? "",
        name: user.user_metadata?.full_name ?? user.user_metadata?.name ?? undefined,
        avatarUrl: user.user_metadata?.avatar_url ?? undefined,
        provider: user.app_metadata?.provider ?? undefined
      });
    });

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user;
      if (!user) {
        setSessionUser(null);
        return;
      }

      setSessionUser({
        id: user.id,
        email: user.email ?? "",
        name: user.user_metadata?.full_name ?? user.user_metadata?.name ?? undefined,
        avatarUrl: user.user_metadata?.avatar_url ?? undefined,
        provider: user.app_metadata?.provider ?? undefined
      });
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return null;
}
