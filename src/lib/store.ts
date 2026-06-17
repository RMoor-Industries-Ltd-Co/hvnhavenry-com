"use client";

import { create } from "zustand";

export type HotspotId = "sofa" | "desk" | "bar" | "library" | null;

interface HavenStore {
  selectedHotspot: HotspotId;
  setSelectedHotspot: (id: HotspotId) => void;
  isRoomReady: boolean;
  setRoomReady: (ready: boolean) => void;
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  loadProgress: number;
  setLoadProgress: (progress: number) => void;
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
}));
