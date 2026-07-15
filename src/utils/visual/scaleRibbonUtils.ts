import chroma from "chroma-js";

import { subChromatic } from "@/types/ChromaticIndex";
import { NoteGroupingId } from "@/types/NoteGroupingId";
import { NoteGroupingLibrary } from "@/types/NoteGroupingLibrary";
import { MusicalKey } from "@/types/Keys/MusicalKey";
import { ScalePlaybackMode } from "@/types/enums/ScalePlaybackMode";
import { ixScaleDegreeIndex } from "@/types/ScaleModes/ScaleDegreeType";
import { ScaleDegreeFormatter } from "@/utils/formatters/ScaleDegreeFormatter";
import { RomanChordFormatter } from "@/utils/formatters/RomanChordFormatter";
import { ColorUtils, intervalClassFromSemitones } from "@/utils/visual/ColorUtils";
import { DEFAULT_INTERVAL_CLASS_COLOR } from "@/utils/visual/IntervalClassColors";
import { noteHighlightColor } from "@/utils/visual/noteHighlightColor";

export type ScaleRibbonStep = {
  label: string;
  color: chroma.Color;
};

export type ScaleRibbonNote = {
  label: string;
  color?: chroma.Color;
  isTonic?: boolean;
};

export type ScaleRibbonData = {
  title: string;
  notes: ScaleRibbonNote[];
  steps: ScaleRibbonStep[];
};

export function buildScaleRibbonData(
  key: MusicalKey,
  scalePlaybackMode: ScalePlaybackMode,
): ScaleRibbonData {
  switch (scalePlaybackMode) {
    case ScalePlaybackMode.DronedSingleNote:
      return buildFromRootRibbon(key);
    case ScalePlaybackMode.Triad:
      return buildTriadsRibbon(key);
    default:
      return buildStepsRibbon(key);
  }
}

export function getStepSegmentsForScale(key: MusicalKey): ScaleRibbonStep[] {
  return buildStepSegments(getScalePatternOffsets(key));
}

export function getIntervalTypesForScaleFromRoot(key: MusicalKey): Set<NoteGroupingId> {
  const offsets = getScalePatternOffsets(key);

  const types = new Set<NoteGroupingId>();
  for (const offset of offsets) {
    const intervalClass = intervalClassFromSemitones(offset);
    if (intervalClass === 0) continue;
    const type = NoteGroupingLibrary.matchIntervalTypeFromOffset(intervalClass);
    if (type != null) types.add(type);
  }
  return types;
}

function stepLabelForSemitones(semitones: number): string {
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

function buildStepSegments(offsets: number[]): ScaleRibbonStep[] {
  return offsets.map((_, i) => {
    const semitones = getStepSemitonesBetween(offsets, i);
    return {
      label: stepLabelForSemitones(semitones),
      color: stepColorForSemitones(semitones),
    };
  });
}

function buildStepsRibbon(key: MusicalKey): ScaleRibbonData {
  const offsets = getScalePatternOffsets(key);
  const notes: ScaleRibbonNote[] = offsets.map((_, i) => ({
    label: `${i + 1}`,
    color: DEFAULT_INTERVAL_CLASS_COLOR,
    isTonic: i === 0,
  }));
  notes.push({ label: "8", color: DEFAULT_INTERVAL_CLASS_COLOR, isTonic: true });

  return { title: "Steps (W–H)", notes, steps: buildStepSegments(offsets) };
}

function buildFromRootRibbon(key: MusicalKey): ScaleRibbonData {
  const offsets = getScalePatternOffsets(key);
  const notes: ScaleRibbonNote[] = offsets.map((_, i) => {
    const scaleDegreeInfo = key.scaleModeInfo.getScaleDegreeInfoFromPosition(ixScaleDegreeIndex(i));
    return {
      label: ScaleDegreeFormatter.formatForDisplay(scaleDegreeInfo),
      color: noteHighlightColor(key, ScalePlaybackMode.DronedSingleNote, i),
      isTonic: i === 0,
    };
  });
  notes.push({
    label: "8",
    color: noteHighlightColor(key, ScalePlaybackMode.DronedSingleNote, key.scalePatternLength),
    isTonic: true,
  });

  return { title: "From root (1–♭2…)", notes, steps: [] };
}

function buildTriadsRibbon(key: MusicalKey): ScaleRibbonData {
  const notes: ScaleRibbonNote[] = Array.from({ length: key.scalePatternLength }, (_, i) => {
    const scaleDegreeInfo = key.scaleModeInfo.getScaleDegreeInfoFromPosition(ixScaleDegreeIndex(i));
    const roman = RomanChordFormatter.formatRomanChord(
      RomanChordFormatter.romanChordFromScaleDegree(scaleDegreeInfo, key.scaleModeInfo),
    );
    return {
      label: roman,
      color: noteHighlightColor(key, ScalePlaybackMode.Triad, i),
      isTonic: i === 0,
    };
  });
  notes.push({
    label: RomanChordFormatter.formatRomanChord(
      RomanChordFormatter.romanChordFromScaleDegree(
        key.scaleModeInfo.getScaleDegreeInfoFromPosition(ixScaleDegreeIndex(0)),
        key.scaleModeInfo,
      ),
    ),
    color: noteHighlightColor(key, ScalePlaybackMode.Triad, key.scalePatternLength),
    isTonic: true,
  });

  return { title: "Triads", notes, steps: [] };
}
