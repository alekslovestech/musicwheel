"use client";

import { useCallback, useEffect, useRef, type MutableRefObject, type RefObject } from "react";
import * as Tone from "tone";

import { PlaybackState, useAudio } from "@/contexts/AudioContext";
import { useMusical } from "@/contexts/MusicalContext";
import { frequencyFromIndex } from "@/lib/audio/toneFrequency";
import { setPolySynthVoiceReleaser } from "@/lib/audio/polySynthVoiceBridge";
import { resolvePlaybackProfile } from "@/lib/audio/playbackProfiles";
import { createPolySynth } from "@/lib/audio/toneSynthFactory";
import { useIsScalePreviewMode } from "@/lib/hooks/useGlobalMode";
import { ActualIndex } from "@/types/IndexTypes";

export function useAudioPlayer() {
  const synthRef = useRef<Tone.PolySynth | null>(null);
  const { isAudioInitialized, setAudioInitialized } = useAudio();
  const { selectedNoteIndices } = useMusical();

  useToneContextInit(setAudioInitialized);
  usePolySynthVoiceBridge(synthRef);
  usePolySynthLifecycle(synthRef, isAudioInitialized);
  const { playNote, playSelectedNotes } = useNotePlayback(
    synthRef,
    selectedNoteIndices,
    isAudioInitialized,
  );

  return {
    playNote,
    playSelectedNotes,
    isAudioInitialized,
  };
}

function useToneContextInit(setAudioInitialized: (initialized: boolean) => void) {
  useEffect(() => {
    const checkExistingAudio = async () => {
      if (Tone.getContext().state === "running") {
        setAudioInitialized(true);
        return;
      }

      const handleUserInteraction = async () => {
        try {
          if (Tone.getContext().state !== "running") {
            Tone.getContext().lookAhead = 0.05;
            await Tone.start();
            console.log("Tone.js context started");
          }
          setAudioInitialized(true);
          document.removeEventListener("click", handleUserInteraction);
          document.removeEventListener("touchstart", handleUserInteraction);
        } catch (error) {
          console.error("Failed to initialize audio:", error);
        }
      };

      document.addEventListener("click", handleUserInteraction);
      document.addEventListener("touchstart", handleUserInteraction);

      return () => {
        document.removeEventListener("click", handleUserInteraction);
        document.removeEventListener("touchstart", handleUserInteraction);
      };
    };

    checkExistingAudio();
  }, [setAudioInitialized]);
}

function usePolySynthVoiceBridge(synthRef: RefObject<Tone.PolySynth | null>) {
  useEffect(() => {
    setPolySynthVoiceReleaser(() => synthRef.current?.releaseAll());
    return () => setPolySynthVoiceReleaser(null);
  }, []);
}

function usePolySynthLifecycle(
  synthRef: MutableRefObject<Tone.PolySynth | null>,
  isAudioInitialized: boolean,
) {
  useEffect(() => {
    if (!isAudioInitialized) return;

    try {
      synthRef.current = createPolySynth();
    } catch (error) {
      console.error("Failed to initialize synth:", error);
    }

    return () => {
      if (synthRef.current) {
        synthRef.current.dispose();
        synthRef.current = null;
      }
    };
  }, [isAudioInitialized]);
}

function useNotePlayback(
  synthRef: RefObject<Tone.PolySynth | null>,
  selectedNoteIndices: ActualIndex[],
  isAudioInitialized: boolean,
) {
  const isScalesMode = useIsScalePreviewMode();
  const { playbackState, scalePlaybackMode } = useAudio();

  const playNote = useCallback(
    (index: ActualIndex, durationSec: number) => {
      if (!synthRef.current || !isAudioInitialized) return;

      try {
        synthRef.current.triggerAttackRelease(frequencyFromIndex(index), durationSec);
      } catch (error) {
        console.error("Failed to play note:", error);
      }
    },
    [isAudioInitialized],
  );

  const playSelectedNotes = useCallback(() => {
    if (!synthRef.current || !isAudioInitialized) return;

    const isScaleClick = isScalesMode && playbackState !== PlaybackState.SequencePlaying;
    const profile = resolvePlaybackProfile(scalePlaybackMode, isScaleClick);

    synthRef.current.set({ envelope: profile.envelope });
    synthRef.current.releaseAll();
    selectedNoteIndices.forEach((index) => {
      playNote(index, profile.durationSec);
    });
  }, [
    selectedNoteIndices,
    playNote,
    isAudioInitialized,
    isScalesMode,
    playbackState,
    scalePlaybackMode,
  ]);

  useEffect(() => {
    playSelectedNotes();
  }, [selectedNoteIndices, playSelectedNotes]);

  return { playNote, playSelectedNotes };
}
