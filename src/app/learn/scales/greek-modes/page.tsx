import type { Metadata } from "next";
import Link from "next/link";

import { SingleScaleFigure } from "@/components/Learn/SingleScaleFigure";
import { LEARN_STYLES } from "@/lib/design";
import { learnViewMetadata, metadataForSlugPage } from "@/lib/metadata";
import { ScaleModeType } from "@/types/enums/ScaleModeType";

export const metadata: Metadata = metadataForSlugPage(
  learnViewMetadata,
  "/learn/scales/greek-modes",
  "How the Greek Modes Relate to Each Other",
  "Relative modes, parallel modes, and how every mode is really the same scale started from a different degree.",
);

export default function GreekModesPage() {
  return (
    <>
      <Link href="/learn/scales" className={LEARN_STYLES.link}>
        ← Scales
      </Link>

      <h1 className="text-3xl font-semibold">How the Greek Modes Relate to Each Other</h1>

      <p>
        Ionian, Dorian, Phrygian, Lydian, Mixolydian, Aeolian, Locrian - seven names, but really one
        scale played from seven different starting points. Every one of them is built from the exact
        same pattern of seven notes; the only thing that ever changes is which note you treat as
        home. Two very different relationships fall out of that single fact, depending on which
        piece you hold fixed: the notes, or the tonic.
      </p>

      <h2 className="text-xl font-semibold">Relative modes: same notes, different tonic</h2>

      <p>
        Play only the white keys on a piano, starting and ending on C, and you get C Ionian. Start
        that same run of white keys on D instead and stop an octave later, and you get D Dorian -
        not a different set of notes, the identical seven, just entered at a different point. Every
        Greek mode works this way: rotate which note you start on within one fixed collection, and
        you move between all seven modes without ever picking up or dropping a single note.
      </p>

      <div className={LEARN_STYLES.comparisonGrid}>
        <SingleScaleFigure
          tonic="C"
          scaleMode={ScaleModeType.Ionian}
          showStepAnnotations={false}
          caption="C Ionian: the seven white keys, starting and ending on C."
        />
        <SingleScaleFigure
          tonic="D"
          scaleMode={ScaleModeType.Dorian}
          showStepAnnotations={false}
          caption="D Dorian: the same seven white keys, starting and ending on D instead."
        />
      </div>

      <p>
        This is the traditional meaning of &ldquo;relative&rdquo; - the same relationship as
        relative major and minor, just not limited to those two. C Ionian&apos;s relative modes are
        D Dorian, E Phrygian, F Lydian, G Mixolydian, A Aeolian, and B Locrian - all seven sharing
        one key signature, distinguished only by which of those seven notes is the tonic. &ldquo;A
        minor&rdquo; being called the relative minor of C major is just this same idea under its
        more familiar name: Aeolian is the Greek name for the natural minor scale, and A Aeolian is
        C Ionian&apos;s sixth rotation.
      </p>

      <p>
        Because relative modes share every note, they also share every chord you can build from
        those notes. The triads available in C Ionian - C, D minor, E minor, F, G, A minor, and B
        diminished - are the same seven triads available in A Aeolian, D Dorian, or any of the other
        five. Nothing about the chord palette changes when you move between relative modes; only
        which chord acts as home does. C major resolves strongly to C because C is the tonic in that
        context - the same C major chord, played in A Aeolian&apos;s context, is just the bright
        major chord sitting on the third degree, with no special claim on being &ldquo;home.&rdquo;
      </p>

      <h2 className="text-xl font-semibold">Parallel modes: same tonic, different notes</h2>

      <p>
        Hold the tonic fixed instead and let the notes move, and you get the other relationship:
        parallel modes. C Ionian and C Dorian start on the same note, but they are not the same
        seven notes - C Dorian&apos;s third and seventh are a semitone lower. This is the
        relationship every comparison in{" "}
        <Link href="/learn/scales/comparisons" className={LEARN_STYLES.link}>
          Comparisons
        </Link>{" "}
        explores, one degree at a time: two modes sharing a tonic, differing by exactly one note, so
        the change that note makes is easy to isolate and hear.
      </p>

      <p>
        Relative and parallel are opposite moves on the same seven-note pattern: relative modes keep
        the notes and move the tonic; parallel modes keep the tonic and move the notes. Both are
        ways of asking the same underlying question - what happens if you rotate this pattern, or
        what happens if you alter it - just from different starting assumptions about what has to
        stay the same.
      </p>

      <h2 className="text-xl font-semibold">Deriving one mode from another by rotation</h2>

      <p>
        The traditional numbering of the modes is exactly this rotation, made explicit: Ionian is
        the 1st mode, Dorian the 2nd, Phrygian the 3rd, Lydian the 4th, Mixolydian the 5th, Aeolian
        the 6th, and Locrian the 7th - counting from wherever each one starts within a shared major
        scale. To turn any mode into the one numbered N places later, rotate: find that mode&apos;s
        Nth degree, and start the same seven notes from there instead. Starting from C Ionian&apos;s
        6th degree gives A Aeolian; starting from D Dorian&apos;s 4th degree gives G Mixolydian.
        Different doorways into the same seven-note room.
      </p>
    </>
  );
}
