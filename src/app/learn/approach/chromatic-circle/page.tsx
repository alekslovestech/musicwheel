import type { Metadata } from "next";
import Link from "next/link";

import { ComparisonGrid2 } from "@/components/Learn/ComparisonGrid";
import { GoodForRow } from "@/components/Learn/GoodForRow";
import { StaticChordFigure } from "@/components/Learn/StaticChordFigure";
import { LEARN_STYLES } from "@/lib/design";
import { learnViewMetadata, metadataForSlugPage } from "@/lib/metadata";
import { ChordType } from "@/types/enums/ChordType";
import { IntervalType } from "@/types/enums/IntervalType";
import { SpecialType } from "@/types/enums/SpecialType";

export const metadata: Metadata = metadataForSlugPage(
  learnViewMetadata,
  "/learn/approach/chromatic-circle",
  "The Chromatic Circle",
  "Why arranging the twelve notes in a circle instead of a line makes intervals and inversions easier to see - and how that's different from the circle of fifths.",
);

export default function ChromaticCirclePage() {
  return (
    <>
      <Link href="/learn/approach" className={LEARN_STYLES.link}>
        ← Approach
      </Link>

      <h1 className={LEARN_STYLES.h1}>The Chromatic Circle</h1>

      <p>
        A keyboard or a staff lays the twelve notes out in a line. The chromatic circle bends that
        same line into a loop:
      </p>

      <StaticChordFigure
        rootNote="C"
        chordType={SpecialType.None}
        inversionIndex={0}
        caption="The same twelve notes, as a line and as a circle."
        isCompact={true}
        showLabels={true}
      />

      <h2 className={LEARN_STYLES.h2}>Intervals as distance</h2>

      <p>
        On a linear keyboard, where an interval sits changes how it looks - e.g. it can depend on
        whether we start on a black or a white key. On the circle, an interval is just an angular
        distance between two points, and that distance is the same wherever the two points happen to
        sit. A major 3rd starting on C and a major 3rd starting on C♯ are the same arc, just rotated
        to a different starting point:
      </p>

      <ComparisonGrid2>
        <StaticChordFigure
          rootNote="C"
          chordType={IntervalType.Major3}
          inversionIndex={0}
          caption="C to E: a major 3rd."
          isCompact
        />
        <StaticChordFigure
          rootNote="C#"
          chordType={IntervalType.Major3}
          inversionIndex={0}
          caption={
            "C♯ to F: also a major 3rd\nlooks very different on a linear keyboard, but exactly the same on the circular one"
          }
          isCompact
        />
      </ComparisonGrid2>

      <p>
        Nothing about the shape changes depending on which key you&apos;re in, the way the same
        interval can look visually different in different positions on a keyboard or a staff. The
        same holds for a chord: a C major triad and a D♭ major triad are the same three-note shape,
        just rotated to a different starting point.
      </p>

      <ComparisonGrid2>
        <StaticChordFigure
          rootNote="C"
          chordType={ChordType.Major}
          inversionIndex={0}
          caption="C major."
          isCompact
        />
        <StaticChordFigure
          rootNote="Db"
          chordType={ChordType.Major}
          inversionIndex={0}
          caption={
            "D♭ major\nlooks unrelated on a linear keyboard, but exactly the same shape on the circular one"
          }
          isCompact
        />
      </ComparisonGrid2>

      <h2 className={LEARN_STYLES.h2}>Inversions become intuitive</h2>

      <p>
        The same circle makes both kinds of inversion visible instead of abstract. An{" "}
        <Link href="/learn/interval-inversions" className={LEARN_STYLES.link}>
          interval&apos;s inversion
        </Link>{" "}
        is just the same two points read around the circle the other way; a{" "}
        <Link href="/learn/chords/triad-inversions" className={LEARN_STYLES.link}>
          chord&apos;s inversion
        </Link>{" "}
        is the same wedges lit up with a different bass note marked. 
      </p>

      <h2 className={LEARN_STYLES.h2}>What about the Circle of Fifths?</h2>

      <p>
        This is a question I get a lot. Indeed the{" "}
        <Link
          href="https://www.circlefifth.com/app"
          className={LEARN_STYLES.link}
          target="_blank"
          rel="noopener noreferrer"
        >
          Circle of Fifths
        </Link>{" "}
        is a related, well-covered idea - which helps us explore key signatures, which keys share
        the most notes. It&apos;s a useful concept, and plenty of good material already explains it
        well; it&apos;s just not what we&apos;re here to explore. The chromatic circle in this app
        answers a different question: what an interval or a chord actually sounds like, by ear.
      </p>

      <table className="w-full border-collapse text-left">
        <thead>
          <tr className={LEARN_STYLES.comparisonTableRow}>
            <th className="px-snug py-tight">Good for...</th>
            <th className="w-1/4 px-snug py-tight text-center">Chromatic Circle</th>
            <th className="w-1/4 px-snug py-tight text-center">Circle of Fifths</th>
          </tr>
        </thead>
        <tbody>
          <GoodForRow concept="Notes arranged in a circle" chromatic fifths />
          <GoodForRow concept="Intuition around intervals" chromatic fifths={false} />
          <GoodForRow concept="Intuition around interval and chord inversions" chromatic fifths={false} />
          <GoodForRow concept="Key signatures and accidentals" chromatic={false} fifths />
          <GoodForRow concept="Which keys share the most notes" chromatic={false} fifths />
        </tbody>
      </table>
    </>
  );
}
