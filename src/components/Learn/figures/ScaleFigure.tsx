"use client";

import Link from "next/link";
import { Fragment, useMemo } from "react";

import { ScaleRibbon } from "@/components/ColorLegend/ScaleRibbon";
import { CircularKeyboardView } from "@/components/Keyboard/Circular/CircularKeyboardView";
import { LinearKeyboardView } from "@/components/Keyboard/Linear/LinearKeyboardView";
import { Staff } from "@/components/Learn/figures/Staff";
import { FIGURE_KEY_BORDER, LEARN_STYLES } from "@/lib/design";
import { ScalePlaybackMode } from "@/types/enums/ScalePlaybackMode";
import { actualToChromatic, NoteIndices } from "@/types/IndexTypes";
import { MusicalKey } from "@/types/Keys/MusicalKey";
import { ScaleDegree, scaleDegreeToIndex } from "@/types/ScaleModes/ScaleDegreeType";
import { VexFlowFormatter } from "@/utils/formatters/VexFlowFormatter";
import { getScaleStepAtSequenceIndex } from "@/utils/SequencePlaybackUtils";
import { AnyScaleType, scaleSelectionPath } from "@/utils/slug/scaleSelection";
import { SCALE_STAFF_DRAW_OPTIONS, StaffUtils } from "@/utils/StaffUtils";
import { buildScaleRibbonData } from "@/utils/visual/scaleRibbonUtils";

/** The parts a scale figure can show. */
export type ScaleView = "wheel" | "ribbon" | "staff" | "linear";

const DEFAULT_VIEWS: readonly ScaleView[] = ["wheel", "linear"];

/** One scale, drawn from the app's own logic - its note spelling, key signature and highlighting -
 * as any mix of: the wheel, the ribbon (scale-degree numbers with step sizes), the staff
 * (ascending, tonic to its octave) and the linear keyboard, in the order given by `views`. Ends
 * with a link to hear it in the app. Handles both diatonic and non-diatonic scales.
 *
 * Highlighting is shared by every view: `highlightedDegree` lights that one degree; without it,
 * a figure that shows the staff lights every note on the staff, and any other figure lights
 * nothing - just the scale's plain shape, or its step pattern. The linear keyboard is styled to
 * match: the scale-aware colors (a degree spotlighted against the scale) normally, but the same
 * plain highlight as the chord figures when it is simply showing the staff's notes.
 *
 * For notation the app would never draw, see SpelledStaff. */
export function ScaleFigure({
  tonic,
  scaleType,
  caption,
  views = DEFAULT_VIEWS,
  scalePlaybackMode = ScalePlaybackMode.SingleNote,
  highlightedDegree,
  showStepAnnotations = false,
  linearShowLabels,
  isCompact = false,
}: {
  tonic: string;
  scaleType: AnyScaleType;
  caption: string;
  /** Which parts to show, top to bottom. Defaults to the wheel over the linear keyboard. */
  views?: readonly ScaleView[];
  /** Triad/Seventh are diatonic-only (see MusicalKey.getOffsets) - don't pass those for a
   * non-diatonic scaleType. */
  scalePlaybackMode?: ScalePlaybackMode;
  /** Scale degree to highlight, under whichever scalePlaybackMode is active. */
  highlightedDegree?: ScaleDegree;
  /** Step arcs on the wheel and step sizes on the ribbon. */
  showStepAnnotations?: boolean;
  /** The note-name letter and accidental ticks on the linear keyboard - see PianoKeyLinear.
   * Defaults to off, except when the keyboard just shows the staff's notes. */
  linearShowLabels?: boolean;
  /** Single-octave linear keyboard starting on C, instead of the full two-octave view - only
   * looks right when tonic is C, since a compact keyboard always starts there regardless of
   * tonic. See LinearKeyboardView.isCompact. */
  isCompact?: boolean;
}) {
  const musicalKey = useMemo(() => MusicalKey.fromScale(tonic, scaleType), [tonic, scaleType]);
  const showsStaff = views.includes("staff");
  // The keyboard is just echoing the staff's notes (no degree spotlighted against the scale).
  const echoesStaffNotes = showsStaff && highlightedDegree == null;

  // Leave undefined rather than [] when nothing's highlighted - the keyboard views already
  // default highlightedNoteIndices to [] themselves.
  const highlightedNoteIndices = useMemo((): NoteIndices | undefined => {
    if (highlightedDegree != null) {
      return musicalKey.getNoteIndicesForScaleDegree(
        scaleDegreeToIndex(highlightedDegree),
        scalePlaybackMode,
      );
    }
    if (!showsStaff) return undefined;
    // Every note of the staff, including the octave return, so the top note lights up too.
    return Array.from({ length: musicalKey.scalePatternLength + 1 }, (_, step) =>
      getScaleStepAtSequenceIndex(musicalKey, step, scalePlaybackMode),
    ).flatMap((step) => step.notesToPlay);
  }, [musicalKey, highlightedDegree, scalePlaybackMode, showsStaff]);

  const staffKeySignature = useMemo(
    () => VexFlowFormatter.getKeySignatureForVex(musicalKey.getStaffSpellingKey()),
    [musicalKey],
  );

  const staffSteps = useMemo(
    () =>
      StaffUtils.buildDuratedScaleStepsForBar(
        musicalKey,
        scalePlaybackMode,
        musicalKey.getStaffSpellingKey(),
      ),
    [musicalKey, scalePlaybackMode],
  );

  function renderView(view: ScaleView) {
    switch (view) {
      case "wheel":
        return (
          <CircularKeyboardView
            musicalKey={musicalKey}
            highlightedNoteIndices={highlightedNoteIndices}
            scalePlaybackMode={scalePlaybackMode}
            showStepAnnotations={showStepAnnotations}
            onKeyClick={null}
          />
        );
      case "ribbon":
        return (
          <ScaleRibbon
            ribbon={buildScaleRibbonData(musicalKey, scalePlaybackMode, showStepAnnotations)}
            activeDegreeIndex={
              highlightedDegree == null ? null : scaleDegreeToIndex(highlightedDegree)
            }
            showTitle={false}
          />
        );
      case "staff":
        return (
          <Staff
            keySignature={staffKeySignature}
            steps={staffSteps}
            {...SCALE_STAFF_DRAW_OPTIONS}
          />
        );
      case "linear":
        return (
          <LinearKeyboardView
            musicalKey={musicalKey}
            highlightedNoteIndices={highlightedNoteIndices}
            isScales={!echoesStaffNotes}
            onKeyClick={null}
            isBassNote={(actualIndex) => actualToChromatic(actualIndex) === musicalKey.tonicIndex}
            useRealisticColors={!echoesStaffNotes}
            showLabels={linearShowLabels ?? echoesStaffNotes}
            isCompact={isCompact}
            showScaleBoundaryFlag={!echoesStaffNotes}
          />
        );
    }
  }

  return (
    <figure className={LEARN_STYLES.figureCard} style={FIGURE_KEY_BORDER}>
      {views.map((view) => (
        <Fragment key={view}>{renderView(view)}</Fragment>
      ))}

      <figcaption className={LEARN_STYLES.figureCaption}>
        <span>{caption}</span>
        <Link
          href={scaleSelectionPath({ tonic, scaleMode: scaleType, playbackMode: scalePlaybackMode })}
          className={LEARN_STYLES.link}
        >
          Hear {tonic} {scaleType} in the app
        </Link>
      </figcaption>
    </figure>
  );
}
