"use client";

import { useEffect } from "react";
import { notFound, useParams, useRouter } from "next/navigation";

import { useAudio } from "@/contexts/AudioContext";
import { useMusical } from "@/contexts/MusicalContext";
import { MusicalKey } from "@/types/Keys/MusicalKey";
import { progressionTypeToSlug, slugToProgressionType } from "@/utils/slug/progressions";
import { scalePath, progressionPath } from "@/utils/slug/paths";
import { scaleTypeToSlug, slugToScaleType } from "@/utils/slug/scales";

function useSlugParam(): string {
  const params = useParams();
  const slug = params.slug;

  if (typeof slug !== "string") {
    notFound();
  }

  return slug;
}

/** Validates slug, syncs URL, and starts slug-gated autoplay for scales. */
export function useScaleSlugPage() {
  const slug = useSlugParam();
  const router = useRouter();
  const { isAudioInitialized, startSequencePlayback } = useAudio();
  const { selectedMusicalKey, setSelectedMusicalKey } = useMusical();

  if (!slugToScaleType(slug)) {
    notFound();
  }

  const stateSlug = scaleTypeToSlug(selectedMusicalKey.scaleMode);

  useEffect(() => {
    const scaleMode = slugToScaleType(slug);
    if (scaleMode != null && scaleMode !== selectedMusicalKey.scaleMode) {
      setSelectedMusicalKey(MusicalKey.fromGreekMode(selectedMusicalKey.tonicString, scaleMode));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    router.replace(scalePath(stateSlug));
  }, [router, stateSlug]);

  useEffect(() => {
    if (!isAudioInitialized || !selectedMusicalKey) return;
    if (slug !== stateSlug) return;
    startSequencePlayback();
  }, [
    isAudioInitialized,
    slug,
    stateSlug,
    selectedMusicalKey,
    startSequencePlayback,
  ]);
}

/** Validates slug, syncs URL, and starts slug-gated autoplay for progressions. */
export function useProgressionSlugPage() {
  const slug = useSlugParam();
  const router = useRouter();
  const { isAudioInitialized, selectedProgression, setSelectedProgression, startSequencePlayback } =
    useAudio();
  const { selectedMusicalKey } = useMusical();

  if (!slugToProgressionType(slug)) {
    notFound();
  }

  const stateSlug = progressionTypeToSlug(selectedProgression);

  useEffect(() => {
    const progression = slugToProgressionType(slug);
    if (progression != null && progression !== selectedProgression) {
      setSelectedProgression(progression);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    router.replace(progressionPath(stateSlug));
  }, [router, stateSlug]);

  useEffect(() => {
    if (!isAudioInitialized || !selectedMusicalKey) return;
    if (slug !== stateSlug) return;
    startSequencePlayback();
  }, [
    isAudioInitialized,
    slug,
    stateSlug,
    selectedMusicalKey,
    startSequencePlayback,
  ]);
}
