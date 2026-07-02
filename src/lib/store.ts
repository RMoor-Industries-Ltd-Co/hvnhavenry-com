"use client";

import { create } from "zustand";
import { COLLECTION_ORDER, ProductId } from "./products";

export type HotspotId = "flask" | "combRail" | "bolster" | "emberLine" | "shadowChamber" | "columnChamber" | "atmosphereMist" | null;

interface HavenStore {
  selectedHotspot: HotspotId;
  setSelectedHotspot: (id: HotspotId) => void;
  isRoomReady: boolean;
  setRoomReady: (ready: boolean) => void;
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  loadProgress: number;
  setLoadProgress: (progress: number) => void;

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
  selectedHotspot: null,
  setSelectedHotspot: (id) => set({ selectedHotspot: id }),
  isRoomReady: false,
  setRoomReady: (ready) => set({ isRoomReady: ready }),
  isLoading: true,
  setLoading: (loading) => set({ isLoading: loading }),
  loadProgress: 0,
  setLoadProgress: (progress) => set({ loadProgress: progress }),

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
