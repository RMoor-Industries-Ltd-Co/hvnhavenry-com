/**
 * Hero / brand copy — the single source of truth for on-screen language.
 *
 * These are PLACEHOLDER values. The company lexicon lives in Notion and is the
 * real source of truth; this module is the seam where that content gets
 * hydrated. When the Notion integration lands, replace `heroContent` with the
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
