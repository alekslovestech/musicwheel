"use client";

import {
  ColorLegendGroup,
  getColorLegendGroupsForIds,
  getDegreeLabelledLegendGroups,
  getJoinedColorLegendGroupsForIds,
} from "@/utils/visual/colorLegendGroups";
import { HarmonyInputMode } from "@/types/enums/HarmonyInputMode";
import { NoteGroupingLibrary } from "@/types/NoteGroupingLibrary";
import { ChordSetUtils } from "@/utils/ChordSetUtils";
import { getIntervalTypesForScaleFromRoot } from "@/utils/visual/scaleRibbonUtils";
import { useAudio } from "@/contexts/AudioContext";
import { useMusical } from "@/contexts/MusicalContext";
import { useChordPresets } from "@/contexts/ChordPresetContext";
import { useIsChordProgressionsMode, useIsScalePreviewMode } from "@/lib/hooks/useGlobalMode";
import { ChordProgressionLibrary } from "@/types/ChordProgressions/ChordProgressionLibrary";
import { isChordalScalePlaybackMode, ScalePlaybackMode } from "@/types/enums/ScalePlaybackMode";

export function useColorLegendGroups(): {
  groups: ColorLegendGroup[];
  chordsOnly: boolean;
} {
  const isProgressionsMode = useIsChordProgressionsMode();
  const isScalesMode = useIsScalePreviewMode();
  const { selectedProgression, scalePlaybackMode } = useAudio();
  const { selectedMusicalKey } = useMusical();
  const { harmonyInputMode } = useChordPresets();

  if (isProgressionsMode && selectedProgression != null) {
    const progression = ChordProgressionLibrary.getProgression(selectedProgression);
    const chordTypes = ChordSetUtils.distinctFromProgression(progression);
    return {
      groups: getColorLegendGroupsForIds(chordTypes),
      chordsOnly: true,
    };
  }

  // Seventh labels rows by degree: its wheel shows numerals without quality, so the degree is
  // the only thing linking a row to a position. Triad's wheel does show quality (vii°), so a
  // plain quality legend still reads there.
  if (isScalesMode && scalePlaybackMode === ScalePlaybackMode.Seventh) {
    return {
      groups: getDegreeLabelledLegendGroups(ChordSetUtils.seventhsByDegree(selectedMusicalKey)),
      chordsOnly: true,
    };
  }

  if (isScalesMode && isChordalScalePlaybackMode(scalePlaybackMode)) {
    return {
      groups: getColorLegendGroupsForIds(ChordSetUtils.triadTypesForKey(selectedMusicalKey)),
      chordsOnly: true,
    };
  }

  if (isScalesMode && scalePlaybackMode === ScalePlaybackMode.DronedSingleNote) {
    const intervalIds = getIntervalTypesForScaleFromRoot(selectedMusicalKey);
    return {
      groups: getColorLegendGroupsForIds(intervalIds),
      chordsOnly: false,
    };
  }

  if (isScalesMode && scalePlaybackMode === ScalePlaybackMode.SingleNote) {
    return {
      groups: [],
      chordsOnly: true,
    };
  }

  // Harmony mode: the legend explains the preset buttons, so it mirrors them exactly - and
  // stays empty in the modes that offer no presets, where there would be nothing to explain.
  if (harmonyInputMode === HarmonyInputMode.ChordPresets) {
    return {
      groups: getJoinedColorLegendGroupsForIds(
        new Set(NoteGroupingLibrary.getVisiblePresetIds(false)),
      ),
      chordsOnly: true,
    };
  }

  if (harmonyInputMode === HarmonyInputMode.IntervalPresets) {
    return {
      groups: getJoinedColorLegendGroupsForIds(
        new Set(NoteGroupingLibrary.getVisiblePresetIds(true)),
      ),
      chordsOnly: false,
    };
  }

  return { groups: [], chordsOnly: true };
}
