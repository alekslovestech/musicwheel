"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { MusicalKey } from "@/types/Keys/MusicalKey";
import { useMusical } from "@/contexts/MusicalContext";
import { scaleTypeToSlug, slugToScaleType } from "@/utils/scaleSlug";

/**
 * Keeps the URL in sync with the selected scale mode (state → URL).
 * Optionally accepts an initial slug from a dynamic route param to seed state on mount (URL → state).
 */
export const useScaleModeUrlSync = (initialSlug?: string) => {
  const router = useRouter();
  const { selectedMusicalKey, setSelectedMusicalKey } = useMusical();

  // On mount only: if a slug was provided in the URL, seed the musical key state.
  useEffect(() => {
    if (!initialSlug) return;
    const scaleMode = slugToScaleType(initialSlug);
    if (!scaleMode || scaleMode === selectedMusicalKey.scaleMode) return;
    setSelectedMusicalKey(MusicalKey.fromGreekMode(selectedMusicalKey.tonicString, scaleMode));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Whenever the scale mode changes, replace the URL to reflect the new mode.
  useEffect(() => {
    const slug = scaleTypeToSlug(selectedMusicalKey.scaleMode);
    router.replace(`/scales/${slug}`);
  }, [selectedMusicalKey.scaleMode, router]);
};
