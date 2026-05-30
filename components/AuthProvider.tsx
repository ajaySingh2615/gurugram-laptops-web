"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth.store";
import { useCartStore } from "@/store/cart.store";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { initializeAuth, isInitialized, isAuthenticated } = useAuthStore();
  const { fetchCart, syncLocalCart, items } = useCartStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    if (isInitialized && isAuthenticated) {
      const hasLocalItems = items.some(i => !i.id || i.id.startsWith('local_'));
      if (hasLocalItems) {
        syncLocalCart();
      } else {
        fetchCart();
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInitialized, isAuthenticated]);

  return <>{children}</>;
}
