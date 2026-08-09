import chroma from "chroma-js";

import { subChromatic } from "@/types/ChromaticIndex";
import { NoteGroupingId } from "@/types/NoteGroupingId";
import { NoteGroupingLibrary } from "@/types/NoteGroupingLibrary";
import { MusicalKey } from "@/types/Keys/MusicalKey";
import { ScalePlaybackMode } from "@/types/enums/ScalePlaybackMode";
import { ixScaleDegreeIndex } from "@/types/ScaleModes/ScaleDegreeType";
import { ScaleDegreeFormatter } from "@/utils/formatters/ScaleDegreeFormatter";
import { RomanChordFormatter } from "@/utils/formatters/RomanChordFormatter";
import { ColorUtils } from "@/utils/visual/ColorUtils";
import { noteHighlightColor } from "@/utils/visual/noteHighlightColor";

/** A labeled, colored ribbon mark - a step segment, or a note whose color is shown. */
export type ScaleRibbonMark = {
  label: string;
  color: chroma.Color;
};

/** A degree marker with no color of its own - Steps mode; color lives on the segments between ticks. */
export type ScaleRibbonTick = {
  label: string;
};

/**
 * Three shapes, not one shape with optional fields: bare ticks plus colored segments ("ticks");
 * bare labels with no color to show ("labels" - a single note has no interval to derive one
 * from); colored swatches with no segments ("swatches"). The union means a ribbon can't claim a
 * color it doesn't have or omit one the layout needs.
 */
export type ScaleRibbonData =
  | { title: string; kind: "ticks"; notes: ScaleRibbonTick[]; steps: ScaleRibbonMark[] }
  | { title: string; kind: "labels"; notes: ScaleRibbonTick[] }
  | { title: string; kind: "swatches"; notes: ScaleRibbonMark[] };

export function buildScaleRibbonData(
  key: MusicalKey,
  scalePlaybackMode: ScalePlaybackMode,
  showStepAnnotations = false,
): ScaleRibbonData {
  switch (scalePlaybackMode) {
    case ScalePlaybackMode.DronedSingleNote:
      return buildFromRootRibbon(key);
    case ScalePlaybackMode.Triad:
    case ScalePlaybackMode.Seventh:
      return buildChordRibbon(key, scalePlaybackMode);
    default:
      return showStepAnnotations ? buildStepsRibbon(key) : buildNotesRibbon(key);
  }
}

/** Step segments are an opt-in annotation on the Notes ribbon only, off by default. */
export function showsStepSegments(
  scalePlaybackMode: ScalePlaybackMode,
  showStepAnnotations: boolean,
): boolean {
  return showStepAnnotations && scalePlaybackMode === ScalePlaybackMode.SingleNote;
}

export function getStepSegmentsForScale(key: MusicalKey): ScaleRibbonMark[] {
  return buildStepSegments(getScalePatternOffsets(key));
}

/** Distinct step distances in the scale, sorted by ascending semitones. */
export function getStepColorLegendItems(key: MusicalKey): ScaleRibbonMark[] {
  const offsets = getScalePatternOffsets(key);
  const bySemitones = new Map<number, ScaleRibbonMark>();
  offsets.forEach((_, i) => {
    const semitones = getStepSemitonesBetween(offsets, i);
    if (!bySemitones.has(semitones)) {
      bySemitones.set(semitones, {
        label: stepLabel(semitones),
        color: stepColorForSemitones(semitones),
      });
    }
  });
  return [...bySemitones.entries()].sort(([a], [b]) => a - b).map(([, step]) => step);
}

/** Raw distance from the root, not its interval class - folding to a class would relabel
 *  intervals above the tritone as their inversions. */
export function getIntervalTypesForScaleFromRoot(key: MusicalKey): Set<NoteGroupingId> {
  const offsets = getScalePatternOffsets(key);

  const types = new Set<NoteGroupingId>();
  for (const offset of offsets) {
    if (offset === 0) continue;
    const type = NoteGroupingLibrary.matchIntervalTypeFromOffset(offset);
    if (type != null) types.add(type);
  }
  return types;
}

/** Steps are measured, not spelled - interval names would carry a harmonic function a step
 *  doesn't have (e.g. an augmented 2nd mislabeled `m3`, the right size under the wrong name). */
