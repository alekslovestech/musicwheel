"use client";

import { GlobalMode } from "@/types/enums/GlobalMode";

import { getBasePath } from "@/utils/slug/paths";

import { usePathname, useSearchParams } from "next/navigation";

export const useGlobalMode = () => {
  const pathname = usePathname() ?? "";

  if (pathname.startsWith(getBasePath(GlobalMode.Scales))) return GlobalMode.Scales;
  if (pathname.startsWith(getBasePath(GlobalMode.ChordProgressions)))
    return GlobalMode.ChordProgressions;
  if (pathname.startsWith(getBasePath(GlobalMode.Harmony))) return GlobalMode.Harmony;

  return GlobalMode.Harmony;
};

export const useIsDemoRoute = () => {
  const searchParams = useSearchParams();
  return searchParams?.has("isDemo") ?? false;
};

export const useIsScalePreviewMode = () => {
  const globalMode = useGlobalMode();
  return globalMode === GlobalMode.Scales;
};

export const useIsChordProgressionsMode = () => {
  const globalMode = useGlobalMode();
  return globalMode === GlobalMode.ChordProgressions;
};

