import { ChordType } from "@/types/enums/ChordType";
import { AccidentalType } from "@/types/enums/AccidentalType";

import { MusicalKey } from "@/types/Keys/MusicalKey";
import { RomanChord } from "@/types/RomanChord";
import { AbsoluteChord } from "@/types/AbsoluteChord";
import {
  isNoteLength,
  makeDurated,
  type Durated,
  type NoteLength,
} from "@/types/Durated";
import { addChromatic } from "@/types/ChromaticIndex";
import { ixScaleDegreeIndex } from "@/types/ScaleModes/ScaleDegreeType";
import { AccidentalFormatter } from "@/utils/formatters/AccidentalFormatter";

interface ParsedRomanLexeme {
  accidentalPrefix: string;
  pureRoman: string;
  chordSuffix: string;
  bassRoman: string | undefined;
}

const accidentalRegex: RegExp = /#|♯|b|♭/;
const pureRomanRegex: RegExp = /I|II|III|IV|V|VI|VII|i|ii|iii|iv|v|vi|vii/;
const chordTypeRegex: RegExp = /\+|7|maj7|o|o7|dim|dim7|aug|ø7/;
const romanRegex: RegExp = new RegExp(
  `^(${accidentalRegex.source})?(${pureRomanRegex.source})(${chordTypeRegex.source})?(\/(${pureRomanRegex.source}))?$`,
);

/** Trailing `:denominator` for LilyPond-style length (e.g. `IV:2` → half note). */
const progressionDurationSuffixRegex = /^(.+):(\d+)$/;

function splitProgressionToken(token: string): {
  romanPart: string;
  noteLength: NoteLength | undefined;
} {
  const match = token.match(progressionDurationSuffixRegex);
  if (match) {
    const parsed = Number(match[2]);
    if (!isNoteLength(parsed)) {
      throw new Error(`Unsupported note length: ${match[2]}`);
    }
    return { romanPart: match[1], noteLength: parsed };
  }
  return { romanPart: token, noteLength: undefined };
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

export class RomanResolver {
  static resolveRomanChord(
    romanChord: RomanChord,
    musicalKey: MusicalKey,
  ): AbsoluteChord {
    const scale = musicalKey.scaleModeInfo.getAbsoluteScaleNotes(
      musicalKey.tonicIndex,
    );

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
    const isLowercase = RomanChord.isLowercaseRomanNumeral(
      parsedRoman.pureRoman,
    );
    const chordType = RomanChord.determineChordType(
      isLowercase,
      parsedRoman.chordSuffix,
    );
    const bassDegree = parsedRoman.bassRoman
      ? RomanChord.fromRoman(parsedRoman.bassRoman)
      : undefined;

    if (chordType === ChordType.Unknown) {
      throw new Error(`Invalid roman notation ${romanString}`);
    }

    return new RomanChord(ordinal!, chordType, accidental, bassDegree);
  }

  static parseRomanChordWithDuration(input: string): Durated<RomanChord> {
    const { romanPart, noteLength } = splitProgressionToken(input.trim());
    return makeDurated(
      this.createRomanChordFromString(romanPart),
      noteLength,
    );
  }
}
