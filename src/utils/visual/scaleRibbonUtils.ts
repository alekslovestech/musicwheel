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
 * A ribbon has one of two real shapes, not one shape with an optional field: Steps mode marks
 * bare degree ticks connected by colored segments ("ticks"); every other mode marks colored
 * swatches with no segments between them ("swatches"). Modeling this as a union - rather than
 * `color?` on notes and an always-present-but-sometimes-empty `steps` array - means a "ticks"
 * ribbon's notes can never claim a color nobody reads, and a "swatches" ribbon's notes can
 * never omit a color the layout needs; {@link ScaleRibbon} switches on `kind` instead of
 * sniffing `steps.length > 0`.
 */
export type ScaleRibbonData =
  | { title: string; kind: "ticks"; notes: ScaleRibbonTick[]; steps: ScaleRibbonMark[] }
  | { title: string; kind: "swatches"; notes: ScaleRibbonMark[] };

export function buildScaleRibbonData(
  key: MusicalKey,
  scalePlaybackMode: ScalePlaybackMode,
): ScaleRibbonData {
  switch (scalePlaybackMode) {
    case ScalePlaybackMode.DronedSingleNote:
      return buildFromRootRibbon(key);
    case ScalePlaybackMode.Triad:
    case ScalePlaybackMode.Seventh:
      return buildChordRibbon(key, scalePlaybackMode);
    default:
      return buildStepsRibbon(key);
  }
}

/** Only melodic single-note playback is heard as steps between consecutive degrees. */
export function ribbonUsesStepSegments(scalePlaybackMode: ScalePlaybackMode): boolean {
  return scalePlaybackMode === ScalePlaybackMode.SingleNote;
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

function buildStepsRibbon(key: MusicalKey): ScaleRibbonData {
  const offsets = getScalePatternOffsets(key);
  const notes: ScaleRibbonTick[] = offsets.map((_, i) => ({
    label: `${i + 1}`,
  }));
  notes.push({ label: "8" });

  return { title: "Steps (W–H)", kind: "ticks", notes, steps: buildStepSegments(offsets) };
}

function buildFromRootRibbon(key: MusicalKey): ScaleRibbonData {
  const offsets = getScalePatternOffsets(key);
  const notes: ScaleRibbonMark[] = offsets.map((_, i) => {
    const scaleDegreeInfo = key.scaleModeInfo.getScaleDegreeInfoFromPosition(ixScaleDegreeIndex(i));
    return {
      label: ScaleDegreeFormatter.formatForDisplay(scaleDegreeInfo),
      color: noteHighlightColor(key, ScalePlaybackMode.DronedSingleNote, i),
    };
  });
  notes.push({
    label: "8",
    color: noteHighlightColor(key, ScalePlaybackMode.DronedSingleNote, key.scalePatternLength),
  });

  return { title: "From root (1–♭2…)", kind: "swatches", notes };
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
