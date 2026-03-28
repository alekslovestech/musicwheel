"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChordProgressionType } from "@/types/enums/ChordProgressionType";
import { GlobalMode } from "@/types/enums/GlobalMode";

import { NoteIndices } from "@/types/IndexTypes";
import { ScalePlaybackMode } from "@/types/ScalePlaybackMode";

import { PlaybackState } from "@/contexts/AudioContext";
import { useMusical } from "@/contexts/MusicalContext";
import { useGlobalMode } from "@/lib/hooks/useGlobalMode";
import {
  computeScalePlaybackStep,
  prepareChordProgressionSequence,
} from "@/lib/sequencePlaybackHelpers";

const PLAYBACK_DURATION_SCALE_SINGLE_NOTE = 300;
const PLAYBACK_DURATION_SCALE_TRIAD = 500;

interface UseSequencePlaybackProps {
  isAudioInitialized: boolean;
  playbackState: PlaybackState;
  setPlaybackState: (state: PlaybackState) => void;
}

export const useSequencePlayback = ({
  isAudioInitialized,
  playbackState,
  setPlaybackState,
}: UseSequencePlaybackProps) => {
  const { selectedMusicalKey, setNotesDirectly } = useMusical();
  const globalMode = useGlobalMode();

  // Scale-specific state
  const [scalePlaybackMode, setScalePlaybackMode] = useState<ScalePlaybackMode>(
    ScalePlaybackMode.SingleNote
  );
  const scaleIndexRef = useRef<number>(0);
  const sequenceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Chord progression-specific state
  const [selectedProgression, setSelectedProgression] =
    useState<ChordProgressionType | null>(null);
  const chordIndexRef = useRef<number>(0);
  const precomputedProgressionRef = useRef<NoteIndices[] | null>(null);
  const chordStepDurationsMsRef = useRef<number[] | null>(null);

  // Helper functions - define these first
  const stopCurrentPlayback = useCallback(() => {
    if (sequenceTimerRef.current !== null) {
      clearTimeout(sequenceTimerRef.current);
      sequenceTimerRef.current = null;
    }
  }, []);

  const pauseCurrentPlayback = useCallback(() => {
    stopCurrentPlayback();
    setPlaybackState(PlaybackState.SequencePaused);
  }, [stopCurrentPlayback, setPlaybackState]);

  // Step functions - define these before the start functions
  const playScaleStep = useCallback(() => {
    if (!selectedMusicalKey) return;

    const step = computeScalePlaybackStep(
      selectedMusicalKey,
      scaleIndexRef.current,
      scalePlaybackMode
    );

    if (step.notesToPlay !== null) {
      setNotesDirectly(step.notesToPlay);
    }

    if (step.shouldEndSequence) {
      setPlaybackState(PlaybackState.SequenceComplete);
      stopCurrentPlayback();
      return;
    }

    if (step.nextIndex !== null) {
      scaleIndexRef.current = step.nextIndex;
    }
  }, [
    selectedMusicalKey,
    scalePlaybackMode,
    setNotesDirectly,
    setPlaybackState,
    stopCurrentPlayback,
  ]);

  const playProgressionStep = useCallback(() => {
    const precomputed = precomputedProgressionRef.current;
    const durationsMs = chordStepDurationsMsRef.current;
    if (!precomputed?.length || !durationsMs?.length) return;

    const i = chordIndexRef.current;
    setNotesDirectly(precomputed[i]);

    const isLastChord = i === precomputed.length - 1;
    if (isLastChord) {
      setPlaybackState(PlaybackState.SequenceComplete);
      stopCurrentPlayback();
      return;
    }

    chordIndexRef.current = i + 1;
    const delayAfterThisChord = durationsMs[i];
    sequenceTimerRef.current = setTimeout(() => {
      playProgressionStep();
    }, delayAfterThisChord);
  }, [setNotesDirectly, setPlaybackState, stopCurrentPlayback]);

  const getPlaybackDuration = useCallback(
    (scalePlaybackMode: ScalePlaybackMode) => {
      return scalePlaybackMode === ScalePlaybackMode.SingleNote
        ? PLAYBACK_DURATION_SCALE_SINGLE_NOTE
        : PLAYBACK_DURATION_SCALE_TRIAD;
    },
    []
  );

  const resumeCurrentPlayback = useCallback(() => {
    const playbackDuration = getPlaybackDuration(scalePlaybackMode);
    if (globalMode === GlobalMode.Scales) {
      sequenceTimerRef.current = setInterval(
        () => playScaleStep(),
        playbackDuration
      );
    } else if (globalMode === GlobalMode.ChordProgressions) {
      const durationsMs = chordStepDurationsMsRef.current;
      const nextIndex = chordIndexRef.current;
      const delayBeforeNextChord =
        nextIndex > 0 && durationsMs != null && durationsMs.length > 0
          ? durationsMs[nextIndex - 1]
          : 0;
      sequenceTimerRef.current = setTimeout(() => {
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
  const startScalePlayback = useCallback(() => {
    if (!selectedMusicalKey || !isAudioInitialized) return;

    stopCurrentPlayback();
    scaleIndexRef.current = 0;
    playScaleStep();
    const playbackDuration = getPlaybackDuration(scalePlaybackMode);
    sequenceTimerRef.current = setInterval(
      () => playScaleStep(),
      playbackDuration
    );
    setPlaybackState(PlaybackState.SequencePlaying);
  }, [
    selectedMusicalKey,
    isAudioInitialized,
    setPlaybackState,
    playScaleStep,
    scalePlaybackMode,
    getPlaybackDuration,
    stopCurrentPlayback,
  ]);

  const startChordProgressionPlayback = useCallback(() => {
    if (!selectedProgression || !selectedMusicalKey) return;

    const prepared = prepareChordProgressionSequence(
      selectedProgression,
      selectedMusicalKey
    );
    precomputedProgressionRef.current = prepared.precomputedProgression;
    chordStepDurationsMsRef.current = prepared.chordStepDurationsMs;

    stopCurrentPlayback();
    chordIndexRef.current = 0;
    playProgressionStep();
    setPlaybackState(PlaybackState.SequencePlaying);
  }, [
    selectedProgression,
    selectedMusicalKey,
    setPlaybackState,
    playProgressionStep,
    stopCurrentPlayback,
  ]);

  // Chord progressions: auto-start playback when any menu selection changes
  useEffect(() => {
    if (!isAudioInitialized) return;
    if (globalMode !== GlobalMode.ChordProgressions) return;
    if (!selectedProgression || !selectedMusicalKey) return;
    startChordProgressionPlayback();
  }, [
    globalMode,
    isAudioInitialized,
    selectedProgression,
    selectedMusicalKey,
    startChordProgressionPlayback,
  ]);

  // Unified playback functions - define these last
  const startSequencePlayback = useCallback(() => {
    stopCurrentPlayback();
    if (globalMode === GlobalMode.Scales) {
      startScalePlayback();
    } else if (globalMode === GlobalMode.ChordProgressions) {
      startChordProgressionPlayback();
    }
  }, [
    globalMode,
    startScalePlayback,
    startChordProgressionPlayback,
    stopCurrentPlayback,
  ]);

  const pauseSequencePlayback = useCallback(() => {
    if (playbackState === PlaybackState.SequencePlaying) {
      pauseCurrentPlayback();
    }
  }, [playbackState, pauseCurrentPlayback]);

  const resumeSequencePlayback = useCallback(() => {
    if (playbackState === PlaybackState.SequencePaused) {
      resumeCurrentPlayback();
    }
  }, [playbackState, resumeCurrentPlayback]);

  const stopSequencePlayback = useCallback(() => {
    stopCurrentPlayback();
    setPlaybackState(PlaybackState.SequenceComplete);
  }, [stopCurrentPlayback, setPlaybackState]);

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

    // Legacy aliases for backward compatibility during transition
    startScalePlayback,
    pauseScalePlayback: pauseSequencePlayback,
    resumeScalePlayback: resumeSequencePlayback,
    stopScalePlayback: stopSequencePlayback,
  };
};
