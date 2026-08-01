"use client";

import {
  ColorLegendGroup,
  getColorLegendGroups,
  getColorLegendGroupsForIds,
} from "@/utils/visual/colorLegendGroups";
import { ChordSetUtils } from "@/utils/ChordSetUtils";
import { getIntervalTypesForScaleFromRoot } from "@/utils/visual/scaleRibbonUtils";
import { useAudio } from "@/contexts/AudioContext";
import { useMusical } from "@/contexts/MusicalContext";
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

  if (isProgressionsMode && selectedProgression != null) {
    const progression = ChordProgressionLibrary.getProgression(selectedProgression);
    const chordTypes = ChordSetUtils.distinctFromProgression(progression);
    return {
      groups: getColorLegendGroupsForIds(chordTypes),
      chordsOnly: true,
    };
  }

  // Triad and Seventh both scope the legend to the chord qualities this key actually contains.
  if (isScalesMode && isChordalScalePlaybackMode(scalePlaybackMode)) {
    const chordTypes =
      scalePlaybackMode === ScalePlaybackMode.Seventh
        ? ChordSetUtils.seventhTypesForKey(selectedMusicalKey)
        : ChordSetUtils.triadTypesForKey(selectedMusicalKey);
    return {
      groups: getColorLegendGroupsForIds(chordTypes),
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

  return {
    groups: getColorLegendGroups(),
    chordsOnly: false,
  };
}
