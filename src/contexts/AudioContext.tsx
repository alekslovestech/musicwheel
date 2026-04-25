"use client";

import React, { createContext, useContext, useState } from "react";
import { ScalePlaybackMode } from "@/types/ScalePlaybackMode";
import { ChordProgressionType } from "@/types/enums/ChordProgressionType";

import { useSequencePlayback } from "@/lib/hooks/useSequencePlayback";

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
  startSequencePlayback: () => void;
  pauseSequencePlayback: () => void;
  resumeSequencePlayback: () => void;
  stopSequencePlayback: () => void;

  // Scale-specific
  scalePlaybackMode: ScalePlaybackMode;
  setScalePlaybackMode: (mode: ScalePlaybackMode) => void;

  // Chord progression-specific
  selectedProgression: ChordProgressionType | null;
  setSelectedProgression: (progression: ChordProgressionType | null) => void;
  /** Current chord step for progression UI highlight; null when not applicable. */
  activeProgressionStepIndex: number | null;

  // Legacy aliases (to be removed after full migration)
  startScalePlayback: () => void;
  pauseScalePlayback: () => void;
  resumeScalePlayback: () => void;
  stopScalePlayback: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
};

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAudioInitialized, setIsAudioInitialized] = useState(false);
  const [playbackState, setPlaybackState] = useState<PlaybackState>(
    PlaybackState.SequenceComplete
  );

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

  return (
    <AudioContext.Provider value={value}>{children}</AudioContext.Provider>
  );
};
