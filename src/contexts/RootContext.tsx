"use client";

import React, { ReactNode } from "react";
import { useGlobalMode } from "@/lib/hooks";

import { AudioPlayer } from "@/components/AudioPlayer";
import { DisplayProvider } from "./DisplayContext";
import { MusicalProvider } from "./MusicalContext";
import { ChordPresetProvider } from "./ChordPresetContext";
import { AudioProvider } from "./AudioContext";

/** Mounts the interactive app's music/audio/display contexts - scoped to the (app) route group
 * so static content elsewhere on the site (e.g. /learn) never pulls in Tone.js or the audio
 * engine. Site-wide concerns like analytics live in AnalyticsProvider instead, at the true root,
 * since they apply to every route. */
export const RootProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const globalMode = useGlobalMode();

  return (
    <MusicalProvider key={`musical-${globalMode}`}>
      <DisplayProvider key={`display-${globalMode}`}>
        <AudioProvider>
          {/* Remove the key - don't reset audio */}
          <AudioPlayer>
            <ChordPresetProvider key={`chord-preset-${globalMode}`}>{children}</ChordPresetProvider>
          </AudioPlayer>
        </AudioProvider>
      </DisplayProvider>
    </MusicalProvider>
  );
};
