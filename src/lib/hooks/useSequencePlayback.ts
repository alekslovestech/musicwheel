"use client";

import { useCallback, useEffect, useState } from "react";
import { ChordProgressionType } from "@/types/enums/ChordProgressionType";
import { GlobalMode } from "@/types/enums/GlobalMode";

import { ScalePlaybackMode } from "@/types/enums/ScalePlaybackMode";

import { PlaybackState } from "@/contexts/AudioContext";
import { useMusical } from "@/contexts/MusicalContext";
import { useGlobalMode } from "@/lib/hooks/useGlobalMode";
import { releaseSequenceVoicesNow } from "@/lib/audio/sequenceVoiceBridge";
import {
  pauseScheduledSequence,
  resumeScheduledSequence,
  startScheduledSequence,
  stopScheduledSequence,
} from "@/lib/audio/sequenceScheduler";
import {
  buildProgressionSchedule,
  buildScaleSchedule,
  type SequenceStepVisual,
} from "@/lib/audio/sequenceSchedules";
import { prepareChordProgressionSequence } from "@/utils/SequencePlaybackUtils";
import { MusicalKey } from "@/types/Keys/MusicalKey";
import { suggestedKeyForProgression } from "@/utils/slug/progressionSelection";

interface UseSequencePlaybackProps {
  isAudioInitialized: boolean;
  playbackState: PlaybackState;
  setPlaybackState: (state: PlaybackState) => void;
}

export type StartSequencePlaybackOptions = {
  scalePlaybackMode?: ScalePlaybackMode;
};

/**
 * Owns what plays and when, but not the playing: a run is laid out as a schedule and handed to
 * the Web Audio clock in one go (see sequenceScheduler). The callbacks below are the UI half of
 * each step, invoked on the draw loop just ahead of the note they belong to - so a slow render
 * can arrive late without dragging the note along with it.
 */
