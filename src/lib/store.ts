"use client";

import { create } from "zustand";
import { COLLECTION_ORDER, ProductId } from "./products";

interface HavenStore {
  // Section 3 — interactive room tabs
  activeCollection: string;
  setActiveCollection: (collection: string) => void;
  activeTabItem: ProductId | null;
  setActiveTabItem: (id: ProductId | null) => void;

  // Section 4 — always-open promo / film player. null = the default promo reel.
  activeVideoProduct: ProductId | null;
  openVideo: (id: ProductId) => void;
  resetVideo: () => void;

  // Shared smooth-scroll handle (set once Lenis is initialized on the page).
  // onComplete fires when the programmatic scroll finishes landing on the section,
  // so callers can sequence an action to the exact moment the section arrives.
  scrollToSection: ((id: string, onComplete?: () => void) => void) | null;
  setScrollToSection: (fn: (id: string, onComplete?: () => void) => void) => void;

  // Which top-level section owns the nav right now (drives the stacked NavBar)
  // 0 = hero, 1 = scroll-story, 2 = collection/room and beyond
  activeNavSection: number;
  setActiveNavSection: (section: number) => void;

  // Vale, the concierge — brief confirmation moments surfaced across the site
  valeMoment: "add-to-cart" | "cart-checkout" | null;
  triggerValeMoment: (moment: "add-to-cart" | "cart-checkout") => void;
  dismissValeMoment: () => void;

  // Vale, summoned — the full-height concierge who flies in from the left of the
  // screen once "Speak to Concierge" has scrolled the visitor to the showroom (S3).
  conciergeSummoned: boolean;
  summonConcierge: () => void;
  dismissConcierge: () => void;
}

export const useHavenStore = create<HavenStore>((set) => ({
  activeCollection: COLLECTION_ORDER[0],
  setActiveCollection: (collection) =>
    set({ activeCollection: collection, activeTabItem: null }),
  activeTabItem: null,
  setActiveTabItem: (id) => set({ activeTabItem: id }),

  activeVideoProduct: null,
  openVideo: (id) => set({ activeVideoProduct: id }),
  resetVideo: () => set({ activeVideoProduct: null }),

  scrollToSection: null,
  setScrollToSection: (fn) => set({ scrollToSection: fn }),

  activeNavSection: 0,
  setActiveNavSection: (section) => set({ activeNavSection: section }),

  valeMoment: null,
  triggerValeMoment: (moment) => set({ valeMoment: moment }),
  dismissValeMoment: () => set({ valeMoment: null }),

  conciergeSummoned: false,
  summonConcierge: () => set({ conciergeSummoned: true }),
  dismissConcierge: () => set({ conciergeSummoned: false }),
}));
