import type { Metadata } from "next";
import Link from "next/link";

import { LEARN_STYLES } from "@/lib/design";
import { learnViewMetadata, metadataForSlugPage } from "@/lib/metadata";
import { StaticChordFigure } from "@/components/Learn/StaticChordFigure";
import { SpecialType } from "@/types/enums/SpecialType";

export const metadata: Metadata = metadataForSlugPage(
  learnViewMetadata,
  "/learn/approach/accidentals",
  "Accidentals",
  "Why the app plays down sharps and flats on the keyboard, resolves a real spelling once you're in a key, and never once shows a double sharp or double flat.",
);

export default function AccidentalsPage() {
  return (
    <>
      <Link href="/learn/approach" className={LEARN_STYLES.link}>
        ← Approach 
      </Link>

      <h1 className={LEARN_STYLES.h1}>Accidentals ♯/♭</h1>

      <p>
        What's the correct label for that black key after "C"? Is it a C♯? a D♭? Or even a C♯/D♭?
        The musical theory answer is &ldquo;well it depends&rdquo;. Which key are you in? What scale
        degree is it? What chord is it part of? 
      </p>
      <p>
        If we were to follow that music theory rabbit hole, we would end up either having to switch labels on the black keys depending on context - or have an extra long label just to hedge our bets.
        This would be good for settling pedantic arguments with hardcore music theory nerds, but this is exactly the place we want to be spending <i>less </i> time.         
      </p>
      <p>
        What we want to focus on instead is &ldquo;how does it sound&rdquo;,
        what is the &ldquo;quality&rdquo; of this chord, etc. Thus the app&apos;s approach is to{" "}
        <i>downplay</i> the accidentals. The first black key of the linear keyboard is just in
        between a C and a D, and you can put whatever label on it you want mentally. 
      </p>
      <StaticChordFigure
        rootNote="C"
        chordType={SpecialType.None}
        inversionIndex={0}
        caption="Accidentals (♯/♭) are present, but downplayed"
        isCompact={true}
        showLabels={true}
      />

      <h2 className={LEARN_STYLES.h2}>Never a double accidental (𝄪/♭♭)</h2>

      <p>
        Push the proper spelling rules far enough and you end up with a double accidental. A fully
        diminished 7th stacks minor 3rds all the way up, so strict spelling of C dim7 is C, E♭, G♭,
        B𝄫 - not the A you&apos;d actually play. That&apos;s standard notation, and here the app
        breaks with it: its accidental type only has natural, sharp, and flat, so it falls back to
        the plain single-accidental name (A) instead. You will never see a double sharp or double
        flat in this app, however standard one might be on paper.
      </p>

      <p>
        See{" "}
        <Link href="/learn/approach/whats-wrong-with-music-theory" className={LEARN_STYLES.link}>
          What&apos;s Wrong with Music Theory
        </Link>{" "}
        for why that trade is worth making, and{" "}
        <Link href="/learn/approach/chromatic-circle" className={LEARN_STYLES.link}>
          The Chromatic Circle
        </Link>{" "}
        for the bigger idea it&apos;s part of - drawing harmony by distance rather than by letter.
      </p>
    </>
  );
}
