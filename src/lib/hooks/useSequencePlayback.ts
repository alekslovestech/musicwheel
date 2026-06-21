"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChordProgressionType } from "@/types/enums/ChordProgressionType";
import { GlobalMode } from "@/types/enums/GlobalMode";

import { NoteIndices } from "@/types/IndexTypes";
import { ScalePlaybackMode } from "@/types/enums/ScalePlaybackMode";

import { PlaybackState } from "@/contexts/AudioContext";
import { useMusical } from "@/contexts/MusicalContext";
import { useGlobalMode } from "@/lib/hooks/useGlobalMode";
import type { NoteLength } from "@/types/Durated";
import { releasePolySynthVoicesNow } from "@/lib/audio/polySynthVoiceBridge";
import {
  computeScalePlaybackStep,
  prepareChordProgressionSequence,
} from "@/utils/SequencePlaybackUtils";
import { RhythmUtils } from "@/utils/RhythmUtils";
import {
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
  const precomputedProgressionRef = useRef<NoteIndices[] | null>(null);
  const chordStepNoteLengthsRef = useRef<NoteLength[] | null>(null);
  const chordStepRhythmDotsRef = useRef<number[] | null>(null);
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
    return mode === ScalePlaybackMode.SingleNote
      ? SCALE_STEP_MS_SINGLE_NOTE
      : SCALE_STEP_MS_TRIAD;
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
      const step = computeScalePlaybackStep(
        selectedMusicalKey,
        scaleIndexRef.current,
        mode,
      );

      if (step.chordRef !== undefined) {
        setCurrentChordRef(step.chordRef);
      } else {
        setCurrentChordRef(undefined);
        if (step.notesToPlay !== null) {
          setNotesDirectly(step.notesToPlay);
        }
      }

      if (step.shouldEndSequence) {
        stopAllTimers();
        scheduleSequenceCompletion(getPlaybackDuration(mode));
        return;
      }

      if (step.nextIndex !== null) {
        scaleIndexRef.current = step.nextIndex;
      }
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
    const precomputed = precomputedProgressionRef.current;
    const stepNoteLengths = chordStepNoteLengthsRef.current;
    const stepRhythmDots = chordStepRhythmDotsRef.current;
    const tempo = chordProgressionTempoRef.current;
    if (
      !precomputed?.length ||
      !stepNoteLengths?.length ||
      !stepRhythmDots?.length ||
      tempo == null
    )
      return;

    const i = chordIndexRef.current;
    setActiveProgressionStepIndex(i);
    setNotesDirectly(precomputed[i]);

    const isLastChord = i === precomputed.length - 1;
    if (isLastChord) {
      stopAllTimers();
      scheduleSequenceCompletion(
        RhythmUtils.chordDurationMs(tempo, stepNoteLengths[i], stepRhythmDots[i]),
      );
      return;
    }

    chordIndexRef.current = i + 1;
    const delayAfterThisChord = RhythmUtils.chordDurationMs(
      tempo,
      stepNoteLengths[i],
      stepRhythmDots[i],
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
      const stepNoteLengths = chordStepNoteLengthsRef.current;
      const stepRhythmDots = chordStepRhythmDotsRef.current;
      const tempo = chordProgressionTempoRef.current;
      const nextIndex = chordIndexRef.current;
      const delayBeforeNextChord =
        nextIndex > 0 &&
        stepNoteLengths != null &&
        stepNoteLengths.length > 0 &&
        stepRhythmDots != null &&
        stepRhythmDots.length > 0 &&
        tempo != null
          ? RhythmUtils.chordDurationMs(
              tempo,
              stepNoteLengths[nextIndex - 1],
              stepRhythmDots[nextIndex - 1],
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
      playScaleStep(mode);
      const playbackDuration = getPlaybackDuration(mode);
      sequenceTimerRef.current = setInterval(() => playScaleStep(), playbackDuration);
      setPlaybackState(PlaybackState.SequencePlaying);
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
    precomputedProgressionRef.current = prepared.precomputedProgression;
    chordStepNoteLengthsRef.current = prepared.chordStepNoteLengths;
    chordStepRhythmDotsRef.current = prepared.chordStepRhythmDots;
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
