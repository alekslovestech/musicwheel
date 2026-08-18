"use client";

import { useCallback, useEffect, useRef, type MutableRefObject, type RefObject } from "react";
import * as Tone from "tone";

import { PlaybackState, useAudio } from "@/contexts/AudioContext";
import { useMusical } from "@/contexts/MusicalContext";
import { setSequenceSynth } from "@/lib/audio/sequenceVoiceBridge";
import { INTERACTIVE_LOOKAHEAD_SEC, setLookAhead } from "@/lib/audio/sequenceScheduler";
import { resolveClickProfile } from "@/lib/audio/playbackProfiles";
import { VoicePool } from "@/lib/audio/voicePool";
import { useIsScalePreviewMode } from "@/lib/hooks/useGlobalMode";
import { ActualIndex } from "@/types/IndexTypes";

export function useAudioPlayer() {
  const poolRef = useRef<VoicePool | null>(null);
  const { isAudioInitialized, setAudioInitialized, playbackState, pauseSequencePlayback } =
    useAudio();
  const { selectedNoteIndices } = useMusical();

  useToneContextInit(setAudioInitialized);
  usePauseSequenceOnHide(playbackState, pauseSequencePlayback);
  useVoicePoolBridge(poolRef);
  useVoicePoolLifecycle(poolRef, isAudioInitialized);
  const { playSelectedNotes } = useNotePlayback(poolRef, selectedNoteIndices, isAudioInitialized);

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
    // only ever applies to a cold start.
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

function useVoicePoolBridge(poolRef: RefObject<VoicePool | null>) {
  useEffect(() => {
    setSequenceSynth({
      releaseAll: () => poolRef.current?.releaseAll(),
      setEnvelope: (envelope) => poolRef.current?.setEnvelope(envelope),
      triggerNotes: (indices, durationSec, time) => {
        if (indices.length === 0) return;
        // At the instant the scheduler named, not "whenever this ran": the notes of a chord must
        // share an onset, and the pool places both ends of each note on the clock up front.
        poolRef.current?.triggerNotes(indices, durationSec, time);
      },
    });
    return () => setSequenceSynth(null);
  }, []);
}

function useVoicePoolLifecycle(
  poolRef: MutableRefObject<VoicePool | null>,
  isAudioInitialized: boolean,
) {
  useEffect(() => {
    if (!isAudioInitialized) return;
    if (poolRef.current) return;

    try {
      // Every voice is built here, once, so that no step of a sequence ever pays for one.
      poolRef.current = new VoicePool();
    } catch (error) {
      console.error("Failed to initialize synth:", error);
    }

    return () => {
      if (poolRef.current) {
        poolRef.current.dispose();
        poolRef.current = null;
      }
    };
  }, [isAudioInitialized]);
}

function useNotePlayback(
  poolRef: RefObject<VoicePool | null>,
  selectedNoteIndices: ActualIndex[],
  isAudioInitialized: boolean,
) {
  const isScalesMode = useIsScalePreviewMode();
  const { playbackState, scalePlaybackMode } = useAudio();

  const playSelectedNotes = useCallback(async () => {
    if (!poolRef.current || !isAudioInitialized) return;

    const running = await ensureToneContextRunning();
    if (!running || !poolRef.current) return;

    const isScaleClick = isScalesMode && playbackState !== PlaybackState.SequencePlaying;
    const profile = resolveClickProfile(scalePlaybackMode, isScaleClick);

    // An empty selection means nothing is highlighted, not "cut the sound": releasing here would
    // clip the last note of every sequence, which ends by clearing the selection. Deliberate
    // stops go through releaseSequenceVoicesNow instead.
    if (selectedNoteIndices.length === 0) return;

    poolRef.current.setEnvelope(profile.envelope);
    poolRef.current.releaseAll();

    // One clock instant for the whole selection: triggering notes individually would put each
    // attack on its own microtask, spreading a chord's onset across several milliseconds.
    poolRef.current.triggerNotes(selectedNoteIndices, profile.durationSec, Tone.now());
  }, [selectedNoteIndices, isAudioInitialized, isScalesMode, playbackState, scalePlaybackMode]);

  useEffect(() => {
    // During a sequence the scheduler has already queued these notes on the audio clock; playing
    // them again off the render that displays them is exactly the coupling this avoids.
    if (playbackState === PlaybackState.SequencePlaying) return;
    void playSelectedNotes();
  }, [selectedNoteIndices, playSelectedNotes, playbackState]);

  return { playSelectedNotes };
}
