"use client";

import { useCallback, useEffect, useRef, type MutableRefObject, type RefObject } from "react";
import * as Tone from "tone";

import { useAudio } from "@/contexts/AudioContext";
import { useMusical } from "@/contexts/MusicalContext";
import { frequencyFromIndex } from "@/lib/audio/toneFrequency";
import { setPolySynthVoiceReleaser } from "@/lib/audio/polySynthVoiceBridge";
import { createPolySynth, noteDurationForDemoMode } from "@/lib/audio/toneSynthFactory";
import { useIsDemoRoute } from "@/lib/hooks/useGlobalMode";
import { ActualIndex } from "@/types/IndexTypes";

export function useAudioPlayer() {
  const synthRef = useRef<Tone.PolySynth | null>(null);
  const { isAudioInitialized, setAudioInitialized } = useAudio();
  const { selectedNoteIndices } = useMusical();
  const isDemoMode = useIsDemoRoute();

  useToneContextInit(setAudioInitialized);
  usePolySynthVoiceBridge(synthRef);
  usePolySynthLifecycle(synthRef, isAudioInitialized);
  const { playNote, playSelectedNotes } = useNotePlayback(
    synthRef,
    selectedNoteIndices,
    isAudioInitialized,
    isDemoMode,
  );
  useSynthReleaseOnUnmount(synthRef);

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
      synthRef.current = createPolySynth(false);
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
  isDemoMode: boolean,
) {
  const noteDuration = noteDurationForDemoMode(isDemoMode);

  const playNote = useCallback(
    (index: ActualIndex) => {
      if (!synthRef.current || !isAudioInitialized) return;

      try {
        synthRef.current.triggerAttackRelease(frequencyFromIndex(index), noteDuration);
      } catch (error) {
        console.error("Failed to play note:", error);
      }
    },
    [isAudioInitialized, noteDuration],
  );

  const playSelectedNotes = useCallback(() => {
    if (!synthRef.current || !isAudioInitialized) return;

    synthRef.current.releaseAll();
    selectedNoteIndices.forEach((index) => {
      playNote(index);
    });
  }, [selectedNoteIndices, playNote, isAudioInitialized]);

  useEffect(() => {
    playSelectedNotes();
  }, [selectedNoteIndices, playSelectedNotes]);

  return { playNote, playSelectedNotes };
}

function useSynthReleaseOnUnmount(synthRef: RefObject<Tone.PolySynth | null>) {
  useEffect(() => {
    return () => {
      if (synthRef.current) {
        synthRef.current.releaseAll();
      }
    };
  }, []);
}
