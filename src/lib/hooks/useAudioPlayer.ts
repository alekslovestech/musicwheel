"use client";

import { useCallback, useEffect, useRef } from "react";

import { PlaybackState, useAudio } from "@/contexts/AudioContext";
import { useMusical } from "@/contexts/MusicalContext";
import { ensureToneContextRunning, playNotesNow } from "@/lib/audio/audioEngine";
import { resolveClickProfile } from "@/lib/audio/playbackProfiles";
import { useIsScalePreviewMode } from "@/lib/hooks/useGlobalMode";
import { ActualIndex } from "@/types/IndexTypes";

export function useAudioPlayer() {
  const { isAudioInitialized, playbackState, pauseSequencePlayback } = useAudio();
  const { selectedNoteIndices } = useMusical();

  usePauseSequenceOnHide(playbackState, pauseSequencePlayback);
  const { playSelectedNotes } = useNotePlayback(selectedNoteIndices, isAudioInitialized);

  return {
    playSelectedNotes,
    isAudioInitialized,
  };
}

// The engine silences voices when the page hides; a running sequence also needs pausing.
function usePauseSequenceOnHide(playbackState: PlaybackState, pauseSequencePlayback: () => void) {
  const playbackStateRef = useRef(playbackState);
  playbackStateRef.current = playbackState;

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && playbackStateRef.current === PlaybackState.SequencePlaying) {
        pauseSequencePlayback();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [pauseSequencePlayback]);
}

function useNotePlayback(selectedNoteIndices: ActualIndex[], isAudioInitialized: boolean) {
  const isScalesMode = useIsScalePreviewMode();
  const { playbackState, scalePlaybackMode } = useAudio();

  const playSelectedNotes = useCallback(async () => {
    if (!isAudioInitialized) return;

    const running = await ensureToneContextRunning();
    if (!running) return;

    const isScaleClick = isScalesMode && playbackState !== PlaybackState.SequencePlaying;
    const profile = resolveClickProfile(scalePlaybackMode, isScaleClick);

    // An empty selection means nothing is highlighted, not "cut the sound": releasing here would
    // clip the last note of every sequence, which ends by clearing the selection. Deliberate
    // stops go through releaseSequenceVoicesNow instead.
    if (selectedNoteIndices.length === 0) return;

    playNotesNow(selectedNoteIndices, profile.durationSec, profile.envelope);
  }, [selectedNoteIndices, isAudioInitialized, isScalesMode, playbackState, scalePlaybackMode]);

  useEffect(() => {
    // During a sequence the scheduler has already queued these notes on the audio clock; playing
    // them again off the render that displays them is exactly the coupling this avoids.
    if (playbackState === PlaybackState.SequencePlaying) return;
    void playSelectedNotes();
  }, [selectedNoteIndices, playSelectedNotes, playbackState]);

  return { playSelectedNotes };
}
