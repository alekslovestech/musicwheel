import type { Metadata } from "next";
import Link from "next/link";

import { ScaleFigure } from "@/components/Learn/ScaleFigure";
import { LEARN_STYLES } from "@/lib/design";
import { learnViewMetadata, metadataForSlugPage } from "@/lib/metadata";
import { ScaleModeType } from "@/types/enums/ScaleModeType";

export const metadata: Metadata = metadataForSlugPage(
  learnViewMetadata,
  "/learn/scales/modal-rotations",
  "Modal Families Beyond the Major Scale",
  "The major scale isn't the only collection with famous rotations - Harmonic Minor, Harmonic Major, Double Harmonic Major, and Melodic Minor each have their own.",
);

export default function ModalRotationsPage() {
  return (
    <>
      <Link href="/learn/scales" className={LEARN_STYLES.link}>
        ← Scales
      </Link>

      <h1 className="text-3xl font-semibold">Modal Families Beyond the Major Scale</h1>

      <p>
        <Link href="/learn/scales/greek-modes" className={LEARN_STYLES.link}>
          Greek Modes
        </Link>{" "}
        showed that Dorian, Phrygian, and the rest aren&apos;t separate scales - they&apos;re the
        major scale&apos;s seven notes, started from different points. That&apos;s not a special
        property of the major scale. Any seven-note collection has seven rotations, each landing on
        a different note as tonic - the major scale&apos;s just happen to all have familiar Greek
        names. A few other collections have rotations well-known enough to have earned their own
        names too, and they&apos;re a different relationship from{" "}
        <Link href="/learn/scales/harmonic" className={LEARN_STYLES.link}>
          why a scale gets built
        </Link>{" "}
        in the first place: two scales can be deliberately constructed for different reasons and
        still turn out to be the same seven notes, rooted differently.
      </p>

      <ul className="list-disc pl-6">
        <li>
          <Link href="#harmonic-minor-family" className={LEARN_STYLES.link}>
            Harmonic Minor family: Harmonic Minor ↔ Phrygian Dominant
          </Link>
        </li>
        <li>
          <Link href="#harmonic-major-family" className={LEARN_STYLES.link}>
            Harmonic Major family: Harmonic Major ↔ Mixolydian ♭2
          </Link>
        </li>
        <li>
          <Link href="#double-harmonic-family" className={LEARN_STYLES.link}>
            Double Harmonic family: Double Harmonic Major ↔ Hungarian Minor
          </Link>
        </li>
        <li>
          <Link href="/learn/scales/melodic-minor-modes" className={LEARN_STYLES.link}>
            Melodic Minor family: seven jazz modes
          </Link>
        </li>
      </ul>

      <h2 id="harmonic-minor-family" className="text-xl font-semibold">
        Harmonic Minor Family: Harmonic Minor ↔ Phrygian Dominant
      </h2>

      <p>
        Rotate Harmonic Minor to start on its own 5th degree and you get Phrygian Dominant - the
        same seven notes, a perfect 5th away. It goes by several other names depending on the
        tradition it&apos;s cited from: Spanish Phrygian, Freygish in Klezmer music, Ahava Rabbah in
        Jewish liturgical music. (&ldquo;Byzantine scale&rdquo; is sometimes used for this one too,
        though that name is used inconsistently - some sources use it for Double Harmonic Major
        instead.) Whatever it&apos;s called, it&apos;s the same augmented-second gap Harmonic Minor
        has, just heard starting from a different note in the collection - which is why it carries
        the same exotic character even though nothing was rebuilt to get there.
      </p>

      <ScaleFigure
        tonic="G"
        scaleMode={ScaleModeType.PhrygianDominant}
        showStepAnnotations
        caption="G Phrygian Dominant: the same seven notes as C Harmonic Minor, started on the 5th
          degree instead of the 1st."
      />

      <h2 id="harmonic-major-family" className="text-xl font-semibold">
        Harmonic Major Family: Harmonic Major ↔ Mixolydian ♭2
      </h2>

      <p>
        Harmonic Major&apos;s 5th-degree rotation is Mixolydian ♭2 - a Mixolydian scale with its
        second degree flattened, carrying the same lowered-sixth augmented second as its parent,
        just relocated by starting the collection from a different note.
      </p>

      <ScaleFigure
        tonic="G"
        scaleMode={ScaleModeType.MixolydianB2}
        showStepAnnotations
        caption="G Mixolydian ♭2: the same seven notes as C Harmonic Major, started on the 5th
          degree instead of the 1st."
      />

      <h2 id="double-harmonic-family" className="text-xl font-semibold">
        Double Harmonic Family: Double Harmonic Major ↔ Hungarian Minor
      </h2>

      <p>
        Double Harmonic Major&apos;s 4th-degree rotation turns out to be Hungarian Minor - not an
        obvious pairing, since{" "}
        <Link href="/learn/scales/harmonic" className={LEARN_STYLES.link}>
          the two are built by different edits
        </Link>{" "}
        of different parent scales. But C Double Harmonic Major (C, D♭, E, F, G, A♭, B) and F
        Hungarian Minor turn out to share the exact same seven notes - the same collection, reached
        by two unrelated-looking routes and rooted a perfect 4th apart.
      </p>

      <ScaleFigure
        tonic="F"
        scaleMode={ScaleModeType.HungarianMinor}
        showStepAnnotations
        caption="F Hungarian Minor: the same seven notes as C Double Harmonic Major, started on the
          4th degree instead of the 1st."
      />

      <h2 id="melodic-minor-family" className="text-xl font-semibold">
        Melodic Minor Family: Seven Jazz Modes
      </h2>

      <p>
        Melodic Minor has the most famous rotation family outside the major scale, mostly through
        jazz, where each of its seven modes has its own name and its own standard use against a
        specific chord type. Most of the seven aren&apos;t in the app yet - see{" "}
        <Link href="/learn/scales/melodic-minor-modes" className={LEARN_STYLES.link}>
          Modes of Melodic Minor
        </Link>{" "}
        for the three most commonly used modes and their formulas.
      </p>
    </>
  );
}
