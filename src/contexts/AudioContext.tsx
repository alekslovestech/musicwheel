"use client";

import React, { createContext, useContext, useState } from "react";
import { ScalePlaybackMode } from "@/types/enums/ScalePlaybackMode";
import { ChordProgressionType } from "@/types/enums/ChordProgressionType";

import { useSequencePlayback } from "@/lib/hooks/useSequencePlayback";
import type { StartSequencePlaybackOptions } from "@/lib/hooks/useSequencePlayback";

export enum PlaybackState {
  SequenceComplete,
  SequencePlaying,
  SequencePaused,
}

interface AudioContextType {
  isAudioInitialized: boolean;
  playbackState: PlaybackState;
  setAudioInitialized: (initialized: boolean) => void;

  // Unified sequence playback
  startSequencePlayback: (options?: StartSequencePlaybackOptions) => void;
  pauseSequencePlayback: () => void;
  resumeSequencePlayback: () => void;
  stopSequencePlayback: () => void;

  // Scale-specific
  scalePlaybackMode: ScalePlaybackMode;
  setScalePlaybackMode: (mode: ScalePlaybackMode) => void;

  // Chord progression-specific
  selectedProgression: ChordProgressionType | null;
  /** `tonicOverride` restores a specific tonic instead of the progression's suggested key -
   * used by the URL sync hook when a deep link names a transposed key. */
  setSelectedProgression: (progression: ChordProgressionType | null, tonicOverride?: string) => void;
  /** Index of the currently sounding step, for UI highlight (progression grid or scale staff).
   * Meaning depends on globalMode; null when playback isn't active in that mode. */
  activeStepIndex: number | null;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
};

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAudioInitialized, setIsAudioInitialized] = useState(false);
  const [playbackState, setPlaybackState] = useState<PlaybackState>(PlaybackState.SequenceComplete);

  const sequencePlayback = useSequencePlayback({
    isAudioInitialized,
    playbackState,
    setPlaybackState,
  });

  const value: AudioContextType = {
    isAudioInitialized,
    playbackState,
    setAudioInitialized: setIsAudioInitialized,
    ...sequencePlayback,
  };

  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>;
};