function stepLabel(semitones: number): string {
  if (semitones === 1) return "H";
  if (semitones === 2) return "W";
  if (semitones === 3) return "1½";
  return `${semitones}`;
}

function stepColorForSemitones(semitones: number): chroma.Color {
  return ColorUtils.getColorForSemitoneDistance(semitones);
}

function getScalePatternOffsets(key: MusicalKey): number[] {
  const pattern = key.scaleModeInfo.scalePattern;
  return Array.from({ length: pattern.length }, (_, i) =>
    pattern.getOffsetAtIndex(ixScaleDegreeIndex(i)),
  );
}

function getStepSemitonesBetween(offsets: number[], fromIndex: number): number {
  const nextIndex = (fromIndex + 1) % offsets.length;
  return subChromatic(offsets[nextIndex], offsets[fromIndex]);
}

function buildStepSegments(offsets: number[]): ScaleRibbonMark[] {
  return offsets.map((_, i) => {
    const semitones = getStepSemitonesBetween(offsets, i);
    return {
      label: stepLabel(semitones),
      color: stepColorForSemitones(semitones),
    };
  });
}

/**
 * Scale degrees with their accidentals - `1 ♭2 ♭3 4 5 ♭6 ♭7 8` for Phrygian - closing on the
 * octave tonic. Every non-chordal lens uses these same labels: switching lens should change what
 * you hear, not what things are called.
 */
function scaleDegreeLabels(key: MusicalKey): string[] {
  const degrees = Array.from({ length: key.scalePatternLength }, (_, i) =>
    ScaleDegreeFormatter.formatForDisplay(
      key.scaleModeInfo.getScaleDegreeInfoFromPosition(ixScaleDegreeIndex(i)),
    ),
  );
  return [...degrees, "8"];
}

function degreeTicks(key: MusicalKey): ScaleRibbonTick[] {
  return scaleDegreeLabels(key).map((label) => ({ label }));
}

function buildNotesRibbon(key: MusicalKey): ScaleRibbonData {
  return { title: "Notes", kind: "labels", notes: degreeTicks(key) };
}

/** The Notes ribbon with W-H connectors drawn in; the degree labels stay, color joins the steps. */
function buildStepsRibbon(key: MusicalKey): ScaleRibbonData {
  return {
    title: "Notes",
    kind: "ticks",
    notes: degreeTicks(key),
    steps: getStepSegmentsForScale(key),
  };
}

function buildFromRootRibbon(key: MusicalKey): ScaleRibbonData {
  // Same labels as the Notes ribbon; color is the only thing the drone adds.
  const notes: ScaleRibbonMark[] = scaleDegreeLabels(key).map((label, i) => ({
    label,
    color: noteHighlightColor(key, ScalePlaybackMode.DronedSingleNote, i),
  }));

  return { title: "Drone", kind: "swatches", notes };
}

/** Triad / Seventh: one chord stacked on each degree, labeled by its roman numeral. */
function buildChordRibbon(
  key: MusicalKey,
  mode: ScalePlaybackMode.Triad | ScalePlaybackMode.Seventh,
): ScaleRibbonData {
  const isSeventh = mode === ScalePlaybackMode.Seventh;

  const romanLabelAtDegree = (degreeIndex: number): string => {
    const scaleDegreeInfo = key.scaleModeInfo.getScaleDegreeInfoFromPosition(
      ixScaleDegreeIndex(degreeIndex),
    );
    const romanChord = RomanChordFormatter.romanChordFromScaleDegree(
      scaleDegreeInfo,
      key.scaleModeInfo,
      isSeventh,
    );
    // Numeral only - the ribbon is tight on space; color carries quality instead.
    return RomanChordFormatter.formatRomanNumeralOnly(romanChord);
  };

  const notes: ScaleRibbonMark[] = Array.from({ length: key.scalePatternLength }, (_, i) => ({
    label: romanLabelAtDegree(i),
    color: noteHighlightColor(key, mode, i),
  }));
  notes.push({
    label: romanLabelAtDegree(0),
    color: noteHighlightColor(key, mode, key.scalePatternLength),
  });

  return { title: isSeventh ? "Sevenths" : "Triads", kind: "swatches", notes };
}
