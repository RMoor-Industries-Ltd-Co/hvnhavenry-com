/**
 * Hero / brand copy — the single source of truth for on-screen language.
 *
 * These are PLACEHOLDER values. The company lexicon lives in Notion and is the
 * real source of truth; this module is the seam where that content gets
 * hydrated. When the Notion integration lands, replace these exports with the
 * fetched values (or feed them in via props) — nothing else in the UI should
 * need to change.
 *
 * Deliberately NOT included: the rejected "Set the room / Live in the
 * atmosphere" line. Do not reintroduce brand taglines here by hand — pull them
 * from Notion.
 */

export interface HeroContent {
  /** Small tracked label above the headline. */
  eyebrow: string;
  /** Two-line display headline. The second line renders in italic accent. */
  headingLines: [string, string];
  /** Supporting paragraph under the headline. */
  body: string;
  /** Brand pillars rendered as a tracked row. Empty array hides the row. */
  pillars: string[];
  /** Label on the "enter the live 3D room" control. */
  enterLabel: string;
}

export const heroContent: HeroContent = {
  eyebrow: "The Great Room Experience",
  headingLines: ["Rooms only", "one can dream of"],
  body:
    "A curated great room for the discerning few. Explore the space — select any piece to discover its story.",
  pillars: ["Discipline", "Focus", "Execution", "Legacy"],
  enterLabel: "Enter the live room",
};

/**
 * Placeholder body copy. Real prose arrives from Notion. Kept as a single
 * constant so it's trivial to find and rip out later.
 */
export const LOREM =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";

export const LOREM_LONG =
  LOREM +
  " Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

/**
 * The five default editorial sections shown below the hero when no product is
 * selected. Order here is render order. Copy is placeholder lorem; titles are
 * final. `linkLabel` is the section's call-to-action (separate page flow later).
 */
export interface InfoSectionContent {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  linkLabel: string;
}

export const infoSections: InfoSectionContent[] = [
  {
    id: "how-to-use",
    eyebrow: "Orientation",
    title: "How to use this site",
    body: LOREM,
    linkLabel: "Begin the tour",
  },
  {
    id: "what-is-a-havenry",
    eyebrow: "Philosophy",
    title: "What is a Havenry",
    body: LOREM_LONG,
    linkLabel: "Read the philosophy",
  },
  {
    id: "setting-the-tone",
    eyebrow: "The Ritual",
    title: "Setting the Tone for your Atmospheric Jurisdiction",
    body: LOREM_LONG,
    linkLabel: "Explore the ritual",
  },
  {
    id: "curated-appointments",
    eyebrow: "Bespoke",
    title: "Curated Appointments",
    body: LOREM,
    linkLabel: "Request an appointment",
  },
  {
    id: "what-next",
    eyebrow: "Onward",
    title: "What next?",
    body: LOREM,
    linkLabel: "Continue",
  },
];

/**
 * Top-navigation links. Each opens an in-page panel whose copy flies in from
 * the right. These become their own page routes in a later pass — for now the
 * panel + lorem stands in for that flow.
 */
export interface NavLinkContent {
  id: string;
  label: string;
  title: string;
  body: string;
}

export const navLinks: NavLinkContent[] = [
  { id: "the-room", label: "The Room", title: "The Room", body: LOREM_LONG },
  { id: "collections", label: "Collections", title: "Collections", body: LOREM_LONG },
  { id: "bespoke", label: "Bespoke", title: "Bespoke", body: LOREM_LONG },
  { id: "contact", label: "Contact", title: "Contact", body: LOREM },
];

/** "Join our newsletter" block shown beneath the product detail. */
export const newsletterContent = {
  eyebrow: "Stay in the room",
  title: "Join our newsletter",
  body:
    "Be first to new pieces, private appointments, and the quiet rituals of the house.",
  placeholder: "Your email address",
  cta: "Subscribe",
};
