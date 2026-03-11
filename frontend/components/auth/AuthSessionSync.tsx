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
        email: user.email ?? ""
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
        email: user.email ?? ""
      });
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return null;
}
