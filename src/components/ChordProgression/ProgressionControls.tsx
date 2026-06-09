"use client";

import { useMusical } from "@/contexts/MusicalContext";

import { PlaybackWidget } from "../PlaybackWidget";
import { TransposeWidget } from "../TransposeWidget";

export function ProgressionControls() {
  const { selectedMusicalKey } = useMusical();

  return (
    <div
      id="progression-controls"
      className="flex shrink-0 flex-wrap items-center justify-center gap-tight pt-1"
    >
      <TransposeWidget target="key" coupled />
      <div
        id="chord-progressions-inferred-key"
        className="text-sm font-medium text-center max-w-xs"
      >
        <div className="text-muted-foreground text-xs font-normal mb-0.5">Musical Key</div>
        <div aria-live="polite" className="text-base font-semibold">
          {selectedMusicalKey.tonicString} {selectedMusicalKey.classicalMode}
        </div>
      </div>
      {/* Add larger horizontal separation before PlaybackWidget */}
      <div className="w-6" aria-hidden="true" />
      <PlaybackWidget coupled />
    </div>
  );
}
