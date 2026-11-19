import type { Metadata } from "next";

import { ArticlePage } from "@/components/Learn/layout/ArticlePage";
import { ComparisonGrid2, ComparisonGrid4 } from "@/components/Learn/layout/ComparisonGrid";
import { ChordWheel } from "@/components/Learn/figures/ChordWheel";
import { ProgressionStaff } from "@/components/Learn/figures/ProgressionStaff";
import { LEARN_STYLES } from "@/lib/design";
import { learnViewMetadata, metadataForSlugPage } from "@/lib/metadata";
import { ChordProgressionType } from "@/types/enums/ChordProgressionType";
import { ChordType } from "@/types/enums/ChordType";

export const metadata: Metadata = metadataForSlugPage(
  learnViewMetadata,
  "/learn/progressions/chord-progressions",
  "Chord Progressions",
  "A chord progression is a sequence of chords, recognized by how its roots move from the tonic rather than by which letters it uses - shown on the chromatic circle with the 50s progression and 2 more examples.",
);

export default function ChordProgressionsPage() {
  return (
    <ArticlePage
      id="chord-progressions"
      seeAlso={["roman-numerals", "chord-quality"]}
    >
      <h1 className={LEARN_STYLES.h1}>Chord Progressions</h1>

      <p>
        A chord progression is a sequence of chords. What you recognize when you hear one is the way
        the chords move relative to the tonic, not their letter names, which is why the same
        progression is easy to spot in any key. That movement is what the circle shows: each chord
        is a shape, and the progression is those shapes taking turns around the same ring.
      </p>

      <h2 className={LEARN_STYLES.h2}>The 50s progression</h2>

      <p>
        Four chords, I–vi–IV–V, the backbone of a great many songs from the 1950s on. In C, those
        are C major, A minor, F major and G major:
      </p>

      <ComparisonGrid4>
        <ChordWheel
          rootNote="C"
          chordType={ChordType.Major}
          inversionIndex={0}
          caption="I: C major"
          showKeyboard={false}
        />
        <ChordWheel
          rootNote="A"
          chordType={ChordType.Minor}
          inversionIndex={0}
          caption="vi: A minor"
          showKeyboard={false}
        />
        <ChordWheel
          rootNote="F"
          chordType={ChordType.Major}
          inversionIndex={0}
          caption="IV: F major"
          showKeyboard={false}
        />
        <ChordWheel
          rootNote="G"
          chordType={ChordType.Major}
          inversionIndex={0}
          caption="V: G major"
          showKeyboard={false}
        />
      </ComparisonGrid4>

      <p>
        Start the same pattern on D and every shape moves 2 wedges around the circle together. The
        chords are different, the progression is the same:
      </p>

      <ComparisonGrid2>
        <ProgressionStaff
          tonic="C"
          progression={ChordProgressionType.Fifties_Progression}
          caption="In C"
        />
        <ProgressionStaff
          tonic="D"
          progression={ChordProgressionType.Fifties_Progression}
          caption="In D"
        />
      </ComparisonGrid2>

      <h2 className={LEARN_STYLES.h2}>The same chords in a different order</h2>

      <p>
        Change the order and it&apos;s a different progression, even with the same chords. The verse
        of <i>Let It Be</i> uses C, G, A minor and F - the 50s progression&apos;s chords, but
        I–V–vi–IV:
      </p>

      <ComparisonGrid4>
        <ChordWheel
          rootNote="C"
          chordType={ChordType.Major}
          inversionIndex={0}
          caption="I: C major"
          showKeyboard={false}
        />
        <ChordWheel
          rootNote="G"
          chordType={ChordType.Major}
          inversionIndex={0}
          caption="V: G major"
          showKeyboard={false}
        />
        <ChordWheel
          rootNote="A"
          chordType={ChordType.Minor}
          inversionIndex={0}
          caption="vi: A minor"
          showKeyboard={false}
        />
        <ChordWheel
          rootNote="F"
          chordType={ChordType.Major}
          inversionIndex={0}
          caption="IV: F major"
          showKeyboard={false}
        />
      </ComparisonGrid4>

      <h2 className={LEARN_STYLES.h2}>In a minor key</h2>

      <p>
        The same idea works in minor, with the numerals counted from a minor tonic. The progression
        i–♭VII–♭VI–V descends 1 step at a time:
      </p>

      <ComparisonGrid4>
        <ChordWheel
          rootNote="A"
          chordType={ChordType.Minor}
          inversionIndex={0}
          caption="i: A minor"
          showKeyboard={false}
        />
        <ChordWheel
          rootNote="G"
          chordType={ChordType.Major}
          inversionIndex={0}
          caption="♭VII: G major"
          showKeyboard={false}
        />
        <ChordWheel
          rootNote="F"
          chordType={ChordType.Major}
          inversionIndex={0}
          caption="♭VI: F major"
          showKeyboard={false}
        />
        <ChordWheel
          rootNote="E"
          chordType={ChordType.Major}
          inversionIndex={0}
          caption="V: E major"
          showKeyboard={false}
        />
      </ComparisonGrid4>
    </ArticlePage>
  );
}
