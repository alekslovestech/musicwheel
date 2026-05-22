"use client";

import { useEffect } from "react";
import { notFound, useParams, useRouter } from "next/navigation";

import { useAudio } from "@/contexts/AudioContext";
import { useMusical } from "@/contexts/MusicalContext";
import { MusicalKey } from "@/types/Keys/MusicalKey";
import { progressionTypeToSlug, slugToProgressionType } from "@/utils/chordProgressionSlug";
import { scaleTypeToSlug, slugToScaleType } from "@/utils/scaleSlug";

function useSlugParam(): string {
  const params = useParams();
  const slug = params.slug;

  if (typeof slug !== "string") {
    notFound();
  }

  return slug;
}

/** Redirect /scales → /scales/<slug> and keep URL in sync with the selected scale mode. */
export function useScaleUrlSync() {
  const router = useRouter();
  const { selectedMusicalKey } = useMusical();
  const slug = scaleTypeToSlug(selectedMusicalKey.scaleMode);

  useEffect(() => {
    router.replace(`/scales/${slug}`);
  }, [router, slug]);
}

/** Redirect /progressions → /progressions/<slug> and keep URL in sync with the selection. */
export function useProgressionUrlSync() {
  const router = useRouter();
  const { selectedProgression } = useAudio();
  const slug = progressionTypeToSlug(selectedProgression);

  useEffect(() => {
    router.replace(`/progressions/${slug}`);
  }, [router, slug]);
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
    router.replace(`/scales/${stateSlug}`);
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
    router.replace(`/progressions/${stateSlug}`);
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
