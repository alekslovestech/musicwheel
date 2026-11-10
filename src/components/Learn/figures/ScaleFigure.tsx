"use client";

import Link from "next/link";
import { Fragment, useMemo } from "react";

import { ScaleRibbon } from "@/components/ColorLegend/ScaleRibbon";
import { CircularKeyboardView } from "@/components/Keyboard/Circular/CircularKeyboardView";
import { LinearKeyboardView } from "@/components/Keyboard/Linear/LinearKeyboardView";
import { Staff } from "@/components/Learn/figures/Staff";
import { FigureFrame } from "@/components/Learn/figures/FigureFrame";
import { LEARN_STYLES } from "@/lib/design";
import { ScalePlaybackMode } from "@/types/enums/ScalePlaybackMode";
import { actualToChromatic, NoteIndices } from "@/types/IndexTypes";
import { DEFAULT_MUSICAL_KEY, MusicalKey } from "@/types/Keys/MusicalKey";
import { ScaleDegree, scaleDegreeToIndex } from "@/types/ScaleModes/ScaleDegreeType";
import { VexFlowFormatter } from "@/utils/formatters/VexFlowFormatter";
import { AnyScaleType, scaleSelectionPath } from "@/utils/slug/scaleSelection";
import { SCALE_STAFF_DRAW_OPTIONS, StaffUtils } from "@/utils/StaffUtils";
import { buildScaleRibbonData } from "@/utils/visual/scaleRibbonUtils";

/** The parts a scale figure can show. */
type ScaleView = "wheel" | "ribbon" | "staff" | "linear";

const DEFAULT_VIEWS: readonly ScaleView[] = ["wheel", "linear"];

/** One scale, drawn from the app's own logic - its note spelling, key signature and highlighting -
 * as any mix of: the wheel, the ribbon (scale-degree numbers with step sizes), the staff
 * (ascending, tonic to its octave) and the linear keyboard, in the order given by `views`. Ends
 * with a link to hear it in the app. Handles both diatonic and non-diatonic scales.
 *
 * Highlighting is shared by every view: `highlightedDegree` lights that one degree; without it,
 * nothing is lit - just the scale's plain shape (its notes in the scale color), or its step
 * pattern. The keyboards always use the scale-aware colors, so a scale's notes stay the same
 * light blue whether or not the figure also shows the staff.
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
  ribbonCount,
  ribbonShowLabels = true,
  linearShowLabels,
  isCompact = false,
  hasKeySignature = true,
  showAppLink = true,
  bare = false,
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
  /** Show only the first N cells of the ribbon - for a Triad or Seventh ribbon, where each cell
   * is a degree's chord. Has no effect on the Notes ribbons. */
  ribbonCount?: number;
  /** The label under each ribbon cell; off leaves bare swatches. Triad and Seventh ribbons only. */
  ribbonShowLabels?: boolean;
  /** The note-name letter and accidental ticks on the linear keyboard - see PianoKeyLinear.
   * Defaults to off, except when the keyboard just shows the staff's notes. */
  linearShowLabels?: boolean;
  /** Single-octave linear keyboard starting on C, instead of the full two-octave view - only
   * looks right when tonic is C, since a compact keyboard always starts there regardless of
   * tonic. See LinearKeyboardView.isCompact. */
  isCompact?: boolean;
  /** Set false to draw the staff in C major's empty signature, so the scale's altered notes carry
   * their own accidentals instead of the app's usual key signature. */
  hasKeySignature?: boolean;
  /** The "Hear it in the app" link under the caption - off for an article that isn't ready to
   * point at the app yet. */
  showAppLink?: boolean;
  /** Render just the figure - no card, padding or caption - for use as an image. */
  bare?: boolean;
}) {
  const musicalKey = useMemo(() => MusicalKey.fromScale(tonic, scaleType), [tonic, scaleType]);
  const showsStaff = views.includes("staff");
  // The keyboard is just showing the scale next to its staff (no degree spotlighted).
  const echoesStaffNotes = showsStaff && highlightedDegree == null;

  // Leave undefined rather than [] when nothing's highlighted - the keyboard views already
  // default highlightedNoteIndices to [] themselves.
  const highlightedNoteIndices = useMemo((): NoteIndices | undefined => {
    if (highlightedDegree == null) return undefined;
    return musicalKey.getNoteIndicesForScaleDegree(
      scaleDegreeToIndex(highlightedDegree),
      scalePlaybackMode,
    );
  }, [musicalKey, highlightedDegree, scalePlaybackMode]);

  const staffSpellingKey = useMemo(
    () => (hasKeySignature ? musicalKey.getStaffSpellingKey() : DEFAULT_MUSICAL_KEY),
    [musicalKey, hasKeySignature],
  );

  const staffKeySignature = useMemo(
    () => VexFlowFormatter.getKeySignatureForVex(staffSpellingKey),
    [staffSpellingKey],
  );

  const staffSteps = useMemo(
    () => StaffUtils.buildDuratedScaleStepsForBar(musicalKey, scalePlaybackMode, staffSpellingKey),
    [musicalKey, scalePlaybackMode, staffSpellingKey],
  );

  const ribbonData = useMemo(() => {
    const ribbon = buildScaleRibbonData(musicalKey, scalePlaybackMode, showStepAnnotations);
    return ribbonCount !== undefined && ribbon.kind === "swatches"
      ? { ...ribbon, notes: ribbon.notes.slice(0, ribbonCount) }
      : ribbon;
  }, [musicalKey, scalePlaybackMode, showStepAnnotations, ribbonCount]);

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
            ribbon={ribbonData}
            activeDegreeIndex={
              highlightedDegree == null ? null : scaleDegreeToIndex(highlightedDegree)
            }
            showTitle={false}
            showLabels={ribbonShowLabels}
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
            onKeyClick={null}
            isBassNote={(actualIndex) => actualToChromatic(actualIndex) === musicalKey.tonicIndex}
            showLabels={linearShowLabels ?? echoesStaffNotes}
            isCompact={isCompact}
            showScaleBoundaryFlag={!echoesStaffNotes}
          />
        );
    }
  }

  return (
    <FigureFrame
      bare={bare}
      caption={
        <>
          <span>{caption}</span>
          {showAppLink && (
            <Link
              href={scaleSelectionPath({
                tonic,
                scaleMode: scaleType,
                playbackMode: scalePlaybackMode,
              })}
              className={LEARN_STYLES.link}
            >
              Hear {tonic} {scaleType} in the app
            </Link>
          )}
        </>
      }
    >
      {views.map((view) => (
        <Fragment key={view}>{renderView(view)}</Fragment>
      ))}
    </FigureFrame>
  );
}
