"use client";

import {
  ColorLegendGroup,
  getColorLegendGroups,
  getColorLegendGroupsForIds,
} from "@/utils/visual/colorLegendGroups";
import {
  getDistinctChordTypesFromProgression,
  getTriadChordTypesForKey,
} from "@/utils/chordTypeSets";
import { useAudio } from "@/contexts/AudioContext";
import { useMusical } from "@/contexts/MusicalContext";
import { useIsChordProgressionsMode, useIsScalePreviewMode } from "@/lib/hooks/useGlobalMode";
import { ChordProgressionLibrary } from "@/types/ChordProgressions/ChordProgressionLibrary";
import { ScalePlaybackMode } from "@/types/ScalePlaybackMode";

export function useColorLegendGroups(): {
  groups: ColorLegendGroup[];
  chordsOnly: boolean;
} {
  const isProgressionsMode = useIsChordProgressionsMode();
  const isScalesMode = useIsScalePreviewMode();
  const { selectedProgression, scalePlaybackMode } = useAudio();
  const { selectedMusicalKey } = useMusical();

  if (isProgressionsMode && selectedProgression != null) {
    const progression = ChordProgressionLibrary.getProgression(selectedProgression);
    const chordTypes = getDistinctChordTypesFromProgression(progression);
    return {
      groups: getColorLegendGroupsForIds(chordTypes),
      chordsOnly: true,
    };
  }

  if (isScalesMode && scalePlaybackMode === ScalePlaybackMode.Triad) {
    const chordTypes = getTriadChordTypesForKey(selectedMusicalKey);
    return {
      groups: getColorLegendGroupsForIds(chordTypes),
      chordsOnly: true,
    };
  }

  return {
    groups: getColorLegendGroups(),
    chordsOnly: false,
  };
}
