"use client";

import { Suspense } from "react";

import { useAudioPlayer } from "@/lib/hooks/useAudioPlayer";

export { useAudioPlayer };

export function AudioPlayer() {
  return (
    <Suspense fallback={null}>
      <AudioPlayerContent />
    </Suspense>
  );
}

function AudioPlayerContent() {
  useAudioPlayer();
  return null;
}
