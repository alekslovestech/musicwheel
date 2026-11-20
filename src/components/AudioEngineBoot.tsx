"use client";

import { useEffect } from "react";

import { initAudioEngine } from "@/lib/audio/audioEngine";

// Starts the shared audio engine as soon as any page loads.
export function AudioEngineBoot() {
  useEffect(() => initAudioEngine(), []);
  return null;
}
