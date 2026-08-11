"use client";

import { useCallback, useEffect, useRef, type MutableRefObject, type RefObject } from "react";
import * as Tone from "tone";

import { PlaybackState, useAudio } from "@/contexts/AudioContext";
import { useMusical } from "@/contexts/MusicalContext";
import { frequencyFromIndex } from "@/lib/audio/toneFrequency";
import { setSequenceSynth } from "@/lib/audio/polySynthVoiceBridge";
import { INTERACTIVE_LOOKAHEAD_SEC, setLookAhead } from "@/lib/audio/sequenceScheduler";
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
  const { playSelectedNotes } = useNotePlayback(synthRef, selectedNoteIndices, isAudioInitialized);

  return {
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
    // The sequence scheduler owns this while a run is in flight and restores it on stop, so this
    // only ever applies to a cold start. It used to be the sole assignment, which meant it never
    // applied at all once the context was already running.
    setLookAhead(INTERACTIVE_LOOKAHEAD_SEC);
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
    setSequenceSynth({
      releaseAll: () => synthRef.current?.releaseAll(),
      setEnvelope: (envelope) => synthRef.current?.set({ envelope }),
      triggerNotes: (indices, durationSec, time) => {
        if (indices.length === 0) return;
        // One triggerAttackRelease for the whole step, at the instant the scheduler named: the
        // notes of a chord must share an onset, and the onset must not be "whenever this ran".
        synthRef.current?.triggerAttackRelease(
          indices.map(frequencyFromIndex),
          durationSec,
          time,
        );
      },
    });
    return () => setSequenceSynth(null);
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

  const playSelectedNotes = useCallback(async () => {
    if (!synthRef.current || !isAudioInitialized) return;

    const running = await ensureToneContextRunning();
    if (!running || !synthRef.current) return;

    const isScaleClick = isScalesMode && playbackState !== PlaybackState.SequencePlaying;
    const profile = resolvePlaybackProfile(scalePlaybackMode, isScaleClick);

    // An empty selection means nothing is highlighted, not "cut the sound". Releasing here
    // clipped the last note of every sequence, which ends by clearing the selection. Deliberate
    // stops go through releasePolySynthVoicesNow instead.
    if (selectedNoteIndices.length === 0) return;

    synthRef.current.set({ envelope: profile.envelope });
    synthRef.current.releaseAll();

    // One clock instant for the whole selection. Awaiting each note in turn put every attack on
    // its own microtask, which spread the notes of a chord across several milliseconds.
    synthRef.current.triggerAttackRelease(
      selectedNoteIndices.map(frequencyFromIndex),
      profile.durationSec,
      Tone.now(),
    );
  }, [selectedNoteIndices, isAudioInitialized, isScalesMode, playbackState, scalePlaybackMode]);

  useEffect(() => {
    // During a sequence the scheduler has already queued these notes on the audio clock; playing
    // them again off the render that displays them is exactly the coupling this avoids.
    if (playbackState === PlaybackState.SequencePlaying) return;
    void playSelectedNotes();
  }, [selectedNoteIndices, playSelectedNotes, playbackState]);

  return { playSelectedNotes };
}
