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
 * A ribbon has one of three real shapes, not one shape with optional fields: Steps mode marks
 * bare degree ticks connected by colored segments ("ticks"); the plain Notes baseline marks bare
 * labels with nothing to color them by ("labels" - a single note has no interval to derive a
 * color from, so every swatch would paint the same neutral default); every other mode marks
 * colored swatches with no segments between them ("swatches"). Modeling this as a union - rather
 * than `color?` on notes and an always-present-but-sometimes-empty `steps` array - means a
 * "ticks" ribbon's notes can never claim a color nobody reads, a "labels" ribbon can never carry
 * a color that isn't real, and a "swatches" ribbon's notes can never omit a color the layout
 * needs; {@link ScaleRibbon} switches on `kind` instead of sniffing `steps.length > 0`.
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

/**
 * Step segments are an opt-in annotation on the Notes ribbon, not a mode of their own. W-H is a
 * third measuring frame - each note against its neighbour - competing with the two the app is
 * actually built to teach (each note against the tonic; each note against its chord tones), so
 * it stays off by default rather than greeting every first-time user. No other lens is heard as
 * steps between consecutive degrees, so the toggle has no effect outside Notes.
 */
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

/**
 * Matches the raw distance from the root, not its interval class: folding to a class turns
 * every interval above the tritone into its inversion, so Hungarian Minor's ♭6 and 7 were
 * labelled `M3` and `m2` - intervals the scale does not contain. Color still comes from the
 * class (inversions share a hue), so only the label changes.
 */
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

/**
 * Steps are measured, not spelled. Interval names were tried here and dropped: they carry a
 * harmonic function a step does not have, so Hungarian Minor's E♭-F♯ and A♭-B - augmented
 * 2nds, spelled as 2nds - came out as `m3`, the right size under the wrong name.
 */
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
 * octave tonic.
 *
 * Every non-chordal lens uses these same labels, deliberately. Switching lens should change what
 * you *hear*, not what things are *called*: if the ribbon renumbered itself between Notes and
 * Drone, a listener could not tell which of the two changes produced the effect. Plain ordinals
 * (`1 2 3...`) were tried for the Notes baseline and dropped - they count positions without
 * saying anything about the notes, the same emptiness as W-H one layer down, and in Phrygian the
 * third degree really is flat. The parallel-mode comparison this notation exists for is made by
 * switching *key* within one lens (C Ionian `1 2 3 4 5 6 7` against C Phrygian `1 ♭2 ♭3 4 5 ♭6
 * ♭7`), where the mode is the only variable.
 *
 * Letter names live on the keyboards, which carry the absolute axis; the ribbon carries the
 * relative one, and neither repeats the other.
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
  // Same labels as the Notes ribbon; only the color is new, and it is the thing the drone adds -
  // each degree colored by the interval it forms against the pedal tone.
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
    // Numeral only in both modes: the ribbon is tight on space, and a quality marker
    // (full or abbreviated) would either overflow or, for a bare "7", misrepresent chords
    // with no literal 7th (e.g. Minor6, AugMajor7). Color carries quality here instead;
    // full quality is reserved for chord display and the legend, where there is room.
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
