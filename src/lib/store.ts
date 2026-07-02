"use client";

import { create } from "zustand";
import { COLLECTION_ORDER, ProductId } from "./products";

interface HavenStore {
  // Section 3 — interactive room tabs
  activeCollection: string;
  setActiveCollection: (collection: string) => void;
  activeTabItem: ProductId | null;
  setActiveTabItem: (id: ProductId | null) => void;

  // Section 4 — collapsible video reveal
  isVideoOpen: boolean;
  activeVideoProduct: ProductId | null;
  openVideo: (id: ProductId) => void;
  closeVideo: () => void;

  // Shared smooth-scroll handle (set once Lenis is initialized on the page)
  scrollToSection: ((id: string) => void) | null;
  setScrollToSection: (fn: (id: string) => void) => void;
}

export const useHavenStore = create<HavenStore>((set) => ({
  activeCollection: COLLECTION_ORDER[0],
  setActiveCollection: (collection) =>
    set({ activeCollection: collection, activeTabItem: null }),
  activeTabItem: null,
  setActiveTabItem: (id) => set({ activeTabItem: id }),

  isVideoOpen: false,
  activeVideoProduct: null,
  openVideo: (id) => set({ isVideoOpen: true, activeVideoProduct: id }),
  closeVideo: () => set({ isVideoOpen: false }),

  scrollToSection: null,
  setScrollToSection: (fn) => set({ scrollToSection: fn }),
}));
