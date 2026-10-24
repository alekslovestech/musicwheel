"use client";

import Link from "next/link";
import { useCallback, useMemo } from "react";
import type { Factory } from "vexflow";

import { LinearKeyboardView } from "@/components/Keyboard/Linear/LinearKeyboardView";
import { StaffCanvas } from "@/components/Learn/StaffCanvas";
import { FIGURE_KEY_BORDER, LEARN_STYLES } from "@/lib/design";
import { ScalePlaybackMode } from "@/types/enums/ScalePlaybackMode";
import { MusicalKey } from "@/types/Keys/MusicalKey";
import { VexFlowFormatter } from "@/utils/formatters/VexFlowFormatter";
import { getScaleStepAtSequenceIndex } from "@/utils/SequencePlaybackUtils";
import { AnyScaleType, scaleSelectionPath } from "@/utils/slug/scaleSelection";
import { SCALE_STAFF_DRAW_OPTIONS, StaffUtils } from "@/utils/StaffUtils";
import { VexFlowUtils } from "@/utils/VexFlowUtils";

/** A scale on the staff the way the app draws it - same note spelling, key signature, quarter
 * notes - ascending from the tonic up to its octave, with every one of those notes lit on the
 * keyboard below, and a link to hear it in the app. For the wheel view of a scale, see ScaleFigure. */
export function ScaleStaffFigure({
  tonic,
  scaleType,
  caption,
  showKeyboard = true,
  isCompact = false,
}: {
  tonic: string;
  scaleType: AnyScaleType;
  caption: string;
  showKeyboard?: boolean;
  /** Single-octave keyboard starting on C, instead of the full two-octave view - only looks right
   * when tonic is C, since a compact keyboard always starts there regardless of tonic. Defaults
   * to the full view, the opposite of ChordStaffFigure, since a scale spans a whole octave. */
  isCompact?: boolean;
}) {
  const musicalKey = useMemo(() => MusicalKey.fromScale(tonic, scaleType), [tonic, scaleType]);

  // Every note of the staff, including the octave return, so the top note lights up too.
  const highlightedNoteIndices = useMemo(
    () =>
      Array.from({ length: musicalKey.scalePatternLength + 1 }, (_, step) =>
        getScaleStepAtSequenceIndex(musicalKey, step, ScalePlaybackMode.SingleNote),
      ).flatMap((step) => step.notesToPlay),
    [musicalKey],
  );

  const draw = useCallback(
    (factory: Factory, width: number) => {
      const spellingKey = musicalKey.getStaffSpellingKey();
      const stave = VexFlowUtils.createStaveForContainer(factory, width);
      stave.addClef("treble").addKeySignature(VexFlowFormatter.getKeySignatureForVex(spellingKey));
      stave.setContext(factory.getContext()).draw();

      const steps = StaffUtils.buildDuratedScaleStepsForBar(
        musicalKey,
        ScalePlaybackMode.SingleNote,
        spellingKey,
      );
      VexFlowUtils.drawVoice(
        factory,
        stave,
        VexFlowFormatter.createStaveChordNotes(steps, factory),
        SCALE_STAFF_DRAW_OPTIONS,
      );
    },
    [musicalKey],
  );

  return (
    <figure className={LEARN_STYLES.figureCard} style={FIGURE_KEY_BORDER}>
      <StaffCanvas draw={draw} />
      {showKeyboard && (
        <LinearKeyboardView
          musicalKey={musicalKey}
          highlightedNoteIndices={highlightedNoteIndices}
          isScales={false}
          onKeyClick={null}
          isCompact={isCompact}
        />
      )}
      <figcaption className={LEARN_STYLES.figureCaption}>
        <span>{caption}</span>
        <Link
          href={scaleSelectionPath({
            tonic,
            scaleMode: scaleType,
            playbackMode: ScalePlaybackMode.SingleNote,
          })}
          className={LEARN_STYLES.link}
        >
          Hear {tonic} {scaleType} in the app
        </Link>
      </figcaption>
    </figure>
  );
}
