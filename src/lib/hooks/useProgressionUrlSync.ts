"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAudio } from "@/contexts/AudioContext";
import { progressionTypeToSlug, slugToProgressionType } from "@/utils/chordProgressionSlug";

/**
 * Keeps the URL in sync with the selected chord progression (state → URL).
 * Optionally accepts an initial slug from a dynamic route param to seed state on mount (URL → state).
 */
export const useProgressionUrlSync = (initialSlug?: string) => {
  const router = useRouter();
  const { selectedProgression, setSelectedProgression } = useAudio();

  // On mount only: if a slug was provided in the URL, seed the progression state.
  useEffect(() => {
    if (!initialSlug) return;
    const progression = slugToProgressionType(initialSlug);
    if (!progression || progression === selectedProgression) return;
    setSelectedProgression(progression);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Whenever the progression changes, replace the URL to reflect the new selection.
  useEffect(() => {
    const slug = progressionTypeToSlug(selectedProgression);
    router.replace(`/progressions/${slug}`);
  }, [selectedProgression, router]);
};
