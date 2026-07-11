import chroma from "chroma-js";

import { IntervalType } from "@/types/enums/IntervalType";
import { NoteGroupingId } from "@/types/NoteGroupingId";
import { MusicalKey } from "@/types/Keys/MusicalKey";
import { ScalePlaybackMode } from "@/types/enums/ScalePlaybackMode";
import { IntervalClass } from "@/types/IntervalClass";
import { ixScaleDegreeIndex } from "@/types/ScaleModes/ScaleDegreeType";
import { ChordSetUtils } from "@/utils/ChordSetUtils";
import { ScaleDegreeFormatter } from "@/utils/formatters/ScaleDegreeFormatter";
import { RomanChordFormatter } from "@/utils/formatters/RomanChordFormatter";
import { ColorUtils, intervalClassFromSemitones } from "@/utils/visual/ColorUtils";
import { getColorForGrouping } from "@/utils/visual/NoteGroupingColorRegistry";
import { INTERVAL_CLASS_COLORS } from "@/utils/visual/IntervalClassColors";

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

const STEP_NEUTRAL_COLOR = INTERVAL_CLASS_COLORS[0];

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
  if (fromIndex < offsets.length - 1) {
    return offsets[fromIndex + 1]! - offsets[fromIndex]!;
  }
  return 12 + offsets[0]! - offsets[offsets.length - 1]!;
}

function buildStepsRibbon(key: MusicalKey): ScaleRibbonData {
  const offsets = getScalePatternOffsets(key);
  const notes: ScaleRibbonNote[] = offsets.map((_, i) => ({
    label: `${i + 1}`,
    color: STEP_NEUTRAL_COLOR,
    isTonic: i === 0,
  }));
  notes.push({ label: "8", color: STEP_NEUTRAL_COLOR, isTonic: true });

  const steps: ScaleRibbonStep[] = offsets.map((_, i) => {
    const semitones = getStepSemitonesBetween(offsets, i);
    return {
      label: stepLabelForSemitones(semitones),
      color: stepColorForSemitones(semitones),
    };
  });

  return { title: "Steps (W–H)", notes, steps };
}

function buildFromRootRibbon(key: MusicalKey): ScaleRibbonData {
  const offsets = getScalePatternOffsets(key);
  const notes: ScaleRibbonNote[] = offsets.map((offset, i) => {
    const scaleDegreeInfo = key.scaleModeInfo.getScaleDegreeInfoFromPosition(ixScaleDegreeIndex(i));
    return {
      label: ScaleDegreeFormatter.formatForDisplay(scaleDegreeInfo),
      color: ColorUtils.getColorForSemitoneDistance(offset),
      isTonic: i === 0,
    };
  });
  notes.push({
    label: "8",
    color: INTERVAL_CLASS_COLORS[0],
    isTonic: true,
  });

  return { title: "From root (1–♭2…)", notes, steps: [] };
}

function buildTriadsRibbon(key: MusicalKey): ScaleRibbonData {
  const notes: ScaleRibbonNote[] = Array.from({ length: key.scalePatternLength }, (_, i) => {
    const scaleDegreeInfo = key.scaleModeInfo.getScaleDegreeInfoFromPosition(ixScaleDegreeIndex(i));
    const chordType = ChordSetUtils.getTriadChordType(scaleDegreeInfo, key.scaleModeInfo);
    const roman = RomanChordFormatter.formatRomanChord(
      RomanChordFormatter.romanChordFromScaleDegree(scaleDegreeInfo, key.scaleModeInfo),
    );
    return {
      label: roman,
      color: getColorForGrouping(chordType),
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
    color: getColorForGrouping(
      ChordSetUtils.getTriadChordType(
        key.scaleModeInfo.getScaleDegreeInfoFromPosition(ixScaleDegreeIndex(0)),
        key.scaleModeInfo,
      ),
    ),
    isTonic: true,
  });

  return { title: "Triads", notes, steps: [] };
}

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
  const offsets = getScalePatternOffsets(key);
  return offsets.map((_, i) => {
    const semitones = getStepSemitonesBetween(offsets, i);
    return {
      label: stepLabelForSemitones(semitones),
      color: stepColorForSemitones(semitones),
    };
  });
}

export function getIntervalTypesForScaleFromRoot(key: MusicalKey): Set<NoteGroupingId> {
  const offsets = getScalePatternOffsets(key);
  const intervalClassToType: Record<IntervalClass, IntervalType> = {
    0: IntervalType.Octave,
    1: IntervalType.Minor2,
    2: IntervalType.Major2,
    3: IntervalType.Minor3,
    4: IntervalType.Major3,
    5: IntervalType.Fourth,
    6: IntervalType.Tritone,
  };

  const types = new Set<NoteGroupingId>();
  for (const offset of offsets) {
    const intervalClass = intervalClassFromSemitones(offset);
    if (intervalClass !== 0) {
      types.add(intervalClassToType[intervalClass]);
    }
  }
  return types;
}
