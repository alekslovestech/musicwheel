"use client";

import { createContext, Suspense, useContext, type ReactNode } from "react";

import { useAudioPlayer as useAudioPlayerHook } from "@/lib/hooks/useAudioPlayer";

const PlaySelectedNotesContext = createContext<(() => void) | null>(null);

export function usePlaySelectedNotes(): () => void {
  const playSelectedNotes = useContext(PlaySelectedNotesContext);
  if (!playSelectedNotes) {
    throw new Error("usePlaySelectedNotes must be used within AudioPlayer");
  }
  return playSelectedNotes;
}

export function AudioPlayer({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={null}>
      <AudioPlayerContent>{children}</AudioPlayerContent>
    </Suspense>
  );
}

function AudioPlayerContent({ children }: { children: ReactNode }) {
  const { playSelectedNotes } = useAudioPlayerHook();

  return (
    <PlaySelectedNotesContext.Provider value={playSelectedNotes}>
      {children}
    </PlaySelectedNotesContext.Provider>
  );
}
