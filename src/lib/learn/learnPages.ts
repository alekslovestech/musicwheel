import { LearnTag } from "@/types/enums/LearnTag";

export interface LearnPageInfo {
  href: string;
  title: string;
  /** One line on what the page is about - the same wherever it is linked from. */
  blurb: string;
  // Slug of the page's link-preview image in public/thumbnails, shown on its NextCard.
  thumbnail?: string;
  // Topic badges shown after the page's title in an index.
  tags?: readonly LearnTag[];
  // True for a page that lists other pages (Learn and its sections), so an index links to it in
  // the section style.
  isIndex?: true;
  // The id of the page this one sits under, where its back link goes. Every page in LEARN_PAGES
  // has one but Learn itself (checked by the tests); optional only so a one-off SeeAlso item
  // needn't.
  parent?: string;
}

/** The learn pages that other pages link to, articles and index pages alike, with the title and
 * blurb every link to them shows (see SeeAlso), keyed by the last segment of the route. Keeping
 * them here means one wording per page, and a rename, move or retitle touches one place. The
 * scale comparison articles aren't listed: there are many, and a link to one says how the pair
 * differs, which depends on who is linking. */
export const LEARN_PAGES = {
  learn: {
    href: "/learn",
    title: "Learn",
    isIndex: true,
    blurb: "Short written guides to the ideas the Music Wheel app lets you hear",
  },
  approach: {
    href: "/learn/approach",
    parent: "learn",
    title: "Approach",
    isIndex: true,
    blurb: "The idea behind the app: the chromatic circle, and the parts of theory it makes easier to see",
  },
  chords: {
    href: "/learn/chords",
    parent: "learn",
    title: "Intervals and Chords",
    isIndex: true,
    blurb: "Interval inversions, major vs. minor, chord quality, and how a triad keeps its identity through its inversions",
  },
  progressions: {
    href: "/learn/progressions",
    parent: "learn",
    title: "Progressions",
    isIndex: true,
    blurb: "What a chord progression is, a few common ones, and how roman numerals number them from the tonic",
  },
  "side-tracks": {
    href: "/learn/side-tracks",
    parent: "learn",
    title: "Side Tracks",
    isIndex: true,
    blurb: "Optional reading for the curious",
  },
  accidentals: {
    href: "/learn/approach/accidentals",
    parent: "approach",
    title: "Accidentals",
    blurb: "Why the app plays down sharps and flats, and never shows a double sharp or flat",
  },
  "chromatic-circle": {
    href: "/learn/approach/chromatic-circle",
    parent: "approach",
    title: "The Chromatic Circle",
    tags: [LearnTag.Geometry],
    blurb: "Why a circle beats a line for seeing intervals and inversions, and how it compares to the circle of fifths",
    thumbnail: "chromatic-circle",
  },
  "color-coding": {
    href: "/learn/approach/color-coding",
    parent: "approach",
    title: "Color Coding",
    tags: [LearnTag.Geometry],
    blurb: "What the colors on the wheel show",
    thumbnail: "color-coding",
  },
  "chord-color-formula": {
    href: "/learn/approach/chord-color-formula",
    parent: "side-tracks",
    title: "How Chord Colors Are Computed",
    tags: [LearnTag.Geometry],
    blurb: "The full recipe behind a chord's color: its intervals, their weights, and the mix",
  },
  "whats-useful-about-music-theory": {
    href: "/learn/approach/whats-useful-about-music-theory",
    parent: "approach",
    title: "What's Useful About Music Theory",
    blurb: "The parts of theory that describe sound",
    thumbnail: "whats-useful-about-music-theory",
  },
  "chord-progressions": {
    href: "/learn/progressions/chord-progressions",
    parent: "progressions",
    title: "Chord Progressions",
    tags: [LearnTag.BasicConcepts],
    blurb: "A sequence of chords, recognized by how it moves from the tonic",
  },
  cadences: {
    href: "/learn/progressions/cadences",
    parent: "progressions",
    title: "Cadences",
    tags: [LearnTag.BasicConcepts],
    blurb: "The short progressions that close a phrase",
  },
  "whats-wrong-with-music-theory": {
    href: "/learn/approach/whats-wrong-with-music-theory",
    parent: "side-tracks",
    title: "What's Wrong with Music Theory",
    blurb: "The terms that depend on notation rather than sound",
    thumbnail: "whats-wrong-with-music-theory",
  },
  "music-theory-on-the-chromatic-circle": {
    href: "/learn/approach/music-theory-on-the-chromatic-circle",
    parent: "approach",
    title: "Music Theory on the Chromatic Circle",
    blurb: "The same intervals, chords, progressions and scales, drawn on the chromatic circle instead of written",
  },
  "chord-quality": {
    href: "/learn/chords/chord-quality",
    parent: "chords",
    title: "Chord Quality",
    tags: [LearnTag.BasicConcepts, LearnTag.Essential],
    blurb: "A chord's shape: the pattern of intervals, whatever the root",
  },
  "major-vs-minor-triads": {
    href: "/learn/chords/major-vs-minor-triads",
    parent: "chords",
    title: "Major and Minor Triads",
    tags: [LearnTag.BasicConcepts, LearnTag.Essential],
    blurb: "The two most common chords, on the chromatic circle",
  },
  "roman-numerals": {
    href: "/learn/chords/roman-numerals",
    parent: "progressions",
    title: "Roman Numeral Notation",
    tags: [LearnTag.BasicConcepts, LearnTag.Essential],
    blurb: "Numbering chords and progressions relative to the tonic",
  },
  "triad-inversions": {
    href: "/learn/chords/triad-inversions",
    parent: "chords",
    title: "Triad Inversions",
    tags: [LearnTag.BasicConcepts, LearnTag.Essential],
    blurb: "The same chord, different bass note",
  },
  "interval-inversions": {
    href: "/learn/interval-inversions",
    parent: "chords",
    title: "Interval Inversions",
    tags: [LearnTag.BasicConcepts],
    blurb: "An interval and its inversion add up to an octave",
  },
  scales: {
    href: "/learn/scales",
    parent: "learn",
    title: "Scales",
    isIndex: true,
    blurb: "How the scale patterns relate to each other",
  },
  comparisons: {
    href: "/learn/scales/comparisons",
    parent: "scales",
    title: "Scale Comparisons",
    tags: [LearnTag.Scales],
    isIndex: true,
    blurb: "Pairs of scales on the same tonic, one note apart",
  },
  "greek-modes": {
    href: "/learn/scales/greek-modes",
    parent: "scales",
    title: "How the Greek Modes Relate to Each Other",
    tags: [LearnTag.Scales, LearnTag.Essential],
    blurb: "The most common family of scales",
  },
  harmonic: {
    href: "/learn/scales/harmonic",
    parent: "scales",
    title: "What Makes a Scale “Harmonic”?",
    tags: [LearnTag.BasicConcepts, LearnTag.Scales],
    blurb: "The 3-semitone gap these scales share, and where it falls",
  },
  "melodic-minor-modes": {
    href: "/learn/scales/melodic-minor-modes",
    parent: "modal-families",
    title: "Modes of Melodic Minor",
    tags: [LearnTag.Scales],
    blurb: "Melodic Minor's rotation family, mostly known through jazz",
  },
  "modal-families": {
    href: "/learn/scales/modal-families",
    parent: "scales",
    title: "Modal Families Beyond the Major Scale",
    tags: [LearnTag.Scales],
    blurb: "Scales with rotation families of their own",
  },
  "relative-vs-parallel-modes": {
    href: "/learn/scales/relative-vs-parallel-modes",
    parent: "scales",
    title: "Relative vs. Parallel Modes",
    tags: [LearnTag.BasicConcepts, LearnTag.Essential],
    blurb: "Same notes with a different tonic, or the same tonic with different notes",
  },
  "scale-degrees": {
    href: "/learn/scales/scale-degrees",
    parent: "scales",
    title: "Scale Degrees",
    tags: [LearnTag.BasicConcepts, LearnTag.Essential],
    blurb: "Numbering a scale's notes against the major scale: ♭3, ♯4 and the rest",
  },
  "symmetry-and-dissonance": {
    href: "/learn/symmetry-and-dissonance",
    parent: "side-tracks",
    title: "Symmetry and Dissonance",
    tags: [LearnTag.Geometry],
    blurb: "Why do symmetrical shapes sound unsettled?",
  },
} as const satisfies Record<string, LearnPageInfo>;