export const useSequencePlayback = ({
  isAudioInitialized,
  playbackState,
  setPlaybackState,
}: UseSequencePlaybackProps) => {
  const {
    selectedMusicalKey,
    setSelectedMusicalKey,
    setNotesDirectly,
    setSelectionFromSequence,
    setCurrentChordRef,
    clearNotes,
  } = useMusical();
  const globalMode = useGlobalMode();

  const [scalePlaybackMode, setScalePlaybackMode] = useState<ScalePlaybackMode>(
    ScalePlaybackMode.SingleNote,
  );
  const [selectedProgression, setSelectedProgressionState] = useState<ChordProgressionType | null>(
    null,
  );
  /**
   * Switching progressions lands on that progression's own key - the key its chords were written
   * against - unless `tonicOverride` says otherwise (the URL sync hook uses this to restore a
   * tonic from a deep link instead of the progression's default).
   */
  const setSelectedProgression = useCallback(
    (progression: ChordProgressionType | null, tonicOverride?: string) => {
      setSelectedProgressionState(progression);
      if (progression == null) return;

      const suggestedKey = suggestedKeyForProgression(progression);
      setSelectedMusicalKey(
        tonicOverride == null
          ? suggestedKey
          : MusicalKey.fromClassicalMode(tonicOverride, suggestedKey.classicalMode),
      );
    },
    [setSelectedMusicalKey],
  );
  /** Index of the currently sounding step, for UI highlight (progression grid or scale staff).
   * Meaning depends on globalMode; null when playback isn't active in that mode. */
  const [activeStepIndex, setActiveStepIndex] = useState<number | null>(null);

  const clearSequenceSelection = useCallback(() => {
    setCurrentChordRef(undefined);
    clearNotes();
  }, [setCurrentChordRef, clearNotes]);

  const handleSequenceComplete = useCallback(() => {
    stopScheduledSequence();
    setPlaybackState(PlaybackState.SequenceComplete);
    setActiveStepIndex(null);
    clearSequenceSelection();
  }, [setPlaybackState, clearSequenceSelection]);

  const showScaleStep = useCallback<SequenceStepVisual>(
    (stepIndex, notes, chordRef) => {
      setActiveStepIndex(stepIndex);
      setSelectionFromSequence(notes, chordRef);
    },
    [setSelectionFromSequence],
  );

  const showProgressionStep = useCallback<SequenceStepVisual>(
    (stepIndex, notes) => {
      setActiveStepIndex(stepIndex);
      setNotesDirectly(notes);
    },
    [setNotesDirectly],
  );

  const startScalePlayback = useCallback(
    (modeOverride?: ScalePlaybackMode) => {
      if (!selectedMusicalKey || !isAudioInitialized) return;
      const mode = modeOverride ?? scalePlaybackMode;

      stopScheduledSequence();
      releaseSequenceVoicesNow();
      setActiveStepIndex(null);
      clearSequenceSelection();
      setPlaybackState(PlaybackState.SequencePlaying);

      startScheduledSequence(
        buildScaleSchedule(selectedMusicalKey, mode, showScaleStep, handleSequenceComplete),
      );
    },
    [
      selectedMusicalKey,
      isAudioInitialized,
      scalePlaybackMode,
      clearSequenceSelection,
      setPlaybackState,
      showScaleStep,
      handleSequenceComplete,
    ],
  );

  const startChordProgressionPlayback = useCallback(() => {
    if (!selectedProgression || !selectedMusicalKey) return;

    const prepared = prepareChordProgressionSequence(selectedProgression, selectedMusicalKey);

    stopScheduledSequence();
    releaseSequenceVoicesNow();
    setActiveStepIndex(null);
    setPlaybackState(PlaybackState.SequencePlaying);

    startScheduledSequence(
      buildProgressionSchedule(prepared, showProgressionStep, handleSequenceComplete),
    );
  }, [
    selectedProgression,
    selectedMusicalKey,
    setPlaybackState,
    showProgressionStep,
    handleSequenceComplete,
  ]);

  const startSequencePlayback = useCallback(
    (options?: StartSequencePlaybackOptions) => {
      if (globalMode === GlobalMode.Scales) {
        startScalePlayback(options?.scalePlaybackMode);
      } else if (globalMode === GlobalMode.ChordProgressions) {
        startChordProgressionPlayback();
      }
    },
    [globalMode, startScalePlayback, startChordProgressionPlayback],
  );

  const pauseSequencePlayback = useCallback(() => {
    if (playbackState !== PlaybackState.SequencePlaying) return;
    // Notes already inside the scheduler's lookahead window are committed to the audio graph and
    // will still sound; the alternative, cutting them off, is the more jarring of the two.
    pauseScheduledSequence();
    setPlaybackState(PlaybackState.SequencePaused);
  }, [playbackState, setPlaybackState]);

  const resumeSequencePlayback = useCallback(() => {
    if (playbackState !== PlaybackState.SequencePaused) return;
    resumeScheduledSequence();
    setPlaybackState(PlaybackState.SequencePlaying);
  }, [playbackState, setPlaybackState]);

  const stopSequencePlayback = useCallback(() => {
    stopScheduledSequence();
    releaseSequenceVoicesNow();
    setActiveStepIndex(null);
    clearSequenceSelection();
    setPlaybackState(PlaybackState.SequenceComplete);
  }, [clearSequenceSelection, setPlaybackState]);

  /** The Transport outlives this hook, so an unmount mid-run would otherwise keep playing. */
  useEffect(() => stopScheduledSequence, []);

  useEffect(() => {
    if (selectedProgression == null) {
      setActiveStepIndex(null);
    }
  }, [selectedProgression]);

  /** Switching modes always invalidates whichever step index was active. */
  useEffect(() => {
    setActiveStepIndex(null);
  }, [globalMode]);

  return {
    // Unified interface
    startSequencePlayback,
    pauseSequencePlayback,
    resumeSequencePlayback,
    stopSequencePlayback,

    // Scale-specific
    scalePlaybackMode,
    setScalePlaybackMode,

    // Chord progression-specific
    selectedProgression,
    setSelectedProgression,
    activeStepIndex,
  };
};
