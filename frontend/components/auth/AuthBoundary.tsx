"use client";

import { useEffect, useState } from "react";
import { getSessionState, subscribeSession } from "@/store/session.store";

type Props = {
  children: React.ReactNode;
  fallback?: React.ReactNode;
};

export default function AuthBoundary({ children, fallback = null }: Props) {
  const [isAuthenticated, setIsAuthenticated] = useState(getSessionState().isAuthenticated);

  useEffect(() => {
    const unsubscribe = subscribeSession((state) => {
      setIsAuthenticated(state.isAuthenticated);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  if (!isAuthenticated) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
