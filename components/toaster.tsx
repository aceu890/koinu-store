"use client";

import { useEffect } from "react";
import { useCartStore } from "@/lib/cart-store";

export function CartHydration() {
  useEffect(() => {
    void useCartStore.persist.rehydrate();
    useCartStore.getState().setHydrated(true);
  }, []);

  return null;
}

export function Toaster() {
  const toast = useCartStore((state) => state.toast);
  const clearToast = useCartStore((state) => state.clearToast);

  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => clearToast(), 2600);
    return () => window.clearTimeout(id);
  }, [toast, clearToast]);

  if (!toast) return null;

  return (
    <div className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper shadow-lg">
      {toast}
    </div>
  );
}
