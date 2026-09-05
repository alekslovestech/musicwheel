import type { Metadata } from "next";
import Link from "next/link";

import { LEARN_STYLES } from "@/lib/design";
import { learnViewMetadata, metadataForSlugPage } from "@/lib/metadata";

export const metadata: Metadata = metadataForSlugPage(
  learnViewMetadata,
  "/learn/comparisons",
  "Comparisons",
  "Pairs of scales on the same tonic, one note apart - what each degree changes and why.",
);

const COMPARISONS: { modeA: string; modeB: string; href: string }[] = [
  { modeA: "Aeolian", modeB: "Dorian", href: "/learn/comparisons/aeolian-vs-dorian" },
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
  { modeA: "Ionian", modeB: "Mixolydian", href: "/learn/comparisons/ionian-vs-mixolydian" },
  { modeA: "Ionian", modeB: "Lydian", href: "/learn/comparisons/ionian-vs-lydian" },
  { modeA: "Minor", modeB: "Harmonic Minor", href: "/learn/comparisons/minor-vs-harmonic-minor" },
  { modeA: "Major", modeB: "Harmonic Major", href: "/learn/comparisons/major-vs-harmonic-major" },
  { modeA: "Aeolian", modeB: "Phrygian", href: "/learn/comparisons/aeolian-vs-phrygian" },
  { modeA: "Locrian", modeB: "Phrygian", href: "/learn/comparisons/locrian-vs-phrygian" },
  {
    modeA: "Harmonic Minor",
    modeB: "Hungarian Minor",
    href: "/learn/comparisons/harmonic-minor-vs-hungarian-minor",
  },
];

export default function ComparisonsIndexPage() {
  return (
    <>
      <Link href="/learn" className={LEARN_STYLES.link}>
        ← Learn
      </Link>

      <h1 className="text-3xl font-semibold">Comparisons</h1>
      <p>Two modes on the same tonic, one note apart.</p>

      <table className="w-full border-collapse text-left">
        <tbody>
          {COMPARISONS.map(({ modeA, modeB, href }) => (
            <tr key={href} className={LEARN_STYLES.comparisonTableRow}>
              <td className="p-0">
                <Link href={href} className={LEARN_STYLES.comparisonTableCellLink}>
                  {modeA}
                </Link>
              </td>
              <td className="p-0">
                <Link href={href} className={LEARN_STYLES.comparisonTableCellLink}>
                  {modeB}
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
