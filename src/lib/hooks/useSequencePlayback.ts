"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChordProgressionType } from "@/types/enums/ChordProgressionType";
import { GlobalMode } from "@/types/enums/GlobalMode";

import { ScalePlaybackMode } from "@/types/enums/ScalePlaybackMode";

import { PlaybackState } from "@/contexts/AudioContext";
import { useMusical } from "@/contexts/MusicalContext";
import { useGlobalMode } from "@/lib/hooks/useGlobalMode";
import { releasePolySynthVoicesNow } from "@/lib/audio/polySynthVoiceBridge";
import {
  advanceScaleSequenceStep,
  ScaleSequenceStepKind,
  prepareChordProgressionSequence,
  type PreparedChordStep,
} from "@/utils/SequencePlaybackUtils";
import { RhythmUtils } from "@/utils/RhythmUtils";
import {
  SCALE_AUDIO_WARMUP_MS,
  SCALE_STEP_MS_SINGLE_NOTE,
  SCALE_STEP_MS_TRIAD,
} from "@/lib/audio/playbackDurations";

interface UseSequencePlaybackProps {
  isAudioInitialized: boolean;
  playbackState: PlaybackState;
  setPlaybackState: (state: PlaybackState) => void;
}

export type StartSequencePlaybackOptions = {
  scalePlaybackMode?: ScalePlaybackMode;
};

