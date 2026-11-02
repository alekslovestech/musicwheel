import type { Metadata } from "next";
import Link from "next/link";

import { ComparisonGrid2 } from "@/components/Learn/layout/ComparisonGrid";
import { ScaleFigure } from "@/components/Learn/figures/ScaleFigure";
import { SeeAlso } from "@/components/Learn/prose/SeeAlso";
import { LEARN_STYLES } from "@/lib/design";
import { learnViewMetadata, metadataForSlugPage } from "@/lib/metadata";
import { ScaleModeType } from "@/types/enums/ScaleModeType";

export const metadata: Metadata = metadataForSlugPage(
  learnViewMetadata,
  "/learn/scales/greek-modes",
  "How the Greek Modes Relate to Each Other",
  "The traditional names and order of the seven Greek modes, and how they're all one scale started from a different degree.",
);

export default function GreekModesPage() {
  return (
    <>
      <Link href="/learn/scales" className={LEARN_STYLES.link}>
        ← Scales
      </Link>

      <h1 className={LEARN_STYLES.h1}>How the Greek Modes Relate to Each Other</h1>

      <p>
        If you&apos;ve been around musicians long enough, you may have heard about the Greek modes
        (aka Church modes) with the following names:
      </p>

      <ol className="list-decimal pl-6">
        <li><i>Ionian</i></li>
        <li><i>Dorian</i></li>
        <li><i>Phrygian</i></li>
        <li><i>Lydian</i></li>
        <li><i>Mixolydian</i></li>
        <li><i>Aeolian</i></li>
        <li><i>Locrian</i></li>
      </ol>

      <p>
        What is so special about them and what do they have in common? These scales are some of
        the most frequently used in Western music, and each one of them can be derived from others
        by starting at a new tonic. They are all just one scale played from seven different
        starting points. Every one of them is built from the exact same pattern of seven notes, the
        only thing that changes is the note you treat as home (aka the <em>tonic</em>).
      </p>

      <h2 className={LEARN_STYLES.h2}>One pattern, seven tonics</h2>

      <p>
        Play only the white keys on a piano, starting and ending on C, and you get C <i>Ionian</i>. Start
        that same run of white keys on D instead and stop an octave later, and you get D <i>Dorian</i> -
        Every Greek mode works this way: rotate which note you start on within one fixed collection, and
        you move between all 7 modes without ever picking up or dropping a single note. C <i>Ionian</i>&apos;s six other rotations are D <i>Dorian</i>, E <i>Phrygian</i>, F <i>Lydian</i>, G <i>Mixolydian</i>, A <i>Aeolian</i>, and B <i>Locrian</i> - all seven sharing one key signature, distinguished only by which
        note is the tonic. &ldquo;A minor&rdquo; being called the relative minor of C major is just
        this same idea under its more familiar name: <i>Aeolian</i> is the Greek name for the <i>natural
        minor scale</i>, and A <i>Aeolian</i> is C <i>Ionian</i>&apos;s sixth rotation.
      </p>

      <ComparisonGrid2>
        <ScaleFigure
          tonic="C"
          scaleType={ScaleModeType.Ionian}
          caption="C Ionian: the seven white keys, starting and ending on C."
        />
        <ScaleFigure
          tonic="D"
          scaleType={ScaleModeType.Dorian}
          caption="D Dorian: the same seven white keys, starting and ending on D instead."
        />
      </ComparisonGrid2>

      <p>
        This is what makes the modes &ldquo;relative&rdquo; to each other rather than
        &ldquo;parallel&rdquo;.
      </p>

      <p>
        Because relative modes share every note, they also share every chord you can build from
        those notes. The triads available in C <i>Ionian</i> - C, D minor, E minor, F, G, A minor, and B
        diminished - are the same seven triads available in A <i>Aeolian</i>, D <i>Dorian</i>, or any of the other
        five. Nothing about the chord palette changes when you move between relative modes; only
        which chord acts as home does. C major resolves strongly to C because C is the tonic in that
        context - the same C <i>major chord</i>, played in A <i>Aeolian</i>&apos;s context, is just the bright <i>major chord</i> sitting on the third degree, with no special claim on being &ldquo;home.&rdquo;
      </p>

      <SeeAlso
        items={[
          "relative-vs-parallel-modes",
          "modal-families",
          "scale-degrees",
        ]}
      />
    </>
  );
}
