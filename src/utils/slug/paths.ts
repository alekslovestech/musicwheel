import { GlobalMode } from "@/types/enums/GlobalMode";

export const DEMO_QUERY_PARAM = "isDemo";

export function getBasePath(mode: GlobalMode): string {
  switch (mode) {
    case GlobalMode.Harmony:
      return "/harmony";
    case GlobalMode.Scales:
      return "/scales";
    case GlobalMode.ChordProgressions:
      return "/progressions";
    default: {
      const _exhaustive: never = mode;
      return _exhaustive;
    }
  }
}

export function getPath(mode: GlobalMode, slug?: string, demo?: boolean): string {
  const path = slug ? `${getBasePath(mode)}/${slug}` : getBasePath(mode);
  return demo ? `${path}?${DEMO_QUERY_PARAM}` : path;
}

export const harmonyPath = (demo?: boolean) => getPath(GlobalMode.Harmony, undefined, demo);

export const scalePath = (slug: string, demo?: boolean) =>
  getPath(GlobalMode.Scales, slug, demo);

export const progressionPath = (slug: string, demo?: boolean) =>
  getPath(GlobalMode.ChordProgressions, slug, demo);
