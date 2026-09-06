export interface ScaleComparisonEntry {
  modeA: string;
  modeB: string;
  href: string;
}

/** Every published "off by one" comparison article - the single source both the /learn/scales/comparisons
 * index page and the sitemap read from, so a new article can't be added to one and forgotten in
 * the other. Ordered by hand: Major pairs first, then Minor pairs, then everything else. */
export const COMPARISONS: ScaleComparisonEntry[] = [
  { modeA: "Major", modeB: "Mixolydian", href: "/learn/scales/comparisons/major-vs-mixolydian" },
  { modeA: "Major", modeB: "Lydian", href: "/learn/scales/comparisons/major-vs-lydian" },
  {
    modeA: "Major",
    modeB: "Harmonic Major",
    href: "/learn/scales/comparisons/major-vs-harmonic-major",
  },
  {
    modeA: "Major",
    modeB: "Melodic Minor",
    href: "/learn/scales/comparisons/major-vs-melodic-minor",
  },
  { modeA: "Minor", modeB: "Dorian", href: "/learn/scales/comparisons/minor-vs-dorian" },
  {
    modeA: "Minor",
    modeB: "Harmonic Minor",
    href: "/learn/scales/comparisons/minor-vs-harmonic-minor",
  },
  { modeA: "Minor", modeB: "Phrygian", href: "/learn/scales/comparisons/minor-vs-phrygian" },
  {
    modeA: "Phrygian",
    modeB: "Phrygian Dominant",
    href: "/learn/scales/comparisons/phrygian-vs-phrygian-dominant",
  },
  {
    modeA: "Dorian",
    modeB: "Ukrainian Dorian",
    href: "/learn/scales/comparisons/dorian-vs-ukrainian-dorian",
  },
  {
    modeA: "Harmonic Minor",
    modeB: "Melodic Minor",
    href: "/learn/scales/comparisons/harmonic-minor-vs-melodic-minor",
  },
  {
    modeA: "Harmonic Major",
    modeB: "Double Harmonic Major",
    href: "/learn/scales/comparisons/harmonic-major-vs-double-harmonic-major",
  },
  {
    modeA: "Double Harmonic Major",
    modeB: "Panthu Varaali",
    href: "/learn/scales/comparisons/double-harmonic-major-vs-panthu-varaali",
  },
  { modeA: "Locrian", modeB: "Phrygian", href: "/learn/scales/comparisons/locrian-vs-phrygian" },
  {
    modeA: "Harmonic Minor",
    modeB: "Hungarian Minor",
    href: "/learn/scales/comparisons/harmonic-minor-vs-hungarian-minor",
  },
];
