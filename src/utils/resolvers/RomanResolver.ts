import { ChordType } from "@/types/enums/ChordType";
import { AccidentalType } from "@/types/enums/AccidentalType";

import { MusicalKey } from "@/types/Keys/MusicalKey";
import { RomanChord } from "@/types/RomanChord";
import { AbsoluteChord } from "@/types/AbsoluteChord";
import { isNoteLength, makeDurated, type Durated, type NoteLength } from "@/types/Durated";
import { addChromatic } from "@/types/ChromaticIndex";
import { ixScaleDegreeIndex } from "@/types/ScaleModes/ScaleDegreeType";
import { AccidentalFormatter } from "@/utils/formatters/AccidentalFormatter";

export class RomanResolver {
  static resolveRomanChord(romanChord: RomanChord, musicalKey: MusicalKey): AbsoluteChord {
    const scale = musicalKey.scaleModeInfo.getAbsoluteScaleNotes(musicalKey.tonicIndex);

    let chromaticIndex = scale[romanChord.scaleDegreeIndex];

    const accidentalOffset =
      romanChord.accidental === AccidentalType.Flat
        ? -1
        : romanChord.accidental === AccidentalType.Sharp
          ? 1
          : 0;
    chromaticIndex = addChromatic(chromaticIndex, accidentalOffset);

    const bassNote =
      romanChord.bassDegree !== undefined
        ? scale[ixScaleDegreeIndex(romanChord.bassDegree - 1)]
        : chromaticIndex;

    return new AbsoluteChord(chromaticIndex, romanChord.chordType, bassNote);
  }

  static resolveRomanChordWithDuration(
    entry: Durated<RomanChord>,
    musicalKey: MusicalKey,
  ): Durated<AbsoluteChord> {
    if (entry.noteLength === undefined) {
      throw new Error(
        "Expected carried note length to be applied before resolving RomanChordWithDuration",
      );
    }

    return makeDurated(
      this.resolveRomanChord(entry.value, musicalKey),
      entry.noteLength,
      entry.rhythmDots,
    );
  }

  /**
   * Creates a RomanChord object from a Roman numeral string.
   *
   * @param romanString - The Roman numeral string to parse (e.g., "I", "ii7", "♭III")
   * @returns A RomanChord object representing the parsed Roman numeral
   * @throws Error if the Roman numeral string is invalid
   */
  static createRomanChordFromString(romanString: string): RomanChord {
    const parsedRoman = splitRomanString(romanString);
    const accidental: AccidentalType = AccidentalFormatter.parseAccidentalType(
      parsedRoman.accidentalPrefix,
    );

    const ordinal = RomanChord.fromRoman(parsedRoman.pureRoman);
    const isLowercase = RomanChord.isLowercaseRomanNumeral(parsedRoman.pureRoman);
    const chordType = RomanChord.determineChordType(isLowercase, parsedRoman.chordSuffix);
    const bassDegree = parsedRoman.bassRoman
      ? RomanChord.fromRoman(parsedRoman.bassRoman)
      : undefined;

    if (chordType === ChordType.Unknown) {
      throw new Error(`Invalid roman notation ${romanString}`);
    }

    return new RomanChord(ordinal!, chordType, accidental, bassDegree);
  }

  static parseRomanChordWithDuration(input: string): Durated<RomanChord> {
    const { romanPart, noteLength, rhythmDots } = splitProgressionToken(input.trim());
    return makeDurated(this.createRomanChordFromString(romanPart), noteLength, rhythmDots);
  }
}

interface ParsedRomanLexeme {
  accidentalPrefix: string;
  pureRoman: string;
  chordSuffix: string;
  bassRoman: string | undefined;
}

const accidentalRegex: RegExp = /#|♯|b|♭/;
const pureRomanRegex: RegExp = /I|II|III|IV|V|VI|VII|i|ii|iii|iv|v|vi|vii/;
/** Longer tokens first so e.g. `dim7` is not consumed as `dim`. */
const chordTypeRegex: RegExp = /\+|maj7|dim7|o7|ø7|7|6|dim|o|aug/;
const romanRegex: RegExp = new RegExp(
  `^(${accidentalRegex.source})?(${pureRomanRegex.source})(${chordTypeRegex.source})?(\/(${pureRomanRegex.source}))?$`,
);

/**
 * Trailing `:denominator` with optional dot(s) for LilyPond-style length
 * (e.g. `IV:2` half, `IV:4.` dotted quarter). Each `.` multiplies duration by 1.5.
 */
const progressionDurationSuffixRegex = /^(.+):(\d+)(\.+)?$/;

function splitProgressionToken(token: string): {
  romanPart: string;
  noteLength: NoteLength | undefined;
  rhythmDots: number;
} {
  const match = token.match(progressionDurationSuffixRegex);
  if (match) {
    const parsed = Number(match[2]);
    if (!isNoteLength(parsed)) {
      throw new Error(`Unsupported note length: ${match[2]}`);
    }
    const dotStr = match[3];
    return {
      romanPart: match[1],
      noteLength: parsed,
      rhythmDots: dotStr !== undefined ? dotStr.length : 0,
    };
  }
  return { romanPart: token, noteLength: undefined, rhythmDots: 0 };
}

function splitRomanString(romanString: string): ParsedRomanLexeme {
  const match = romanString.match(romanRegex);
  if (match) {
    return {
      accidentalPrefix: match[1] || "",
      pureRoman: match[2],
      chordSuffix: match[3] || "",
      bassRoman: match[5] || undefined,
    };
  }

  throw new Error(`No match found for roman string: ${romanString}`);
}
