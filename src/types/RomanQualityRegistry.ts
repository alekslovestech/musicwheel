import { ChordType } from "@/types/enums/ChordType";

/** How one chord quality is written as a roman-numeral suffix, and read back. */
type RomanQualitySpec = {
  /** Canonical suffix - what encoding writes, and what parsing accepts. */
  suffix: string;
  /** Lowercase numeral, carrying the minor quality that `suffix` then leaves unsaid. */
  isLowerCase: boolean;
  /**
   * Outside roman-numeral vocabulary: displays as {@link EXOTIC_QUALITY_MARKER} instead of
   * `suffix`. Display only - `suffix` is still what encoding writes and parsing reads.
   */
  isExotic: boolean;
  /** Further suffixes parsing accepts; encoding still writes `suffix`. */
  parseTokens?: readonly string[];
};

export const DEFAULT_ROMAN_QUALITY: RomanQualitySpec = {
  suffix: "",
  isLowerCase: false,
  isExotic: false,
};

/**
 * Stands in for a quality outside roman-numeral vocabulary - whether or not a chord symbol
 * could spell it. Says "this is not one of the chords you know, look it up" instead of putting
 * notation next to a numeral where it would not belong; the legend carries the real name.
 */
export const EXOTIC_QUALITY_MARKER = "*";

export function romanQuality(
  suffix: string,
  isLowerCase: boolean,
  parseTokens?: readonly string[],
): RomanQualitySpec {
  return { suffix, isLowerCase, isExotic: false, ...(parseTokens ? { parseTokens } : {}) };
}

/**
 * A quality roman-numeral analysis has no name for. Its own factory rather than a third
 * boolean argument: `romanQuality("Δ7", false, false)` gives no clue which flag is which.
 */
export function exoticQuality(suffix: string, isLowerCase: boolean): RomanQualitySpec {
  return { suffix, isLowerCase, isExotic: true };
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
  return spec.isExotic ? { ...spec, suffix: EXOTIC_QUALITY_MARKER } : spec;
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
 * A suffix earns its place here only if roman-numeral analysis actually names that quality:
 * major and minor by numeral case, `°`, `+`, and the seventh set (`7`, `Δ7`, `ø7`, `°7`, `6`).
 * `sus`/`sus2` stay too - not classical vocabulary, but "no 3rd" is a real category, and the
 * wheel needs a genuine sus2 to look different from the exotics near it.
 *
 * Everything else is `isExotic`, shown as {@link EXOTIC_QUALITY_MARKER}. That includes suffixes
 * standard notation *can* write, because being writable as a chord symbol is not the same as
 * being roman vocabulary - nobody analyses a progression as `V♭5`. Abbreviating toward a
 * nearby symbol was tried instead and dropped: shortening `sus2♯4` (1-2-♯4, no 5th) to `sus2`
 * printed one label for two different chords in Panthu Varaali, which has both diatonic.
 */
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
  [ChordType.Sus4]: romanQuality("sus", false),
  [ChordType.Sus2]: romanQuality("sus2", false),

  [ChordType.MajFlat5]: exoticQuality("♭5", false),
  [ChordType.Dominant7Flat5]: exoticQuality("7♭5", false),
  [ChordType.Major7Sus4]: exoticQuality("Δ7sus4", false),
  [ChordType.Dominant7Sus2Flat5]: exoticQuality("7sus2♭5", false),
  [ChordType.Major7Flat5]: exoticQuality("Δ7♭5", false),
  [ChordType.Sus2Add6]: exoticQuality("6sus2", false),
  [ChordType.Sus2sharp4]: exoticQuality("sus2♯4", false),
  [ChordType.Sus2_4]: exoticQuality("sus24", false),
  [ChordType.Narrow_b3_4]: exoticQuality("add4", true),
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
