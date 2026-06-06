import { ChordType } from "@/types/enums/ChordType";

export type RomanQualitySpec = {
  suffix: string;
  isLowerCase: boolean;
  /** Alternate suffix tokens accepted when parsing (canonical encode uses `suffix`). */
  parseTokens?: readonly string[];
};

export const DEFAULT_ROMAN_QUALITY: RomanQualitySpec = {
  suffix: "",
  isLowerCase: false,
};

export function romanQuality(
  suffix: string,
  isLowerCase: boolean,
  parseTokens?: readonly string[],
): RomanQualitySpec {
  return parseTokens ? { suffix, isLowerCase, parseTokens } : { suffix, isLowerCase };
}

/** Progression roman quality: encode/decode via suffix + numeral case. */
const ROMAN_QUALITY: Partial<Record<ChordType, RomanQualitySpec>> = {
  [ChordType.Major]: romanQuality("", false),
  [ChordType.Minor]: romanQuality("", true),
  [ChordType.Dominant7]: romanQuality("7", false),
  [ChordType.Minor7]: romanQuality("7", true),
  [ChordType.Major6]: romanQuality("6", false),
  [ChordType.Minor6]: romanQuality("6", true),
  [ChordType.Major7]: romanQuality("Δ7", false, ["maj7"]),
  [ChordType.Diminished]: romanQuality("°", true, ["o", "dim"]),
  [ChordType.Diminished7]: romanQuality("°7", true, ["o7", "dim7"]),
  [ChordType.HalfDiminished]: romanQuality("ø7", true),
  [ChordType.Augmented]: romanQuality("+", false, ["aug"]),
  [ChordType.MajFlat5]: romanQuality("♭5", false),
  [ChordType.Sus4]: romanQuality("sus", false),
  [ChordType.Sus2]: romanQuality("sus2", false),
  [ChordType.Narrow24sharp]: romanQuality("sus2♯4", false),
};

function decodeKey(isLowerCase: boolean, suffix: string): string {
  return `${isLowerCase}:${suffix}`;
}

function buildDecodeMap(): Map<string, ChordType> {
  const map = new Map<string, ChordType>();
  for (const [type, spec] of Object.entries(ROMAN_QUALITY) as [ChordType, RomanQualitySpec][]) {
    map.set(decodeKey(spec.isLowerCase, spec.suffix), type);
    for (const token of spec.parseTokens ?? []) {
      map.set(decodeKey(spec.isLowerCase, token), type);
    }
  }
  return map;
}

function escapeRegexToken(token: string): string {
  return token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildParseSuffixPattern(): RegExp {
  const tokens = new Set<string>();
  for (const spec of Object.values(ROMAN_QUALITY)) {
    if (!spec) continue;
    if (spec.suffix.length > 0) tokens.add(spec.suffix);
    for (const token of spec.parseTokens ?? []) tokens.add(token);
  }
  const sorted = [...tokens].sort((a, b) => b.length - a.length);
  return new RegExp(sorted.map(escapeRegexToken).join("|"));
}

const DECODE_MAP = buildDecodeMap();

/** Longer tokens first so e.g. `sus2` is not consumed as `sus`. */
export const ROMAN_CHORD_SUFFIX_PATTERN = buildParseSuffixPattern();

export function getRomanQuality(chordType: ChordType): RomanQualitySpec {
  return ROMAN_QUALITY[chordType] ?? DEFAULT_ROMAN_QUALITY;
}

export function resolveRomanQuality(isLowerCase: boolean, suffix: string): ChordType {
  return DECODE_MAP.get(decodeKey(isLowerCase, suffix)) ?? ChordType.Unknown;
}
