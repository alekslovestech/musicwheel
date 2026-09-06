export interface ScaleComparisonEntry {
  modeA: string;
  modeB: string;
  href: string;
}

/** Every published "off by one" comparison article - the single source both the /learn/comparisons
 * index page and the sitemap read from, so a new article can't be added to one and forgotten in
 * the other. Ordered by hand: Major pairs first, then Minor pairs, then everything else. */
export const COMPARISONS: ScaleComparisonEntry[] = [
  { modeA: "Major", modeB: "Mixolydian", href: "/learn/comparisons/major-vs-mixolydian" },
  { modeA: "Major", modeB: "Lydian", href: "/learn/comparisons/major-vs-lydian" },
  { modeA: "Major", modeB: "Harmonic Major", href: "/learn/comparisons/major-vs-harmonic-major" },
  {
    modeA: "Major",
    modeB: "Melodic Minor",
    href: "/learn/comparisons/major-vs-melodic-minor",
  },
  { modeA: "Minor", modeB: "Dorian", href: "/learn/comparisons/minor-vs-dorian" },
  { modeA: "Minor", modeB: "Harmonic Minor", href: "/learn/comparisons/minor-vs-harmonic-minor" },
  { modeA: "Minor", modeB: "Phrygian", href: "/learn/comparisons/minor-vs-phrygian" },
  {
    modeA: "Phrygian",
    modeB: "Phrygian Dominant",
    href: "/learn/comparisons/phrygian-vs-phrygian-dominant",
  },
  {
    modeA: "Dorian",
    modeB: "Ukrainian Dorian",
    href: "/learn/comparisons/dorian-vs-ukrainian-dorian",
  },
  {
    modeA: "Harmonic Minor",
    modeB: "Melodic Minor",
    href: "/learn/comparisons/harmonic-minor-vs-melodic-minor",
  },
  {
    modeA: "Harmonic Major",
    modeB: "Double Harmonic Major",
    href: "/learn/comparisons/harmonic-major-vs-double-harmonic-major",
  },
  {
    modeA: "Double Harmonic Major",
    modeB: "Panthu Varaali",
    href: "/learn/comparisons/double-harmonic-major-vs-panthu-varaali",
  },
  { modeA: "Locrian", modeB: "Phrygian", href: "/learn/comparisons/locrian-vs-phrygian" },
  {
    modeA: "Harmonic Minor",
    modeB: "Hungarian Minor",
    href: "/learn/comparisons/harmonic-minor-vs-hungarian-minor",
  },
];
