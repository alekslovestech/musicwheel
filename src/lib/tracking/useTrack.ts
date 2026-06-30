"use client";

import { useCallback, useMemo } from "react";

import { useAudio } from "@/contexts/AudioContext";
import { useChordPresets } from "@/contexts/ChordPresetContext";
import { useMusical } from "@/contexts/MusicalContext";
import { useGlobalMode } from "@/lib/hooks/useGlobalMode";

import { buildModeContext, track, TrackCtx } from "./track";

export function useTrack() {
  const globalMode = useGlobalMode();
  const { selectedMusicalKey } = useMusical();
  const { harmonyInputMode } = useChordPresets();
  const { selectedProgression, scalePlaybackMode } = useAudio();

  const modeContext = useMemo(
    () =>
      buildModeContext({
        globalMode,
        scaleType: selectedMusicalKey.scaleMode,
        scalePlaybackMode,
        harmonyInputMode,
        progressionType: selectedProgression,
      }),
    [globalMode, selectedMusicalKey.scaleMode, scalePlaybackMode, harmonyInputMode, selectedProgression],
  );

  return useCallback(
    (event: string, extras: TrackCtx = {}) => {
      track(event, { ...modeContext, ...extras });
    },
    [modeContext],
  );
}
