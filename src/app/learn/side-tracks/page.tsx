import type { Metadata } from "next";

import { IndexEntry } from "@/components/Learn/layout/IndexEntry";
import { BackLink } from "@/components/Learn/layout/BackLink";
import { LEARN_STYLES } from "@/lib/design";
import { learnViewMetadata, metadataForSlugPage } from "@/lib/metadata";

export const metadata: Metadata = metadataForSlugPage(
  learnViewMetadata,
  "/learn/side-tracks",
  "Side Tracks",
  "Optional reading for the curious: why symmetrical shapes sound unsettled, how chord colors are computed, and other pieces worth a detour.",
);

export default function SideTracksIndexPage() {
  return (
    <>
      <BackLink to="learn" />

      <h1 className={LEARN_STYLES.h1}>Side Tracks</h1>

      <p>Optional reading for the curious. Nothing else depends on these.</p>

      <IndexEntry id="symmetry-and-dissonance">
        Why the <i>tritone</i>, the <i>augmented triad</i>, and the <i>diminished 7th</i> all sound
        unsettled: split the octave evenly and no note is left to call home.
      </IndexEntry>

      <IndexEntry id="chord-color-formula">
        The full recipe behind a chord&apos;s color: its intervals, their weights, and the mix.
      </IndexEntry>

      <IndexEntry id="whats-wrong-with-music-theory">
        Historical accidents, enharmonic confusion, key signatures, pointless memorization, and
        turf wars around spelling - a tour of the parts of theory that aren&apos;t about sound.
      </IndexEntry>
    </>
  );
}
