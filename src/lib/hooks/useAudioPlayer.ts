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
  const { isAudioInitialized, setAudioInitialized, playbackState, pauseSequencePlayback } =
    useAudio();
  const { selectedNoteIndices } = useMusical();

  useToneContextInit(setAudioInitialized);
  usePauseSequenceOnHide(playbackState, pauseSequencePlayback);
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

async function ensureToneContextRunning(): Promise<boolean> {
  try {
    const context = Tone.getContext();
    if (context.state === "running") {
      return true;
    }
    context.lookAhead = 0.05;
    await Tone.start();
    return Tone.getContext().state === "running";
  } catch (error) {
    console.error("Failed to resume audio context:", error);
    return false;
  }
}

function syncAudioInitialized(
  setAudioInitialized: (initialized: boolean) => void,
  running: boolean,
) {
  if (running) {
    setAudioInitialized(true);
  }
}

function resumeToneContextAndSync(setAudioInitialized: (initialized: boolean) => void) {
  if (Tone.getContext().state === "running") {
    syncAudioInitialized(setAudioInitialized, true);
    return;
  }
  void ensureToneContextRunning().then((running) =>
    syncAudioInitialized(setAudioInitialized, running),
  );
}

function useToneContextInit(setAudioInitialized: (initialized: boolean) => void) {
  useEffect(() => {
    if (Tone.getContext().state === "running") {
      setAudioInitialized(true);
    }

    const resumeFromUserGesture = () => {
      resumeToneContextAndSync(setAudioInitialized);
    };

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        resumeToneContextAndSync(setAudioInitialized);
      }
    };

    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        resumeToneContextAndSync(setAudioInitialized);
      }
    };

    const handleContextStateChange = () => {
      syncAudioInitialized(setAudioInitialized, Tone.getContext().state === "running");
    };

    const captureOptions: AddEventListenerOptions = { capture: true };

    document.addEventListener("click", resumeFromUserGesture, captureOptions);
    document.addEventListener("touchstart", resumeFromUserGesture, captureOptions);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("pageshow", handlePageShow);
    const rawContext = Tone.getContext().rawContext;
    rawContext?.addEventListener("statechange", handleContextStateChange);

    return () => {
      document.removeEventListener("click", resumeFromUserGesture, captureOptions);
      document.removeEventListener("touchstart", resumeFromUserGesture, captureOptions);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("pageshow", handlePageShow);
      rawContext?.removeEventListener("statechange", handleContextStateChange);
    };
  }, [setAudioInitialized]);
}

function usePauseSequenceOnHide(
  playbackState: PlaybackState,
  pauseSequencePlayback: () => void,
) {
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
    if (synthRef.current) return;

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
    async (index: ActualIndex, durationSec: number) => {
      if (!synthRef.current || !isAudioInitialized) return;

      const running = await ensureToneContextRunning();
      if (!running || !synthRef.current) return;

      try {
        synthRef.current.triggerAttackRelease(frequencyFromIndex(index), durationSec);
      } catch (error) {
        console.error("Failed to play note:", error);
      }
    },
    [isAudioInitialized],
  );

  const playSelectedNotes = useCallback(async () => {
    if (!synthRef.current || !isAudioInitialized) return;

    const running = await ensureToneContextRunning();
    if (!running || !synthRef.current) return;

    const isScaleClick = isScalesMode && playbackState !== PlaybackState.SequencePlaying;
    const profile = resolvePlaybackProfile(scalePlaybackMode, isScaleClick);

    synthRef.current.set({ envelope: profile.envelope });
    synthRef.current.releaseAll();
    for (const index of selectedNoteIndices) {
      await playNote(index, profile.durationSec);
    }
  }, [
    selectedNoteIndices,
    playNote,
    isAudioInitialized,
    isScalesMode,
    playbackState,
    scalePlaybackMode,
  ]);

  useEffect(() => {
    void playSelectedNotes();
  }, [selectedNoteIndices, playSelectedNotes]);

  return { playNote, playSelectedNotes };
}
