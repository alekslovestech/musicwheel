"use client";

import { Suspense } from "react";

import { StaticColorLegendOverlay } from "@/components/ColorLegend/StaticColorLegendOverlay";
import { GlobalModeSelector } from "@/components/GlobalModeSelector";

export function CircularViewOverlay() {
  return (
    <Suspense fallback={null}>
      <GlobalModeSelector />
      <StaticColorLegendOverlay />
    </Suspense>
  );
}
