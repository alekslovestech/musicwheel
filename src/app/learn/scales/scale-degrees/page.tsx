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

      <h1 className={LEARN_STYLES.h1}>Scale Degrees</h1>

      <p>
        A scale degree is just a numbered position: 1 through 7, counting up from the tonic. Every
        mode has seven of them, but the numbers alone don&apos;t say what note actually sits at each
        position - for that, every mode gets measured against the same reference: Ionian, the major
        scale. Ionian&apos;s own seven notes are the plain, unaltered degrees - 1, 2, 3, 4, 5, 6,
        7, no sharps or flats attached - which is what makes it the yardstick everything else is
        described against, rather than one more mode with equal claim to the naming.
      </p>

      <ScaleFigure
        tonic="C"
        scaleType={ScaleModeType.Ionian}
        scalePlaybackMode={ScalePlaybackMode.DronedSingleNote}
        caption="C Ionian, the reference scale for the seven scale degrees."
        linearShowLabels
        isCompact
      />

      <p>Lydian is Ionian with the 4th degree raised a semitone: sharp 4.</p>

      <ScaleFigure
        tonic="C"
        scaleType={ScaleModeType.Lydian}
        scalePlaybackMode={ScalePlaybackMode.DronedSingleNote}
        caption="C Lydian: ♯4, a raised 4th degree (F♯)"
        linearShowLabels
        isCompact
      />

      <p>
        Aeolian (natural minor) is Ionian with the 3rd, 6th, and 7th degrees each lowered a
        semitone.
      </p>

      <ScaleFigure
        tonic="C"
        scaleType={ScaleModeType.Aeolian}
        scalePlaybackMode={ScalePlaybackMode.DronedSingleNote}
        caption="C Aeolian: ♭3, ♭6, and ♭7 (E♭, A♭, B♭) compared to C Ionian."
        linearShowLabels
        isCompact
      />

      <p>
        This is the same tonic held fixed while the degrees move - a{" "}
        <Link href="/learn/scales/relative-vs-parallel-modes" className={LEARN_STYLES.link}>
          parallel
        </Link>{" "}
        comparison. See{" "}
        <Link href="/learn/scales/comparisons" className={LEARN_STYLES.link}>
          Comparisons
        </Link>{" "}
        for more mode pairs described this way, one degree at a time. Chords, not just notes, get
        numbered from the tonic too - see{" "}
        <Link href="/learn/chords/roman-numerals" className={LEARN_STYLES.link}>
          Roman Numeral Notation
        </Link>
        .
      </p>
    </>
  );
}
