"use client";

import { useState } from "react";

import { Button } from "@/components/Common/Button";
import { TrackEvent } from "@/lib/tracking/events";
import { useTrack } from "@/lib/tracking/useTrack";

import { ColorLegendPanel } from "./ColorLegendPanel";

export function ColorLegendOverlay() {
  const [open, setOpen] = useState(false);
  const trackAction = useTrack();

  function handleLegendToggle() {
    setOpen((wasOpen) => {
      trackAction(TrackEvent.ColorLegendInteracted);
      return !wasOpen;
    });
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
