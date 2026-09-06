import type { Metadata } from "next";
import Link from "next/link";

import { LEARN_STYLES } from "@/lib/design";
import { COMPARISONS } from "@/lib/learn/scales/comparisons";
import { learnViewMetadata, metadataForSlugPage } from "@/lib/metadata";

export const metadata: Metadata = metadataForSlugPage(
  learnViewMetadata,
  "/learn/scales/comparisons",
  "Comparisons",
  "Pairs of scales on the same tonic, one note apart - what each degree changes and why.",
);

export default function ComparisonsIndexPage() {
  return (
    <>
      <Link href="/learn/scales" className={LEARN_STYLES.link}>
        ← Scales
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
