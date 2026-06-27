"use client";

import React, { ReactNode, useEffect } from "react";
import { useGlobalMode } from "@/lib/hooks";
import { initPH, ph } from "@/lib/tracking/ph";
import { usePathname } from "next/navigation";

import { AudioPlayer } from "@/components/AudioPlayer";
import { DisplayProvider } from "./DisplayContext";
import { MusicalProvider } from "./MusicalContext";
import { ChordPresetProvider } from "./ChordPresetContext";
import { AudioProvider } from "./AudioContext";

export const RootProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const globalMode = useGlobalMode();
  const pathname = usePathname();

  // Initialize PostHog on mount
  useEffect(() => {
    initPH();
  }, []);

  // Track page views when route changes
  useEffect(() => {
    if (ph.__loaded && pathname) {
      ph.capture("$pageview", {
        $current_url: window.location.href,
        pathname: pathname,
        global_mode: globalMode,
      });
    }
  }, [pathname, globalMode]);

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
