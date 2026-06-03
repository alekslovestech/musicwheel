"use client";

import { useEffect, useRef } from "react";
import { notFound, useParams, useRouter } from "next/navigation";

import { useAudio } from "@/contexts/AudioContext";
import { useMusical } from "@/contexts/MusicalContext";
import { useIsDemoRoute } from "@/lib/hooks/useGlobalMode";
import { MusicalKey } from "@/types/Keys/MusicalKey";
import { GlobalMode } from "@/types/enums/GlobalMode";
import {
  progressionTypeToSlug,
  scaleTypeToSlug,
  slugToProgressionType,
  slugToScaleType,
} from "@/utils/slug/codecs";
import { getPath } from "@/utils/slug/paths";

function useSlugParam(): string {
  const { slug } = useParams();

  if (typeof slug === "string") return slug;

  notFound();
}

/** Validates slug, syncs URL, and starts slug-gated autoplay for scales. */
export function useScaleSlugPage() {
  const slug = useSlugParam();
  const router = useRouter();
  const isDemoMode = useIsDemoRoute();
  const { isAudioInitialized, startSequencePlayback } = useAudio();
  const { selectedMusicalKey, setSelectedMusicalKey } = useMusical();
  const pendingSlugSyncRef = useRef<string | null>(null);

  if (!slugToScaleType(slug)) {
    notFound();
  }

  const stateSlug = scaleTypeToSlug(selectedMusicalKey.scaleMode);

  // URL → state: apply when the route slug changes (direct visit or browser navigation).
  useEffect(() => {
    const scaleMode = slugToScaleType(slug);
    if (scaleMode != null && scaleMode !== selectedMusicalKey.scaleMode) {
      pendingSlugSyncRef.current = slug;
      setSelectedMusicalKey(MusicalKey.fromGreekMode(selectedMusicalKey.tonicString, scaleMode));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  // State → URL: skip while state is catching up to the URL, or already in sync.
  useEffect(() => {
    if (stateSlug === slug) {
      pendingSlugSyncRef.current = null;
      return;
    }
    if (pendingSlugSyncRef.current === slug) return;
    router.replace(getPath(GlobalMode.Scales, stateSlug, isDemoMode));
  }, [router, stateSlug, slug, isDemoMode]);

  useEffect(() => {
    if (!isAudioInitialized || !selectedMusicalKey) return;
    if (slug !== stateSlug) return;
    startSequencePlayback();
  }, [isAudioInitialized, slug, stateSlug, selectedMusicalKey, startSequencePlayback]);
}

/** Validates slug, syncs URL, and starts slug-gated autoplay for progressions. */
export function useProgressionSlugPage() {
  const slug = useSlugParam();
  const router = useRouter();
  const isDemoMode = useIsDemoRoute();
  const { isAudioInitialized, selectedProgression, setSelectedProgression, startSequencePlayback } =
    useAudio();
  const { selectedMusicalKey } = useMusical();
  const pendingSlugSyncRef = useRef<string | null>(null);

  if (!slugToProgressionType(slug)) {
    notFound();
  }

  const stateSlug = progressionTypeToSlug(selectedProgression);

  // URL → state: apply when the route slug changes (direct visit or browser navigation).
  useEffect(() => {
    const progression = slugToProgressionType(slug);
    if (progression != null && progression !== selectedProgression) {
      pendingSlugSyncRef.current = slug;
      setSelectedProgression(progression);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  // State → URL: skip while state is catching up to the URL, or already in sync.
  useEffect(() => {
    if (stateSlug === slug) {
      pendingSlugSyncRef.current = null;
      return;
    }
    if (selectedProgression == null) return;
    if (pendingSlugSyncRef.current === slug) return;
    router.replace(getPath(GlobalMode.ChordProgressions, stateSlug, isDemoMode));
  }, [router, stateSlug, slug, isDemoMode, selectedProgression]);

  useEffect(() => {
    if (!isAudioInitialized || !selectedMusicalKey) return;
    if (slug !== stateSlug) return;
    startSequencePlayback();
  }, [isAudioInitialized, slug, stateSlug, selectedMusicalKey, startSequencePlayback]);
}