export type LearnPageId = keyof typeof LEARN_PAGES;

export interface LearnPath {
  title: string;
  // Where the path's pages are listed.
  href: string;
  pages: readonly LearnPageId[];
}

/** Reading paths: short sequences meant to be read in order, each building on the last.
 * ArticleNav gives every page in a path its Previous/Next and its "n of m". `start` is the spine
 * (the app's idea); the others are topic paths entered after it. A page belongs to at most one
 * path; anything outside every path is a standalone piece (see CLAUDE.md). */
export const LEARN_PATHS = {
  start: {
    title: "Start here",
    href: "/learn/approach",
    pages: [
      "chromatic-circle",
      "whats-useful-about-music-theory",
      "music-theory-on-the-chromatic-circle",
    ],
  },
  scales: {
    title: "Scales",
    href: "/learn/scales",
    pages: [
      "scale-degrees",
      "greek-modes",
      "relative-vs-parallel-modes",
      "harmonic",
      "modal-families",
    ],
  },
} as const satisfies Record<string, LearnPath>;

export type LearnPathId = keyof typeof LEARN_PATHS;

// Reading order of the paths: where a path's last page sends the reader next.
export const LEARN_PATH_ORDER: readonly LearnPathId[] = ["start", "scales"];

// The path holding a page, and the page's position in it; undefined for a standalone piece.
export function findLearnPath(id: LearnPageId): { pathId: LearnPathId; index: number } | undefined {
  for (const pathId of LEARN_PATH_ORDER) {
    const index = (LEARN_PATHS[pathId].pages as readonly LearnPageId[]).indexOf(id);
    if (index !== -1) return { pathId, index };
  }
  return undefined;
}

