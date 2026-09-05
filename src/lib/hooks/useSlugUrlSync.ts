"use client";

import { useEffect, useRef } from "react";
import { notFound, useParams, useRouter, useSearchParams } from "next/navigation";

import { useAudio } from "@/contexts/AudioContext";
import { useMusical } from "@/contexts/MusicalContext";
import { useIsDemoRoute } from "@/lib/hooks/useGlobalMode";
import { MusicalKey } from "@/types/Keys/MusicalKey";
import { slugToProgressionType, slugToScaleType } from "@/utils/slug/codecs";
import { slugToTonic } from "@/utils/slug/tonicSlug";
import {
  isLegalTonic,
  routeMatchesScaleSelection,
  scaleSelectionFromRoute,
  scaleSelectionPath,
  type ScaleSelection,
} from "@/utils/slug/scaleSelection";
import {
  isLegalProgressionTonic,
  progressionSelectionFromRoute,
  progressionSelectionPath,
  routeMatchesProgressionSelection,
} from "@/utils/slug/progressionSelection";

function useScaleRouteParams(): { tonicSlug: string; modeSlug: string } {
  const { tonic, mode } = useParams();

  if (typeof tonic === "string" && typeof mode === "string") return { tonicSlug: tonic, modeSlug: mode };

  notFound();
}

/** Validates the route, syncs URL (tonic, mode, playback mode), and starts slug-gated autoplay for scales. */
export function useScaleSlugPage() {
  const { tonicSlug, modeSlug } = useScaleRouteParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isDemoMode = useIsDemoRoute();
  const { isAudioInitialized, startSequencePlayback, scalePlaybackMode, setScalePlaybackMode } =
    useAudio();
  const { selectedMusicalKey, setSelectedMusicalKey } = useMusical();
  const pendingRouteSyncRef = useRef<string | null>(null);

  const routeScaleMode = slugToScaleType(modeSlug);
  if (routeScaleMode == null) {
    notFound();
  }
  const routeTonic = slugToTonic(tonicSlug);
  if (routeTonic == null || !isLegalTonic(routeTonic, routeScaleMode)) {
    notFound();
  }

  const stateSelection: ScaleSelection = {
    tonic: selectedMusicalKey.tonicString,
    scaleMode: selectedMusicalKey.scaleMode,
    playbackMode: scalePlaybackMode,
  };
  // Identifies "this route" for the pending-sync guard below; changes whenever the route does.
  const routeKey = `${tonicSlug}/${modeSlug}?${searchParams?.toString() ?? ""}`;
  const isSynced = routeMatchesScaleSelection(tonicSlug, modeSlug, searchParams, stateSelection);

  // URL → state: apply when the route changes (direct visit or browser navigation). Keyed off
  // routeKey (a string), not searchParams directly - next/navigation doesn't guarantee that
  // object stays referentially stable across renders where the route hasn't actually changed,
  // and depending on it directly made this effect re-fire on unrelated renders, re-imposing the
  // old URL's tonic over whatever the user had just picked.
  useEffect(() => {
    const routeSelection = scaleSelectionFromRoute(tonicSlug, modeSlug, searchParams, stateSelection);
    const keyChanged =
      routeSelection.scaleMode !== stateSelection.scaleMode ||
      routeSelection.tonic !== stateSelection.tonic;
    const playbackChanged = routeSelection.playbackMode !== stateSelection.playbackMode;
    if (!keyChanged && !playbackChanged) return;

    pendingRouteSyncRef.current = routeKey;
    if (keyChanged) {
      setSelectedMusicalKey(MusicalKey.fromGreekMode(routeSelection.tonic, routeSelection.scaleMode));
    }
    if (playbackChanged) {
      setScalePlaybackMode(routeSelection.playbackMode);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeKey]);

  // State → URL: skip while state is catching up to the URL, or already in sync.
  useEffect(() => {
    if (isSynced) {
      pendingRouteSyncRef.current = null;
      return;
    }
    if (pendingRouteSyncRef.current === routeKey) return;
    router.replace(scaleSelectionPath(stateSelection, { demo: isDemoMode }));
    // stateSelection is rebuilt each render from these same primitives, so depending on the
    // primitives is equivalent to depending on the object without churning on identity.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    router,
    isSynced,
    routeKey,
    isDemoMode,
    stateSelection.tonic,
    stateSelection.scaleMode,
    stateSelection.playbackMode,
  ]);

  useEffect(() => {
    if (!isAudioInitialized || !selectedMusicalKey) return;
    if (!isSynced) return;
    startSequencePlayback();
  }, [isAudioInitialized, isSynced, selectedMusicalKey, startSequencePlayback]);
}

function useProgressionRouteParams(): { tonicSlug: string; progressionSlug: string } {
  const { tonic, progression } = useParams();

  if (typeof tonic === "string" && typeof progression === "string") {
    return { tonicSlug: tonic, progressionSlug: progression };
  }

  notFound();
}

/** Validates the route, syncs URL (tonic, progression), and starts slug-gated autoplay for progressions. */
export function useProgressionSlugPage() {
  const { tonicSlug, progressionSlug } = useProgressionRouteParams();
  const router = useRouter();
  const isDemoMode = useIsDemoRoute();
  const { isAudioInitialized, selectedProgression, setSelectedProgression, startSequencePlayback } =
    useAudio();
  const { selectedMusicalKey } = useMusical();
  const pendingRouteSyncRef = useRef<string | null>(null);

  const routeProgression = slugToProgressionType(progressionSlug);
  if (routeProgression == null) {
    notFound();
  }
  const routeTonic = slugToTonic(tonicSlug);
  if (routeTonic == null || !isLegalProgressionTonic(routeTonic, routeProgression)) {
    notFound();
  }

  // Identifies "this route" for the pending-sync guard below; changes whenever the route does.
  const routeKey = `${tonicSlug}/${progressionSlug}`;
  const isSynced =
    selectedProgression != null &&
    routeMatchesProgressionSelection(tonicSlug, progressionSlug, {
      tonic: selectedMusicalKey.tonicString,
      progression: selectedProgression,
    });

  // URL → state: apply when the route changes (direct visit or browser navigation), or on first
  // mount before any progression has been selected yet.
  useEffect(() => {
    const routeSelection = progressionSelectionFromRoute(tonicSlug, progressionSlug, routeProgression);
    const changed =
      selectedProgression == null ||
      routeSelection.progression !== selectedProgression ||
      routeSelection.tonic !== selectedMusicalKey.tonicString;
    if (!changed) return;

    pendingRouteSyncRef.current = routeKey;
    setSelectedProgression(routeSelection.progression, routeSelection.tonic);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tonicSlug, progressionSlug]);

  // State → URL: skip while state is unset, catching up to the URL, or already in sync.
  useEffect(() => {
    if (selectedProgression == null) return;
    if (isSynced) {
      pendingRouteSyncRef.current = null;
      return;
    }
    if (pendingRouteSyncRef.current === routeKey) return;
    router.replace(
      progressionSelectionPath(
        { tonic: selectedMusicalKey.tonicString, progression: selectedProgression },
        { demo: isDemoMode },
      ),
    );
  }, [router, isSynced, routeKey, isDemoMode, selectedProgression, selectedMusicalKey.tonicString]);

  useEffect(() => {
    if (!isAudioInitialized || !selectedMusicalKey) return;
    if (!isSynced) return;
    startSequencePlayback();
  }, [isAudioInitialized, isSynced, selectedMusicalKey, startSequencePlayback]);
}
