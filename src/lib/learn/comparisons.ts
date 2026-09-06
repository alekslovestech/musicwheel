export interface ScaleComparisonEntry {
  modeA: string;
  modeB: string;
  href: string;
}

/** Every published "off by one" comparison article - the single source both the /learn/comparisons
 * index page and the sitemap read from, so a new article can't be added to one and forgotten in
 * the other. */
export const COMPARISONS: ScaleComparisonEntry[] = [
  { modeA: "Minor", modeB: "Dorian", href: "/learn/comparisons/minor-vs-dorian" },
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
  { modeA: "Major", modeB: "Mixolydian", href: "/learn/comparisons/major-vs-mixolydian" },
  { modeA: "Major", modeB: "Lydian", href: "/learn/comparisons/major-vs-lydian" },
  { modeA: "Minor", modeB: "Harmonic Minor", href: "/learn/comparisons/minor-vs-harmonic-minor" },
  { modeA: "Major", modeB: "Harmonic Major", href: "/learn/comparisons/major-vs-harmonic-major" },
  { modeA: "Minor", modeB: "Phrygian", href: "/learn/comparisons/minor-vs-phrygian" },
  { modeA: "Locrian", modeB: "Phrygian", href: "/learn/comparisons/locrian-vs-phrygian" },
  {
    modeA: "Harmonic Minor",
    modeB: "Hungarian Minor",
    href: "/learn/comparisons/harmonic-minor-vs-hungarian-minor",
  },
];
