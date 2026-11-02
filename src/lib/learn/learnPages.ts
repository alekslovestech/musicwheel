export interface LearnPageInfo {
  href: string;
  title: string;
  /** One line on what the page is about - the same wherever it is linked from. */
  blurb: string;
}

/** The learn articles that other articles link to, with the title and blurb every link to them
 * shows (see SeeAlso), keyed by the last segment of the route. Keeping them here means one
 * wording per page, and a rename, move or retitle touches one place. The scale comparison
 * articles aren't listed: there are many, and a link to one says how the pair differs, which
 * depends on who is linking. */
export const LEARN_PAGES = {
  accidentals: {
    href: "/learn/approach/accidentals",
    title: "Accidentals",
    blurb: "Why the app plays down sharps and flats, and never shows a double sharp or flat",
  },
  "chromatic-circle": {
    href: "/learn/approach/chromatic-circle",
    title: "The Chromatic Circle",
    blurb: "Why a circle beats a line for seeing intervals and inversions",
  },
  "color-coding": {
    href: "/learn/approach/color-coding",
    title: "Color Coding",
    blurb: "What the colors on the wheel show",
  },
  "whats-useful-about-music-theory": {
    href: "/learn/approach/whats-useful-about-music-theory",
    title: "What's Useful About Music Theory",
    blurb: "The parts of theory that describe sound",
  },
  "whats-wrong-with-music-theory": {
    href: "/learn/approach/whats-wrong-with-music-theory",
    title: "What's Wrong with Music Theory",
    blurb: "The terms that depend on notation instead",
  },
  "chord-quality": {
    href: "/learn/chords/chord-quality",
    title: "Chord Quality",
    blurb: "A chord's shape: the pattern of intervals, whatever the root",
  },
  "major-vs-minor-triads": {
    href: "/learn/chords/major-vs-minor-triads",
    title: "Major and Minor Triads",
    blurb: "The two most common chords, on the chromatic circle",
  },
  "roman-numerals": {
    href: "/learn/chords/roman-numerals",
    title: "Roman Numeral Notation",
    blurb: "Numbering chords and progressions relative to the tonic",
  },
  "triad-inversions": {
    href: "/learn/chords/triad-inversions",
    title: "Triad Inversions",
    blurb: "The same chord, different bass note",
  },
  "interval-inversions": {
    href: "/learn/interval-inversions",
    title: "Interval Inversions",
    blurb: "An interval and its inversion add up to an octave",
  },
  scales: {
    href: "/learn/scales",
    title: "Scales",
    blurb: "How the scale patterns relate to each other",
  },
  comparisons: {
    href: "/learn/scales/comparisons",
    title: "Scale Comparisons",
    blurb: "Pairs of scales on the same tonic, one note apart",
  },
  "greek-modes": {
    href: "/learn/scales/greek-modes",
    title: "How the Greek Modes Relate to Each Other",
    blurb: "The most common family of scales",
  },
  harmonic: {
    href: "/learn/scales/harmonic",
    title: "What Makes a Scale “Harmonic”?",
    blurb: "The leading tone and the gaps that come with it",
  },
  "modal-families": {
    href: "/learn/scales/modal-families",
    title: "Modal Families Beyond the Major Scale",
    blurb: "Scales with rotation families of their own",
  },
  "relative-vs-parallel-modes": {
    href: "/learn/scales/relative-vs-parallel-modes",
    title: "Relative vs. Parallel Modes",
    blurb: "Same notes with a different tonic, or the same tonic with different notes",
  },
  "scale-degrees": {
    href: "/learn/scales/scale-degrees",
    title: "Scale Degrees",
    blurb: "What each numbered position in a scale is called",
  },
  "symmetry-and-dissonance": {
    href: "/learn/symmetry-and-dissonance",
    title: "Symmetry and Dissonance",
    blurb: "Why do symmetrical shapes sound unsettled",
  },
} as const satisfies Record<string, LearnPageInfo>;

export type LearnPageId = keyof typeof LEARN_PAGES;
