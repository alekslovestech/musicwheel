import type { Metadata } from "next";
import Link from "next/link";

import { ScaleDegreeComparison } from "@/components/Learn/ScaleDegreeComparison";
import { SingleScaleFigure } from "@/components/Learn/SingleScaleFigure";
import { LEARN_STYLES } from "@/lib/design";
import { learnViewMetadata, metadataForSlugPage } from "@/lib/metadata";
import { ScaleModeType } from "@/types/enums/ScaleModeType";
import { ixScaleDegree } from "@/types/ScaleModes/ScaleDegreeType";

export const metadata: Metadata = metadataForSlugPage(
  learnViewMetadata,
  "/learn/relative-vs-parallel-modes",
  "Relative vs. Parallel Modes",
  "The two ways any two modes can relate: relative modes share every note at a different tonic; parallel modes share a tonic with different notes.",
);

export default function RelativeVsParallelModesPage() {
  return (
    <>
      <Link href="/learn" className={LEARN_STYLES.link}>
        ← Learn
      </Link>

      <h1 className="text-3xl font-semibold">Relative vs. Parallel Modes</h1>

      <p>
        Any two modes are related to each other in one of two ways, depending on what you hold
        fixed. Keep the notes the same and move the tonic, and you get relative modes. Keep the
        tonic the same and move the notes, and you get parallel modes.
      </p>

      <h2 className="text-xl font-semibold">Relative: C Ionian and F Lydian</h2>

      <p>
        C Ionian and F Lydian are built from the exact same seven notes - the white keys on a piano
        - just started from a different one: F is the fourth note of that same C Ionian scale, and
        starting those seven white keys there instead gives Lydian. Because the note collection is
        identical, the pattern of whole and half steps between neighboring notes is identical too,
        at the same physical points around the wheel. Only the flag marking the tonic moves.
      </p>

      <div className={LEARN_STYLES.comparisonGrid}>
        <SingleScaleFigure
          tonic="C"
          scaleMode={ScaleModeType.Ionian}
          showStepAnnotations
          caption="C Ionian: seven colored arcs, one whole or half step apart."
        />
        <SingleScaleFigure
          tonic="F"
          scaleMode={ScaleModeType.Lydian}
          showStepAnnotations
          caption="F Lydian: the same seven arcs, in the same places on the wheel - only the flag has
            moved."
        />
      </div>

      <p>
        That&apos;s the test for whether two modes are relative: if every colored arc lines up in
        the same spot on the wheel and only the tonic flag differs, the notes never changed - you
        only rotated which one counts as home.
      </p>

      <h2 className="text-xl font-semibold">Parallel: C Ionian and C Lydian</h2>

      <p>
        C Ionian and C Lydian keep the same tonic, but they are not the same seven notes. They
        differ on exactly one degree - the fourth, natural in Ionian and sharp in Lydian - which is
        the whole reason Lydian has its floating, unresolved quality.
      </p>

      <ScaleDegreeComparison
        modeA={ScaleModeType.Ionian}
        modeB={ScaleModeType.Lydian}
        degree={ixScaleDegree(4)}
        captionA="C Ionian holds a natural fourth against the tonic - the darker of the two."
        captionB="C Lydian raises that fourth by a semitone, into a sharp four."
      />

      <p>
        Unlike relative modes, which always share every note by definition, parallel modes can
        differ by as little as one note or by several, depending on which two modes you pick. For a
        closer look at this exact pair, see{" "}
        <Link href="/learn/comparisons/major-vs-lydian" className={LEARN_STYLES.link}>
          Major vs. Lydian
        </Link>
        , or{" "}
        <Link href="/learn/comparisons" className={LEARN_STYLES.link}>
          Comparisons
        </Link>{" "}
        for others like it.
      </p>

      <p>
        Notice both examples above reach for the same two modes, Ionian and Lydian - only the tonic
        assigned to Lydian changes. Give it F, and it&apos;s relative to C Ionian: same notes,
        different home. Give it C instead, and it&apos;s parallel: same home, different notes.
        Relative and parallel aren&apos;t opposites so much as two different questions you can ask
        about the same pair of modes - for the fuller picture, including how the modes are numbered
        and why relative modes always share the same chords, see{" "}
        <Link href="/learn/greek-modes" className={LEARN_STYLES.link}>
          How the Greek Modes Relate to Each Other
        </Link>
        .
      </p>
    </>
  );
}
