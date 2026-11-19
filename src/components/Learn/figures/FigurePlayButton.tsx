"use client";

import { useEffect, useId, useSyncExternalStore } from "react";

import { PlayIcon, StopIcon } from "@/components/Icons/PlaybackIcons";
import { LEARN_STYLES } from "@/lib/design";
import {
  getActiveLearnPlaybackId,
  stopLearnPlayback,
  subscribeLearnPlayback,
} from "@/lib/audio/learnPlayback";

// Play/stop toggle for a figure. `onStart` receives this button's id and hands it to the
// learnPlayback call, which is how the button knows when it's the one sounding.
export function FigurePlayButton({
  label = "Play",
  onStart,
}: {
  label?: string;
  onStart: (id: string) => void;
}) {
  const id = useId();
  const activeId = useSyncExternalStore(
    subscribeLearnPlayback,
    getActiveLearnPlaybackId,
    () => null,
  );
  const isPlaying = activeId === id;

  // A figure that leaves the page mid-play shouldn't keep sounding.
  useEffect(
    () => () => {
      if (getActiveLearnPlaybackId() === id) stopLearnPlayback();
    },
    [id],
  );

  return (
    <button
      type="button"
      className={LEARN_STYLES.figurePlayButton}
      aria-label={isPlaying ? "Stop" : label}
      title={isPlaying ? "Stop" : label}
      onClick={() => (isPlaying ? stopLearnPlayback() : onStart(id))}
    >
      {isPlaying ? <StopIcon className="h-6 w-6" /> : <PlayIcon className="h-6 w-6" />}
    </button>
  );
}
