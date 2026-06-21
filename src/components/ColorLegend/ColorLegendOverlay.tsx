"use client";

import { useState } from "react";

import { Button } from "@/components/Common/Button";
import { useAudio } from "@/contexts/AudioContext";
import { track } from "@/lib/track";
import { useGlobalMode, useIsScalePreviewMode } from "@/lib/hooks/useGlobalMode";
import { ScalePlaybackMode } from "@/types/enums/ScalePlaybackMode";

import { ColorLegendPanel } from "./ColorLegendPanel";

export function ColorLegendOverlay() {
  const [open, setOpen] = useState(false);
  const globalMode = useGlobalMode();
  const isScalesMode = useIsScalePreviewMode();
  const { scalePlaybackMode } = useAudio();

  function handleLegendToggle() {
    setOpen((wasOpen) => {
      if (!wasOpen) {
        track("color_legend_opened", { global_mode: globalMode });
      }
      return !wasOpen;
    });
  }

  if (isScalesMode && scalePlaybackMode === ScalePlaybackMode.SingleNote) {
    return null;
  }

  return (
    <div className="absolute top-2 right-2 z-30 flex flex-col items-end gap-tight">
      <Button
        type="button"
        size="sm"
        variant="global"
        className="!text-xs !px-2 !py-1 !min-w-0"
        aria-expanded={open}
        onClick={handleLegendToggle}
      >
        {open ? "Hide legend" : "Legend"}
      </Button>
      {open && <ColorLegendPanel />}
    </div>
  );
}