export const useSequencePlayback = ({
  isAudioInitialized,
  playbackState,
  setPlaybackState,
}: UseSequencePlaybackProps) => {
  const { selectedMusicalKey, setNotesDirectly, setCurrentChordRef, clearNotes } = useMusical();
  const globalMode = useGlobalMode();

  // Scale-specific state
  const [scalePlaybackMode, setScalePlaybackMode] = useState<ScalePlaybackMode>(
    ScalePlaybackMode.SingleNote,
  );
  const scaleIndexRef = useRef<number>(0);
  const sequenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const completionTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Chord progression-specific state
  const [selectedProgression, setSelectedProgression] = useState<ChordProgressionType | null>(null);
  const chordIndexRef = useRef<number>(0);
  const preparedProgressionStepsRef = useRef<PreparedChordStep[] | null>(null);
  const chordProgressionTempoRef = useRef<number | null>(null);
  /** Bumped when starting/stopping chord playback so stale setTimeouts no-op. */
  const chordPlaybackGenerationRef = useRef(0);
  /** Index into progression steps for grid highlight; null when not in chord playback context. */
  const [activeProgressionStepIndex, setActiveProgressionStepIndex] = useState<number | null>(null);

  // Helper functions - define these first
  const stopAllTimers = useCallback(() => {
    if (sequenceTimerRef.current !== null) {
      clearTimeout(sequenceTimerRef.current);
      sequenceTimerRef.current = null;
    }
    if (completionTimerRef.current !== null) {
      clearTimeout(completionTimerRef.current);
      completionTimerRef.current = null;
    }
  }, []);

  const getPlaybackDuration = useCallback((mode: ScalePlaybackMode) => {
    return mode === ScalePlaybackMode.SingleNote ? SCALE_STEP_MS_SINGLE_NOTE : SCALE_STEP_MS_TRIAD;
  }, []);

  const clearSequenceSelection = useCallback(() => {
    setCurrentChordRef(undefined);
    clearNotes();
  }, [setCurrentChordRef, clearNotes]);

  const abortPlayback = useCallback(
    ({ clearSelection = false, releaseVoices = false } = {}) => {
      stopAllTimers();
      if (releaseVoices) {
        chordPlaybackGenerationRef.current += 1;
        releasePolySynthVoicesNow();
      }
      if (clearSelection) {
        clearSequenceSelection();
      }
    },
    [stopAllTimers, clearSequenceSelection],
  );

  /** After the final step plays for one interval, mark complete and clear selection. */
  const scheduleSequenceCompletion = useCallback(
    (delayMs: number) => {
      if (completionTimerRef.current !== null) {
        clearTimeout(completionTimerRef.current);
      }
      completionTimerRef.current = setTimeout(() => {
        completionTimerRef.current = null;
        setPlaybackState(PlaybackState.SequenceComplete);
        clearSequenceSelection();
      }, delayMs);
    },
    [setPlaybackState, clearSequenceSelection],
  );

  // Step functions - define these before the start functions
  const playScaleStep = useCallback(
    (modeOverride?: ScalePlaybackMode) => {
      if (!selectedMusicalKey) return;

      const mode = modeOverride ?? scalePlaybackMode;
      const sequenceStep = advanceScaleSequenceStep(
        selectedMusicalKey,
        scaleIndexRef.current,
        mode,
      );

      if (sequenceStep.kind === ScaleSequenceStepKind.Idle) return;

      const { notesToPlay, chordRef } = sequenceStep.step;
      if (chordRef !== undefined) {
        setCurrentChordRef(chordRef);
      } else {
        setCurrentChordRef(undefined);
        setNotesDirectly(notesToPlay);
      }

      if (sequenceStep.kind === ScaleSequenceStepKind.PlayFinal) {
        stopAllTimers();
        scheduleSequenceCompletion(getPlaybackDuration(mode));
        return;
      }

      scaleIndexRef.current = sequenceStep.nextStepIndex;
    },
    [
      selectedMusicalKey,
      scalePlaybackMode,
      setNotesDirectly,
      setCurrentChordRef,
      stopAllTimers,
      scheduleSequenceCompletion,
      getPlaybackDuration,
    ],
  );

  const playProgressionStep = useCallback(() => {
    const steps = preparedProgressionStepsRef.current;
    const tempo = chordProgressionTempoRef.current;
    if (!steps?.length || tempo == null) return;

    const i = chordIndexRef.current;
    const step = steps[i];
    setActiveProgressionStepIndex(i);
    setNotesDirectly(step.value);

    const isLastChord = i === steps.length - 1;
    if (isLastChord) {
      stopAllTimers();
      scheduleSequenceCompletion(
        RhythmUtils.chordDurationMs(tempo, step.noteLength, step.rhythmDots),
      );
      return;
    }

    chordIndexRef.current = i + 1;
    const delayAfterThisChord = RhythmUtils.chordDurationMs(
      tempo,
      step.noteLength,
      step.rhythmDots,
    );
    stopAllTimers();
    const generationWhenScheduled = chordPlaybackGenerationRef.current;
    sequenceTimerRef.current = setTimeout(() => {
      if (chordPlaybackGenerationRef.current !== generationWhenScheduled) return;
      playProgressionStep();
    }, delayAfterThisChord);
  }, [setNotesDirectly, stopAllTimers, scheduleSequenceCompletion]);

  const resumeCurrentPlayback = useCallback(() => {
    const playbackDuration = getPlaybackDuration(scalePlaybackMode);
    if (globalMode === GlobalMode.Scales) {
      sequenceTimerRef.current = setInterval(() => playScaleStep(), playbackDuration);
    } else if (globalMode === GlobalMode.ChordProgressions) {
      const steps = preparedProgressionStepsRef.current;
      const tempo = chordProgressionTempoRef.current;
      const nextIndex = chordIndexRef.current;
      const previousStep = nextIndex > 0 ? steps?.[nextIndex - 1] : undefined;
      const delayBeforeNextChord =
        previousStep != null && tempo != null
          ? RhythmUtils.chordDurationMs(
              tempo,
              previousStep.noteLength,
              previousStep.rhythmDots,
            )
          : 0;
      const generationWhenScheduled = chordPlaybackGenerationRef.current;
      sequenceTimerRef.current = setTimeout(() => {
        if (chordPlaybackGenerationRef.current !== generationWhenScheduled) return;
        playProgressionStep();
      }, delayBeforeNextChord);
    }
    setPlaybackState(PlaybackState.SequencePlaying);
  }, [
    globalMode,
    playScaleStep,
    playProgressionStep,
    setPlaybackState,
    scalePlaybackMode,
    getPlaybackDuration,
  ]);

  // Start functions - define these after step functions
  const startScalePlayback = useCallback(
    (modeOverride?: ScalePlaybackMode) => {
      if (!selectedMusicalKey || !isAudioInitialized) return;

      const mode = modeOverride ?? scalePlaybackMode;

      abortPlayback({ clearSelection: true });
      setActiveProgressionStepIndex(null);
      scaleIndexRef.current = 0;
      setPlaybackState(PlaybackState.SequencePlaying);

      const playbackDuration = getPlaybackDuration(mode);
      sequenceTimerRef.current = setTimeout(() => {
        playScaleStep(mode);
        sequenceTimerRef.current = setInterval(() => playScaleStep(), playbackDuration);
      }, SCALE_AUDIO_WARMUP_MS);
    },
    [
      selectedMusicalKey,
      isAudioInitialized,
      setPlaybackState,
      playScaleStep,
      scalePlaybackMode,
      getPlaybackDuration,
      abortPlayback,
    ],
  );

  const startChordProgressionPlayback = useCallback(() => {
    if (!selectedProgression || !selectedMusicalKey) return;

    const prepared = prepareChordProgressionSequence(selectedProgression, selectedMusicalKey);
    preparedProgressionStepsRef.current = prepared.steps;
    chordProgressionTempoRef.current = prepared.tempo;

    abortPlayback({ releaseVoices: true });
    chordIndexRef.current = 0;
    playProgressionStep();
    setPlaybackState(PlaybackState.SequencePlaying);
  }, [
    selectedProgression,
    selectedMusicalKey,
    setPlaybackState,
    playProgressionStep,
    abortPlayback,
  ]);

  // Unified playback functions - define these last
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
    if (playbackState === PlaybackState.SequencePlaying) {
      stopAllTimers();
      setPlaybackState(PlaybackState.SequencePaused);
    }
  }, [playbackState, stopAllTimers, setPlaybackState]);

  const resumeSequencePlayback = useCallback(() => {
    if (playbackState === PlaybackState.SequencePaused) {
      resumeCurrentPlayback();
    }
  }, [playbackState, resumeCurrentPlayback]);

  const stopSequencePlayback = useCallback(() => {
    abortPlayback({ clearSelection: true, releaseVoices: true });
    setActiveProgressionStepIndex(null);
    setPlaybackState(PlaybackState.SequenceComplete);
  }, [abortPlayback, setPlaybackState]);

  useEffect(() => {
    if (selectedProgression == null) {
      setActiveProgressionStepIndex(null);
    }
  }, [selectedProgression]);

  useEffect(() => {
    if (globalMode !== GlobalMode.ChordProgressions) {
      setActiveProgressionStepIndex(null);
    }
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
    activeProgressionStepIndex,
  };
};
