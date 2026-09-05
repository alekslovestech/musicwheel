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

function joinPath(base: string, segments: string[]): string {
  return [base, ...segments].join("/");
}

function joinQuery(params: string[]): string {
  return params.length ? `?${params.join("&")}` : "";
}

/** Builds a full path: base + path segments + a query string. Omit a piece by passing an empty
 * array - callers decide what's present, e.g. `demo ? [DEMO_QUERY_PARAM] : []`. */
export function buildPath(
  base: string,
  segments: string[] = [],
  queryParams: string[] = [],
): string {
  return joinPath(base, segments) + joinQuery(queryParams);
}

export function getPath(mode: GlobalMode, slug?: string, demo?: boolean): string {
  return buildPath(getBasePath(mode), slug ? [slug] : [], demo ? [DEMO_QUERY_PARAM] : []);
}
