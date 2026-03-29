export interface ParsedRomanString {
  accidentalPrefix: string;
  pureRoman: string;
  chordSuffix: string;
  bassRoman: string | undefined;
}

export function createParsedRomanString(
  accidentalPrefix: string,
  pureRoman: string,
  chordSuffix: string,
  bassRoman: string | undefined,
): ParsedRomanString {
  return { accidentalPrefix, pureRoman, chordSuffix, bassRoman };
}

const accidentalRegex: RegExp = /#|♯|b|♭/;
const pureRomanRegex: RegExp = /I|II|III|IV|V|VI|VII|i|ii|iii|iv|v|vi|vii/;
const chordTypeRegex: RegExp = /\+|7|maj7|o|o7|dim|dim7|aug|ø7/;
const romanRegex: RegExp = new RegExp(
  `^(${accidentalRegex.source})?(${pureRomanRegex.source})(${chordTypeRegex.source})?(\/(${pureRomanRegex.source}))?$`,
);

/**
 * Lexical parsing of Roman numeral chord symbols (e.g. "♭III7", "V/vi").
 */
export class RomanParser {
  static splitRomanString(romanString: string): ParsedRomanString {
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
}