// Groupings: pages on one topic with no order between them, listed on the section's index page.
// Unlike a path, a grouping gives its pages no Previous/Next - each ends with a card of its own.
export const LEARN_GROUPS = {
  chords: {
    title: LEARN_PAGES.chords.title,
    href: LEARN_PAGES.chords.href,
    pages: [
      "interval-inversions",
      "major-vs-minor-triads",
      "chord-quality",
      "triad-inversions",
    ],
  },
  progressions: {
    title: LEARN_PAGES.progressions.title,
    href: LEARN_PAGES.progressions.href,
    pages: ["chord-progressions", "cadences", "roman-numerals"],
  },
} as const satisfies Record<string, LearnPath>;

// A path as a link into its 1st page: the path's name, with that page's blurb.
export function learnPathEntry(pathId: LearnPathId): LearnPageInfo {
  const { title, pages } = LEARN_PATHS[pathId];
  const first: LearnPageInfo = LEARN_PAGES[pages[0]];
  return { href: first.href, title, blurb: first.blurb, thumbnail: first.thumbnail };
}

// Where a finished path sends the reader. The spine leads to every topic section, grouping or
// path; any other path leads nowhere in particular.
export function pathContinuations(pathId: LearnPathId): LearnPageInfo[] {
  if (pathId !== "start") return [];
  const { chords, progressions } = LEARN_GROUPS;
  return [
    {
      href: chords.href,
      title: chords.title,
      blurb: "Intervals and the chords built from them: what makes one major or minor, and how it's labeled.",
    },
    {
      href: progressions.href,
      title: progressions.title,
      blurb: LEARN_PAGES["chord-progressions"].blurb,
    },
    learnPathEntry("scales"),
  ];
}

// The top-level section a page belongs to: the page just under Learn, found by following parents
// up (Learn itself for any page that has none).
export function learnTopicOf(id: LearnPageId): LearnPageId {
  let current: LearnPageId = id;
  for (let depth = 0; depth < 5; depth++) {
    const parent = (LEARN_PAGES[current] as LearnPageInfo).parent as LearnPageId | undefined;
    if (!parent || parent === "learn") return current;
    current = parent;
  }
  throw new Error(`learnTopicOf: "${id}" doesn't lead up to a section`);
}
