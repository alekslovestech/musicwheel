import { ChordType } from "@/types/enums/ChordType";

/** How one chord quality is written as a roman-numeral suffix, and read back. */
type RomanQualitySpec = {
  /** Canonical suffix - what encoding writes, and what parsing accepts. */
  suffix: string;
  /** Lowercase numeral, carrying the minor quality that `suffix` then leaves unsaid. */
  isLowerCase: boolean;
  /** Further suffixes parsing accepts; encoding still writes `suffix`. */
  parseTokens?: readonly string[];
  /** Shown instead of `suffix` where space is tight. Display only - never parsed back. */
  displaySuffix?: string;
};

export const DEFAULT_ROMAN_QUALITY: RomanQualitySpec = {
  suffix: "",
  isLowerCase: false,
};

/**
 * Stands in for a quality that standard notation has no symbol for. Says "this is not one of
 * the chords you know, look it up" rather than borrowing a symbol that would be a lie - the
 * legend carries the real name.
 */
export const EXOTIC_QUALITY_MARKER = "*";

export function romanQuality(
  suffix: string,
  isLowerCase: boolean,
  extras?: Omit<RomanQualitySpec, "suffix" | "isLowerCase">,
): RomanQualitySpec {
  return { suffix, isLowerCase, ...extras };
}

export function getRomanQuality(chordType: ChordType): RomanQualitySpec {
  return ROMAN_QUALITY[chordType] ?? DEFAULT_ROMAN_QUALITY;
}

/**
 * Same numeral casing, but qualities carrying a `displaySuffix` show that instead. Lossy on
 * purpose - for space-constrained display only, never for anything parsed back via
 * {@link resolveRomanQuality}.
 */
export function getRomanQualityForDisplay(chordType: ChordType): RomanQualitySpec {
  const spec = getRomanQuality(chordType);
  return spec.displaySuffix === undefined ? spec : { ...spec, suffix: spec.displaySuffix };
}

export function resolveRomanQuality(isLowerCase: boolean, suffix: string): ChordType {
  const found = ROMAN_QUALITY_ENTRIES.find(
    ([, spec]) => spec.isLowerCase === isLowerCase && parseableTokens(spec).includes(suffix),
  );
  return found?.[0] ?? ChordType.Unknown;
}

/**
 * Progression roman quality: encode/decode via suffix + numeral case.
 *
 * `displaySuffix` marks the qualities standard notation has no symbol for with
 * {@link EXOTIC_QUALITY_MARKER}, rather than abbreviating them toward a symbol they are not.
 * Abbreviating was tried and dropped: shortening `sus2♯4` (1-2-♯4, no 5th, built on a tritone)
 * to `sus2` printed the same label on two different chords in Panthu Varaali, which has both
 * diatonic. One character says "not a chord you know, see the legend" without the false claim.
 *
 * Standard alteration notation is left alone (`♭5`, `7♭5`, `Δ7♭5`): already short, and an
 * altered 5th on a chord with a real major/minor quality is not something to hide.
 */
const ROMAN_QUALITY: Partial<Record<ChordType, RomanQualitySpec>> = {
  [ChordType.Major]: romanQuality("", false),
  [ChordType.Minor]: romanQuality("", true),
  [ChordType.Dominant7]: romanQuality("7", false),
  [ChordType.Dominant7Flat5]: romanQuality("7♭5", false),
  [ChordType.Minor7]: romanQuality("7", true),
  [ChordType.Major6]: romanQuality("6", false),
  [ChordType.Minor6]: romanQuality("6", true),
  [ChordType.Major7]: romanQuality("Δ7", false, { parseTokens: ["maj7"] }),
  [ChordType.Diminished]: romanQuality("°", true, { parseTokens: ["o", "dim"] }),
  [ChordType.Diminished7]: romanQuality("°7", true, { parseTokens: ["o7", "dim7"] }),
  [ChordType.HalfDiminished]: romanQuality("ø7", true),
  [ChordType.Augmented]: romanQuality("+", false, { parseTokens: ["aug"] }),
  [ChordType.MajFlat5]: romanQuality("♭5", false),
  [ChordType.Sus4]: romanQuality("sus", false),
  [ChordType.Major7Sus4]: romanQuality("Δ7sus4", false, { displaySuffix: EXOTIC_QUALITY_MARKER }),
  [ChordType.Dominant7Sus2Flat5]: romanQuality("7sus2♭5", false, {
    displaySuffix: EXOTIC_QUALITY_MARKER,
  }),
  [ChordType.Major7Flat5]: romanQuality("Δ7♭5", false),
  [ChordType.Sus2Add6]: romanQuality("6sus2", false, { displaySuffix: EXOTIC_QUALITY_MARKER }),
  [ChordType.Sus2]: romanQuality("sus2", false),
  [ChordType.Sus2sharp4]: romanQuality("sus2♯4", false, { displaySuffix: EXOTIC_QUALITY_MARKER }),
  [ChordType.Sus2_4]: romanQuality("sus24", false, { displaySuffix: EXOTIC_QUALITY_MARKER }),
  [ChordType.Narrow_b3_4]: romanQuality("add4", true),
};

/** `Object.entries` widens the key to `string`; the table is keyed by {@link ChordType}. */
const ROMAN_QUALITY_ENTRIES = Object.entries(ROMAN_QUALITY) as [ChordType, RomanQualitySpec][];

/** Everything parsing accepts for a quality: its canonical suffix plus any alternates. */
function parseableTokens(spec: RomanQualitySpec): readonly string[] {
  return spec.parseTokens ? [spec.suffix, ...spec.parseTokens] : [spec.suffix];
}

/**
 * Regex fragment matching any parseable suffix, for embedding in a larger pattern - longest
 * first, so `sus2` is not consumed as `sus`.
 */
export const ROMAN_CHORD_SUFFIX_ALTERNATION = buildSuffixAlternation();

function buildSuffixAlternation(): string {
  const allTokens = ROMAN_QUALITY_ENTRIES.flatMap(([, spec]) => parseableTokens(spec));
  return [...new Set(allTokens)]
    .filter((token) => token.length > 0)
    .sort((a, b) => b.length - a.length)
    .map(escapeRegexToken)
    .join("|");
}

function escapeRegexToken(token: string): string {
  return token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
