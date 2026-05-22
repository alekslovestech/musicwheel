"use client";
import { GlobalMode } from "@/types/enums/GlobalMode";
import { usePathname, useSearchParams } from "next/navigation";

export const useGlobalMode = () => {
  const pathname = usePathname() ?? "";

  if (pathname.startsWith("/scales")) return GlobalMode.Scales;
  if (pathname.startsWith("/progressions")) return GlobalMode.ChordProgressions;
  if (pathname.startsWith("/minimal")) return GlobalMode.Minimal;

  return GlobalMode.Harmony;
};

export const useIsDemoRoute = () => {
  const searchParams = useSearchParams();
  return searchParams.has("isDemo");
};

export const useIsMinimalMode = () => {
  const globalMode = useGlobalMode();
  return globalMode === GlobalMode.Minimal;
};

export const useIsScalePreviewMode = () => {
  const globalMode = useGlobalMode();
  return globalMode === GlobalMode.Scales;
};

export const useIsChordProgressionsMode = () => {
  const globalMode = useGlobalMode();
  return globalMode === GlobalMode.ChordProgressions;
};
