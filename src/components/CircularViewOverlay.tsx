"use client";

import { Suspense } from "react";

import { ColorLegendOverlay } from "@/components/ColorLegend/ColorLegendOverlay";
import { GlobalModeSelector } from "@/components/GlobalModeSelector";

export function CircularViewOverlay() {
  return (
    <Suspense fallback={null}>
      <GlobalModeSelector />
      <ColorLegendOverlay />
    </Suspense>
  );
}
