"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "@/lib/types";

type CartState = {
  items: CartItem[];
  hydrated: boolean;
  toast: string | null;
  setHydrated: (value: boolean) => void;
  addItem: (item: Omit<CartItem, "id" | "quantity"> & { quantity?: number }) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clear: () => void;
  clearToast: () => void;
};

function catalogKey(item: Pick<CartItem, "productSlug" | "color" | "size" | "kind">) {
  return `${item.productSlug}|${item.color}|${item.size}`;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      hydrated: false,
      toast: null,
      setHydrated: (value) => set({ hydrated: value }),
      addItem: (incoming) => {
        const quantity = incoming.quantity ?? 1;
        if (incoming.kind === "catalog") {
          const existing = get().items.find(
            (item) =>
              item.kind === "catalog" && catalogKey(item) === catalogKey(incoming),
          );
          if (existing) {
            set({
              items: get().items.map((item) =>
                item.id === existing.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item,
              ),
              toast: `${incoming.name} se sumó al carrito`,
            });
            return;
          }
        }

        const item: CartItem = {
          ...incoming,
          id: crypto.randomUUID(),
          quantity,
        };

        set({ items: [...get().items, item], toast: `${incoming.name} se sumó al carrito` });
      },
      updateQuantity: (id, quantity) => {
        if (quantity < 1) {
          set({ items: get().items.filter((item) => item.id !== id) });
          return;
        }
        set({
          items: get().items.map((item) =>
            item.id === id ? { ...item, quantity } : item,
          ),
        });
      },
      removeItem: (id) =>
        set({ items: get().items.filter((item) => item.id !== id) }),
      clear: () => set({ items: [] }),
      clearToast: () => set({ toast: null }),
    }),
    {
      name: "koinu-cart",
      skipHydration: true,
      partialize: (state) => ({ items: state.items }),
    },
  ),
);

export function useCartCount() {
  return useCartStore((state) =>
    state.items.reduce((sum, item) => sum + item.quantity, 0),
  );
}

export function useCartTotal() {
  return useCartStore((state) =>
    state.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
  );
}
