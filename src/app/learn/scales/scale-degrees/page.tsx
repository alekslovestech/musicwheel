import type { Metadata } from "next";
import Link from "next/link";

import { ScaleFigure } from "@/components/Learn/ScaleFigure";
import { LEARN_STYLES } from "@/lib/design";
import { learnViewMetadata, metadataForSlugPage } from "@/lib/metadata";
import { ScaleModeType } from "@/types/enums/ScaleModeType";
import { ScalePlaybackMode } from "@/types/enums/ScalePlaybackMode";

export const metadata: Metadata = metadataForSlugPage(
  learnViewMetadata,
  "/learn/scales/scale-degrees",
  "Scale Degrees",
  "What each numbered position in a scale is called, and why the names matter.",
);

export default function ScaleDegreesPage() {
  return (
    <>
      <Link href="/learn/scales" className={LEARN_STYLES.link}>
        ← Scales
      </Link>

      <h1 className="text-3xl font-semibold">Scale Degrees</h1>

      <p>More to come.</p>

      <ScaleFigure
        tonic="C"
        scaleType={ScaleModeType.Ionian}
        scalePlaybackMode={ScalePlaybackMode.DronedSingleNote}
        caption="C Ionian, the reference scale for the seven scale degrees."
        linearShowLabels = {true}
      />

      <ScaleFigure
        tonic="C"
        scaleType={ScaleModeType.Lydian}
        scalePlaybackMode={ScalePlaybackMode.DronedSingleNote}
        caption="C Lydian, a raised 4th degree (F#) compared to C Ionian."
        linearShowLabels = {true}
      />
    </>
  );
}
