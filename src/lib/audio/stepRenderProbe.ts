"use client";

import { useEffect } from "react";

/** Enough steps for a percentile to mean something, without flooding the console. */
const REPORT_EVERY_STEPS = 8;

const isEnabled = process.env.NODE_ENV !== "production";

let stepStartedAt: number | null = null;
let samples: number[] = [];

/** Called by the sequencer at the instant a step's notes are handed to React. */
export function markStepStart() {
  if (!isEnabled) return;
  stepStartedAt = performance.now();
}

function percentile(sorted: number[], quantile: number): number {
  return sorted[Math.min(sorted.length - 1, Math.floor(quantile * sorted.length))];
}

function report() {
  const sorted = [...samples].sort((a, b) => a - b);
  samples = [];
  console.info(
    `[step-render] ${sorted.length} steps: p50 ${percentile(sorted, 0.5).toFixed(1)}ms, ` +
      `p95 ${percentile(sorted, 0.95).toFixed(1)}ms, max ${sorted[sorted.length - 1].toFixed(1)}ms`,
  );
}

/**
 * Development-only: time from a playback step being handed to React until the next animation
 * frame - that is, the head start the visuals would need if the audio were scheduled ahead of
 * them on the Web Audio clock rather than fired from the render that paints them.
 *
 * Read the spread, not the average. A cost that is large but steady can be compensated with a
 * fixed lead; a cost that jumps between steps cannot, and that unevenness is what the ear picks
 * up as stuttering playback.
 */
export function useStepRenderProbe() {
  useEffect(() => {
    if (!isEnabled || stepStartedAt == null) return;

    const start = stepStartedAt;
    stepStartedAt = null;

    requestAnimationFrame(() => {
      samples.push(performance.now() - start);
      if (samples.length >= REPORT_EVERY_STEPS) report();
    });
  });
}
