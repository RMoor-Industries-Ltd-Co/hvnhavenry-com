"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ProductId } from "./products";

export type HotspotId = "flask" | "combRail" | "bolster" | "emberLine" | "shadowChamber" | "columnChamber" | "atmosphereMist" | null;

export interface CartItem {
  productId: ProductId;
  quantity: number;
}

interface HavenStore {
  selectedHotspot: HotspotId;
  setSelectedHotspot: (id: HotspotId) => void;
  isRoomReady: boolean;
  setRoomReady: (ready: boolean) => void;
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  loadProgress: number;
  setLoadProgress: (progress: number) => void;

  // Cart (mock checkout demo — no real orders/payments)
  cart: CartItem[];
  addToCart: (productId: ProductId, quantity?: number) => void;
  removeFromCart: (productId: ProductId) => void;
  updateCartQuantity: (productId: ProductId, quantity: number) => void;
  clearCart: () => void;

  // Last placed mock order, kept for the confirmation page
  lastOrder: {
    orderNumber: string;
    items: CartItem[];
    customerName: string;
    email: string;
    address: string;
    total: number;
    placedAt: string;
  } | null;
  setLastOrder: (order: HavenStore["lastOrder"]) => void;
}

export const useHavenStore = create<HavenStore>()(
  persist(
    (set) => ({
      selectedHotspot: null,
      setSelectedHotspot: (id) => set({ selectedHotspot: id }),
      isRoomReady: false,
      setRoomReady: (ready) => set({ isRoomReady: ready }),
      isLoading: true,
      setLoading: (loading) => set({ isLoading: loading }),
      loadProgress: 0,
      setLoadProgress: (progress) => set({ loadProgress: progress }),

      cart: [],
      addToCart: (productId, quantity = 1) =>
        set((state) => {
          const existing = state.cart.find((item) => item.productId === productId);
          if (existing) {
            return {
              cart: state.cart.map((item) =>
                item.productId === productId
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          }
          return { cart: [...state.cart, { productId, quantity }] };
        }),
      removeFromCart: (productId) =>
        set((state) => ({ cart: state.cart.filter((item) => item.productId !== productId) })),
      updateCartQuantity: (productId, quantity) =>
        set((state) => ({
          cart:
            quantity <= 0
              ? state.cart.filter((item) => item.productId !== productId)
              : state.cart.map((item) => (item.productId === productId ? { ...item, quantity } : item)),
        })),
      clearCart: () => set({ cart: [] }),

      lastOrder: null,
      setLastOrder: (order) => set({ lastOrder: order }),
    }),
    {
      name: "hvn-haven-cart",
      partialize: (state) => ({ cart: state.cart, lastOrder: state.lastOrder }),
    }
  )
);
