import type { Metadata } from "next";
import Link from "next/link";

import { ComparisonGrid2 } from "@/components/Learn/ComparisonGrid";
import { StaticChordFigure } from "@/components/Learn/StaticChordFigure";
import { LEARN_STYLES } from "@/lib/design";
import { learnViewMetadata, metadataForSlugPage } from "@/lib/metadata";
import { ChordType } from "@/types/enums/ChordType";

export const metadata: Metadata = metadataForSlugPage(
  learnViewMetadata,
  "/learn/why-this-app",
  "Why This App",
  "The problems this app is trying to solve: which parts of music theory actually matter for hearing harmony, and which parts are historical noise.",
);

export default function WhyThisAppPage() {
  return (
    <>
      <Link href="/learn" className={LEARN_STYLES.link}>
        ← Learn
      </Link>

      <h1 className="text-3xl font-semibold">Why This App</h1>

      <p>
        Music theory is worth learning. It explains why some combinations of notes feel settled and
        others feel restless, and it gives you a vocabulary for talking about that. But a lot of
        what gets taught alongside it isn&apos;t really about how music works - it&apos;s about how
        music got written down, or how it happens to sit on a particular instrument. Those are
        different things, and conflating them is where a lot of the confusion comes from. A student
        can spend an hour arguing about whether a note is A-sharp or B-flat and come away having
        learned nothing about how the chord actually sounds.
      </p>

      <p>
        This app is opinionated about which is which. It keeps the parts of theory that describe
        harmony itself, and it deliberately drops the parts that exist for notational or historical
        reasons - the ones that tend to confuse a learner or start a pointless argument about
        naming, without changing anything about what you&apos;d hear.
      </p>

      <h2 className="text-xl font-semibold">What actually matters</h2>

      <p>
        <strong>The harmony itself</strong> - which notes are sounding together, and what that
        combination feels like. Everything else on this page is in service of this one thing.
      </p>

      <p>
        <strong>Intervals and chord quality</strong> - a small, useful vocabulary for what
        you&apos;re hearing. &ldquo;Minor third,&rdquo; &ldquo;major triad,&rdquo; &ldquo;dominant
        seventh&rdquo; are worth knowing because they name something about the sound, not about the
        page.
      </p>

      <p>
        <strong>Scale names</strong> - Dorian, harmonic minor, and the rest are shorthand for
        specific, recognizable patterns of steps. Worth learning the pattern; see{" "}
        <Link href="/learn/scales" className={LEARN_STYLES.link}>
          Scales
        </Link>{" "}
        for how they relate to each other.
      </p>

      <p>
        <strong>Chord progressions and harmony over time</strong> - how one chord moves to the next,
        and how that motion repeats and develops, regardless of which key it happens to be
        transposed into. A ii-V-I is the same shape whether it starts on C or on F-sharp.
      </p>

      <h2 className="text-xl font-semibold">What we leave out</h2>

      <p>
        <strong>Chord spelling.</strong> Whether a note is written as G-sharp or A-flat matters to
        someone reading sheet music in a particular key, and not at all to your ear. You will never
        see a double sharp or a double flat in this app, even on the rare chord where that&apos;s
        the &ldquo;correct&rdquo; spelling - the wheel just shows the note.
      </p>

      <p>
        <strong>Whole-whole-half-whole-whole-whole-half.</strong> The step recipe is a real pattern,
        but memorizing a string of letters is a workaround for not being able to see the pattern
        directly. Once you can see it, you don&apos;t need to recite it.
      </p>

      <p>
        <strong>What key you&apos;re in.</strong> Key signatures tell you how a piece is notated,
        not how it sounds. The wheel doesn&apos;t care what key a chord or scale is in - transposing
        just rotates the same shape to a different starting point.
      </p>

      <p>
        <strong>Where it sits on an instrument.</strong> We show a piano for reference, because
        it&apos;s a familiar layout and a convenient way to play a sound back. But the specific
        arrangement of black and white keys is an accident of one particular instrument&apos;s
        design - it doesn&apos;t explain the harmony, and it can make an otherwise simple
        relationship look irregular for no musical reason. Understanding a chord doesn&apos;t
        require a piano, or a guitar, or any instrument at all.
      </p>

      <h2 className="text-xl font-semibold">Why the wheel</h2>

      <p>
        The chromatic circle is a cleaner way to look at harmony than a keyboard or a staff, because
        it&apos;s built around one idea: distance. Notes are arranged by how far apart they are, not
        by which letter they&apos;re named after or where they happen to fall on a particular
        instrument. Transposing a chord to a new key doesn&apos;t reshape it or relabel half its
        notes - it just spins the same shape to a new position.
      </p>

      <ComparisonGrid2>
        <StaticChordFigure
          rootNote="C"
          chordType={ChordType.Minor7}
          inversionIndex={0}
          caption="C minor 7th: one shape, one set of colors."
        />
        <StaticChordFigure
          rootNote="F#"
          chordType={ChordType.Minor7}
          inversionIndex={0}
          caption="F-sharp minor 7th: the exact same shape, just rotated - nothing about it got harder to read."
        />
      </ComparisonGrid2>

      <p>
        That&apos;s also why the wheel is colored the way it is: things that sound similar, look
        similar. Every wedge and every chord blend is derived from interval distance rather than
        note names, so a relationship you can hear shows up as a relationship you can see - see{" "}
        <Link href="/learn/color-coding" className={LEARN_STYLES.link}>
          Color Coding
        </Link>{" "}
        for how that works.
      </p>
    </>
  );
}
