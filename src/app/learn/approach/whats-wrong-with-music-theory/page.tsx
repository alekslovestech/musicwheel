import type { Metadata } from "next";
import Link from "next/link";

import { ComparisonGrid2 } from "@/components/Learn/ComparisonGrid";
import { ChordStaffFigure } from "@/components/Learn/ChordStaffFigure";
import { LEARN_STYLES } from "@/lib/design";
import {
  AUGMENTED_4TH,
  C_MAJOR_SCALE,
  C_MAJOR_TRIAD_IN_C_MINOR,
  C_MAJOR_TRIAD_IN_E_MAJOR,
  DIMINISHED_5TH,
} from "@/lib/learn/staffFigures";
import { learnViewMetadata, metadataForSlugPage } from "@/lib/metadata";

export const metadata: Metadata = metadataForSlugPage(
  learnViewMetadata,
  "/learn/approach/whats-wrong-with-music-theory",
  "What's Wrong with Music Theory",
  "A tour of the parts of standard music theory that are historical accidents, notational bookkeeping, or turf wars - not descriptions of how harmony actually sounds.",
  {
    slug: "whats-wrong-with-music-theory",
    alt: "A C major chord on a staff in the key of E major, with natural signs cancelling the key signature's sharps",
  },
);

export default function WhatsWrongWithMusicTheoryPage() {
  return (
    <>
      <Link href="/learn/approach" className={LEARN_STYLES.link}>
        ← Approach
      </Link>

      <h1 className={LEARN_STYLES.h1}>What&apos;s Wrong with Music Theory</h1>

      <p>
        Standard music theory teaches two different things at once, with the same tone of voice:
        facts about how harmony sounds, and facts about how one particular notation system happened
        to evolve. The first kind is worth learning. The second kind gets taught just as seriously,
        despite not describing sound at all - and it&apos;s most of what makes theory feel harder
        than it needs to be. Here&apos;s a short tour of it.
      </p>

      <h2 className={LEARN_STYLES.h2}>Historical accidents</h2>

      <p>
        This is what we have: 7 letters on the white keys, with sharps and flats bolted on for the
        black ones. Notice how arbitrary it is - a chromatic scale has 12 evenly spaced notes, and
        which keys end up white and which black is a historical accident.
      </p>

      <div className="mx-auto w-full max-w-xl">
        <ChordStaffFigure
          {...C_MAJOR_SCALE}
          caption="The 7 letters, C D E F G A B - and the 5 black keys left to be notated with ♯ or ♭ "
        />
      </div>

      <p>
        None of this is going anywhere. The convention is strong and well established, on the
        staff and on the linear keyboard alike, so we use the notation built around the white keys
        too. It&apos;s just worth remembering it&apos;s a convention, not a fact about sound.
      </p>

      <h2 className={LEARN_STYLES.h2}>Enharmonic notation</h2>

      <p>
        F♯ and G♭ are the same pitch. Which name is &ldquo;correct&rdquo; in a given passage
        is a rule about how a scale&apos;s letters are supposed to avoid repeating, not a fact you
        can hear. Push that rule far enough and it produces double sharps and double flats - a
        symbol whose entire job is to keep the spelling grammatically tidy on a page, for a note
        that sounds exactly like some much simpler-looking key a semitone away.
      </p>

      <p>
        The same goes for intervals. C up to F♯ is an <i>augmented 4th</i>; C up to G♭ is a <i>diminished
        5th</i>. On paper they sit on different lines and carry different names. On the keyboard
        they&apos;re the same two keys, 6 semitones apart. 
      </p>

      <ComparisonGrid2>
        <ChordStaffFigure
          {...AUGMENTED_4TH}
          caption="C–F♯ (augmented 4th)"
        />
        <ChordStaffFigure
          {...DIMINISHED_5TH}
          caption="C–G♭ (diminished 5th)"
        />
      </ComparisonGrid2>

      <p>
        A remarkable amount of theory instruction is spent litigating which spelling
        &ldquo;should&rdquo; be used, as if the wrong label were a musical error rather than a
        clerical one. It&apos;s an argument about convention wearing the costume of an argument
        about music.
      </p>

      <h2 className={LEARN_STYLES.h2}>Musical keys</h2>

      <p>
        A key signature is a fact about how a piece is written down - how many sharps or flats sit
        at the start of the staff - not a fact about how its harmony works. Transposing a chord
        progression into a different key doesn&apos;t change a single relationship inside it; it&apos;s
        the same shape, moved. But because each key gets its own signature and its own set of
        &ldquo;correct&rdquo; spellings, two identical progressions in different keys can look like
        they need entirely separate vocabulary to describe.
      </p>

      <p>
        The signature also gets in the way of plain chords. Write a C <i>major chord</i> in C minor and the
        signature has already flattened E, so the chord&apos;s E needs a natural sign just to be
        itself. In E major, with 4 sharps, the C and G are sharpened, so the same chord needs
        naturals on both of them.
      </p>

      <ComparisonGrid2>
        <ChordStaffFigure
          {...C_MAJOR_TRIAD_IN_C_MINOR}
          keySignature="Cm"
          caption="C major chord in the key of C minor"
        />
        <ChordStaffFigure
          {...C_MAJOR_TRIAD_IN_E_MAJOR}
          keySignature="E"
          caption="C major chord in the key of E major"
        />
      </ComparisonGrid2>

      <h2 className={LEARN_STYLES.h2}>Pointless memorization</h2>

      <p>
        &ldquo;Every Good Boy Does Fine.&rdquo; &ldquo;Whole-whole-half-whole-whole-whole-half.&rdquo;
        The circle of fifths, recited in order until it sticks. These are all workarounds for not
        being able to see the pattern directly - strings of letters standing in for a shape. Once
        you can see the shape, the string is just extra weight to carry around.
      </p>

      <p>
        Key signatures get their own mnemonic. To read the one below, you&apos;re expected to
        recite the order of sharps - &ldquo;Fast Cars Go Dangerously Around Every Bend&rdquo; -
        and count off 6 of them: F♯ major.
      </p>

      <div className="mx-auto grid w-full max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2">
        <ChordStaffFigure
          chords={[]}
          keySignature="F#"
          caption={"6 sharps: F♯, C♯, G♯, D♯, A♯, E♯\nFast Cars Go Dangerously Around Every Bend"}
        />
        <ChordStaffFigure
          chords={[]}
          keySignature="Gb"
          caption={"6 flats: B♭, E♭, A♭, D♭, G♭, C♭\nBefore Eating A Donut, Get Coffee First"}
        />
      </div>

      <p>
        See{" "}
        <Link href="/learn/approach/whats-useful-about-music-theory" className={LEARN_STYLES.link}>
          What&apos;s Useful About Music Theory
        </Link>{" "}
        for what&apos;s worth keeping instead.
      </p>
    </>
  );
}
