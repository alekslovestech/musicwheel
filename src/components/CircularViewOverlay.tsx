"use client";

import { Suspense } from "react";

import { StaticColorLegendOverlay } from "@/components/ColorLegend/StaticColorLegendOverlay";
import { SequenceLegendOverlay } from "@/components/ColorLegend/SequenceLegendOverlay";
import { GlobalModeSelector } from "@/components/GlobalModeSelector";

export function CircularViewOverlay() {
  return (
    <Suspense fallback={null}>
      <GlobalModeSelector />
      <StaticColorLegendOverlay />
      <SequenceLegendOverlay />
    </Suspense>
  );
}
