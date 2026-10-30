import type { Metadata } from "next";
import Link from "next/link";

import { LEARN_STYLES } from "@/lib/design";
import { learnViewMetadata, metadataForSlugPage } from "@/lib/metadata";
import { ChordWheel } from "@/components/Learn/figures/ChordWheel";
import { SeeAlso } from "@/components/Learn/prose/SeeAlso";
import { SpelledStaff } from "@/components/Learn/figures/SpelledStaff";
import { C_DIM7_SPELLED } from "@/lib/learn/spelledFigures";
import { ChordType } from "@/types/enums/ChordType";
import { SpecialType } from "@/types/enums/SpecialType";

export const metadata: Metadata = metadataForSlugPage(
  learnViewMetadata,
  "/learn/approach/accidentals",
  "Accidentals",
  "Why the app plays down sharps and flats on the keyboard, and never once shows a double sharp or double flat.",
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
      <ChordWheel
        rootNote="C"
        chordType={SpecialType.None}
        inversionIndex={0}
        caption="Accidentals (♯/♭) are present, but downplayed"
        isCompact={true}
        showLabels={true}
      />

      <h2 className={LEARN_STYLES.h2}>What about double accidentals? (𝄪/𝄫)</h2>

      <p>
        Strict spelling can sometimes force a double accidental. A fully <i>diminished 7th</i> stacks{" "}
        <i>minor 3rds</i>, so C dim7 is spelled C, E♭, G♭, B𝄫.
      </p>
      <SpelledStaff
        {...C_DIM7_SPELLED}
        showKeyboard={false}
        crossedOut={true}
        caption={"Cdim7 by the book:\ncorrect, but beside the point"}
      />

      <p>
        B𝄫 is the same key as A, and the changing the key doesn't really help the spelling much. What you actually
        hear is the shape: 4 notes, each 3 semitones apart.
      </p>
      <ChordWheel
        rootNote="C"
        chordType={ChordType.Diminished7}
        inversionIndex={0}
        caption={"Cdim7 as the app shows it:\n4 notes, each 3 semitones apart"}
        isCompact={true}
        showLabels={true}
      />

      <p>
        The app puts the focus on distances between the notes rather than their spelling, so you
        will never see a double sharp or double flat here, even where standard notation requires
        one.
      </p>

      <SeeAlso
        items={[
          "symmetry-and-dissonance",
          "chromatic-circle",
        ]}
      />
    </>
  );
}
