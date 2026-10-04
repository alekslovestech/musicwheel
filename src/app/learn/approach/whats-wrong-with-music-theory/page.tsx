import type { Metadata } from "next";
import Link from "next/link";

import { ComparisonGrid2 } from "@/components/Learn/ComparisonGrid";
import { StaticStaffFigure } from "@/components/Learn/StaticStaffFigure";
import { LEARN_STYLES } from "@/lib/design";
import { learnViewMetadata, metadataForSlugPage } from "@/lib/metadata";
import { AccidentalType } from "@/types/enums/AccidentalType";
import { ixActual } from "@/types/IndexTypes";
import { createNoteWithOctave } from "@/types/interfaces/NoteWithOctave";

const C_MAJOR_SCALE = [
  ...["C", "D", "E", "F", "G", "A", "B"].map((name) => [
    createNoteWithOctave(name, AccidentalType.None),
  ]),
  [createNoteWithOctave("C", AccidentalType.None, 1)],
];

const AUGMENTED_4TH = [
  [createNoteWithOctave("C", AccidentalType.None), createNoteWithOctave("F", AccidentalType.Sharp)],
];

const DIMINISHED_5TH = [
  [createNoteWithOctave("C", AccidentalType.None), createNoteWithOctave("G", AccidentalType.Flat)],
];

const TRITONE_KEYS = [ixActual(0), ixActual(6)];

const C_MAJOR_TRIAD = [
  [
    createNoteWithOctave("C", AccidentalType.None),
    createNoteWithOctave("E", AccidentalType.Natural),
    createNoteWithOctave("G", AccidentalType.None),
  ],
];

const C_MAJOR_KEYS = [ixActual(0), ixActual(4), ixActual(7)];

const C_MAJOR_TRIAD_ALL_NATURAL = [
  [
    createNoteWithOctave("C", AccidentalType.Natural),
    createNoteWithOctave("E", AccidentalType.Natural),
    createNoteWithOctave("G", AccidentalType.Natural),
  ],
];

export const metadata: Metadata = metadataForSlugPage(
  learnViewMetadata,
  "/learn/approach/whats-wrong-with-music-theory",
  "What's Wrong with Music Theory",
  "A tour of the parts of standard music theory that are historical accidents, notational bookkeeping, or turf wars - not descriptions of how harmony actually sounds.",
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
        The seven-letter alphabet, the black-and-white keyboard layout, sharps and flats bolted on
        as modifiers - none of this was designed for the harmony we use. It&apos;s a holdover from
        a much older system, built for monophonic chant centuries before chromatic harmony
        existed. A chromatic scale has twelve evenly spaced notes, and nothing about how it sounds
        explains why seven get plain letters and the other five are treated as exceptions. Which
        keys are white and which are black is a bit arbitrary.
      </p>

      <p>
        None of this is going anywhere. The convention is strong and well established, on the
        staff and on the linear keyboard alike, so we use the notation built around the white keys
        too. It&apos;s just worth remembering it&apos;s a convention, not a fact about sound.
      </p>

      <div className="mx-auto w-full max-w-xl">
        <StaticStaffFigure
          chords={C_MAJOR_SCALE}
          highlightedNoteIndices={[]}
          caption="The 7 letters, C D E F G A B C - and the 5 keys left unlabeled"
        />
      </div>

      <h2 className={LEARN_STYLES.h2}>Enharmonic notation</h2>

      <p>
        G♯ and A♭ are the same pitch. Which name is &ldquo;correct&rdquo; in a given passage
        is a rule about how a scale&apos;s letters are supposed to avoid repeating, not a fact you
        can hear. Push that rule far enough and it produces double sharps and double flats - a
        symbol whose entire job is to keep the spelling grammatically tidy on a page, for a note
        that sounds exactly like some much simpler-looking key a semitone away.
      </p>

      <p>
        The same goes for intervals. C up to F♯ is an augmented 4th; C up to G♭ is a diminished
        5th. On paper they sit on different lines and carry different names. On the keyboard
        they&apos;re the same two keys, 6 semitones apart.
      </p>

      <ComparisonGrid2>
        <StaticStaffFigure
          chords={AUGMENTED_4TH}
          highlightedNoteIndices={TRITONE_KEYS}
          caption="C–F♯ (augmented 4th)"
        />
        <StaticStaffFigure
          chords={DIMINISHED_5TH}
          highlightedNoteIndices={TRITONE_KEYS}
          caption="C–G♭ (diminished 5th)"
        />
      </ComparisonGrid2>

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
        The signature also gets in the way of plain chords. Write a C major chord in C minor and the
        signature has already flattened E, so the chord&apos;s E needs a natural sign just to be
        itself. Push the key further - C♯ major sharps every letter - and the same chord needs a
        natural on all three notes, just to spell a C major triad.
      </p>

      <ComparisonGrid2>
        <StaticStaffFigure
          chords={C_MAJOR_TRIAD}
          keySignature="Cm"
          highlightedNoteIndices={C_MAJOR_KEYS}
          caption="C major chord in the key of C minor"
        />
        <StaticStaffFigure
          chords={C_MAJOR_TRIAD_ALL_NATURAL}
          keySignature="C#"
          highlightedNoteIndices={C_MAJOR_KEYS}
          caption="C major chord in the key of C♯ major"
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
        <StaticStaffFigure
          chords={[]}
          keySignature="F#"
          caption={"6 sharps: F♯, C♯, G♯, D♯, A♯, E♯\nFast Cars Go Dangerously Around Every Bend"}
        />
        <StaticStaffFigure
          chords={[]}
          keySignature="Gb"
          caption={"6 flats: B♭, E♭, A♭, D♭, G♭, C♭\nBefore Eating A Donut, Get Coffee First"}
        />
      </div>

      <h2 className={LEARN_STYLES.h2}>Turf wars around spelling</h2>

      <p>
        A remarkable amount of theory instruction is spent litigating whether something
        &ldquo;should&rdquo; be spelled one way or another - is this a diminished 4th or a major
        3rd, a G♯ or an A♭ - as if getting the label wrong were a musical error rather than
        a clerical one. None of it changes what&apos;s sounding. It&apos;s an argument about
        convention wearing the costume of an argument about music.
      </p>

      <p>
        See{" "}
        <Link href="/learn/approach/why-this-app" className={LEARN_STYLES.link}>
          Why This App
        </Link>{" "}
        for what we keep instead, and why the wheel sidesteps all of this by drawing harmony as
        distance rather than as spelling.
      </p>
    </>
  );
}
