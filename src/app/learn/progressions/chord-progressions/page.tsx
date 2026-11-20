import type { Metadata } from "next";

import { ArticlePage } from "@/components/Learn/layout/ArticlePage";
import { ProgressionFigure } from "@/components/Learn/figures/ProgressionFigure";
import { LEARN_STYLES } from "@/lib/design";
import { learnViewMetadata, metadataForSlugPage } from "@/lib/metadata";
import { ChordProgressionType } from "@/types/enums/ChordProgressionType";

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

      <ProgressionFigure
        tonic="C"
        progression={ChordProgressionType.Fifties_Progression}
        caption="The 50s progression in C"
      />

      <p>
        Start the same pattern on D and every shape moves 2 wedges around the circle together. The
        chords are different, the progression is the same:
      </p>

      <ProgressionFigure
        tonic="D"
        progression={ChordProgressionType.Fifties_Progression}
        caption="The 50s progression in D"
      />

      <h2 className={LEARN_STYLES.h2}>In a minor key</h2>

      <p>
        The same idea works in minor, with the numerals counted from a minor tonic. The progression
        i–♭VII–♭VI–V descends 1 step at a time:
      </p>

      <ProgressionFigure
        tonic="A"
        progression={ChordProgressionType.Andalusian_Cadence}
        caption="The Andalusian cadence in A minor"
      />
    </ArticlePage>
  );
}
