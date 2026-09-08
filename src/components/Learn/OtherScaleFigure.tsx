"use client";

import Link from "next/link";

import { CircularKeyboardView } from "@/components/Keyboard/Circular/CircularKeyboardView";
import { LEARN_STYLES } from "@/lib/design";
import { OtherScaleType } from "@/types/enums/OtherScaleType";
import { ScalePlaybackMode } from "@/types/enums/ScalePlaybackMode";
import { MusicalKey } from "@/types/Keys/MusicalKey";
import { scaleSelectionPath } from "@/utils/slug/scaleSelection";

/**
 * A non-diatonic scale (whole tone, and future symmetric scales) on the wheel: the same
 * Scales-mode shading StaticChordFigure deliberately opts out of, since here it's the point -
 * see MusicalKey.scaleModeInfo/otherScaleInfo for why these scales can't go through ScaleFigure
 * (no key signature, no ribbon - a non-diatonic key has no scale-degree chords or step ribbon to
 * offer there either, see the guards in StaffRenderer/SequenceLegendPanel/useColorLegendGroups).
 */
export function OtherScaleFigure({
  rootNote,
  otherScaleType,
  caption,
}: {
  rootNote: string;
  otherScaleType: OtherScaleType;
  caption: string;
}) {
  const musicalKey = MusicalKey.fromOtherScale(rootNote, otherScaleType);

  return (
    <figure className={LEARN_STYLES.figureCard}>
      <CircularKeyboardView musicalKey={musicalKey} isScales={true} onKeyClick={null} />
      <figcaption className={LEARN_STYLES.figureCaption}>
        <span>{caption}</span>
        <Link
          href={scaleSelectionPath({
            tonic: rootNote,
            scaleMode: otherScaleType,
            playbackMode: ScalePlaybackMode.SingleNote,
          })}
          className={LEARN_STYLES.link}
        >
          Hear {rootNote} {otherScaleType} in the app
        </Link>
      </figcaption>
    </figure>
  );
}
