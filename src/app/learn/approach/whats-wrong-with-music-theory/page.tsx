import type { Metadata } from "next";
import Link from "next/link";

import { LEARN_STYLES } from "@/lib/design";
import { learnViewMetadata, metadataForSlugPage } from "@/lib/metadata";

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

      <h1 className="text-3xl font-semibold">What&apos;s Wrong with Music Theory</h1>

      <p>
        Standard music theory teaches two different things at once, with the same tone of voice:
        facts about how harmony sounds, and facts about how one particular notation system happened
        to evolve. The first kind is worth learning. The second kind gets taught just as seriously,
        despite not describing sound at all - and it&apos;s most of what makes theory feel harder
        than it needs to be. Here&apos;s a short tour of it.
      </p>

      <h2 className="text-xl font-semibold">Historical accidents</h2>

      <p>
        The seven-letter alphabet, the uneven black-and-white keyboard layout, sharps and flats
        bolted on as modifiers instead of being first-class notes - none of this was designed for
        the harmony we actually use. It&apos;s what survived from a much older system, built for
        monophonic chant centuries before chromatic harmony existed, that later theory backed into
        rather than starting over. A chromatic scale has twelve evenly spaced notes. Nothing about
        how it sounds explains why seven of them get plain letters and the other five get treated as
        exceptions.
      </p>

      <h2 className="text-xl font-semibold">Enharmonic notation</h2>

      <p>
        G-sharp and A-flat are the same pitch. Which name is &ldquo;correct&rdquo; in a given passage
        is a rule about how a scale&apos;s letters are supposed to avoid repeating, not a fact you
        can hear. Push that rule far enough and it produces double sharps and double flats - a
        symbol whose entire job is to keep the spelling grammatically tidy on a page, for a note
        that sounds exactly like some much simpler-looking key a semitone away.
      </p>

      <h2 className="text-xl font-semibold">Musical keys</h2>

      <p>
        A key signature is a fact about how a piece is written down - how many sharps or flats sit
        at the start of the staff - not a fact about how its harmony works. Transposing a chord
        progression into a different key doesn&apos;t change a single relationship inside it; it&apos;s
        the same shape, moved. But because each key gets its own signature and its own set of
        &ldquo;correct&rdquo; spellings, two identical progressions in different keys can look like
        they need entirely separate vocabulary to describe.
      </p>

      <h2 className="text-xl font-semibold">Pointless memorization</h2>

      <p>
        &ldquo;Every Good Boy Does Fine.&rdquo; &ldquo;Whole-whole-half-whole-whole-whole-half.&rdquo;
        The circle of fifths, recited in order until it sticks. These are all workarounds for not
        being able to see the pattern directly - strings of letters standing in for a shape. Once
        you can see the shape, the string is just extra weight to carry around.
      </p>

      <h2 className="text-xl font-semibold">Turf wars around spelling</h2>

      <p>
        A remarkable amount of theory instruction is spent litigating whether something
        &ldquo;should&rdquo; be spelled one way or another - is this a diminished 4th or a major
        3rd, a G-sharp or an A-flat - as if getting the label wrong were a musical error rather than
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
