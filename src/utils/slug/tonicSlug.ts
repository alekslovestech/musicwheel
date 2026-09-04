import { AccidentalType } from "@/types/enums/AccidentalType";
import { AccidentalFormatter } from "@/utils/formatters/AccidentalFormatter";
import { NoteConverter } from "@/utils/NoteConverter";

function accidentalSlugSuffix(accidental: AccidentalType): string {
  if (accidental === AccidentalType.Sharp) return "-sharp";
  if (accidental === AccidentalType.Flat) return "-flat";
  return "";
}

function accidentalFromSlugSuffix(suffix: string | undefined): AccidentalType {
  if (suffix === "-sharp") return AccidentalType.Sharp;
  if (suffix === "-flat") return AccidentalType.Flat;
  return AccidentalType.None;
}

/** A letter a-g, optionally followed by "-sharp" or "-flat" - e.g. "f-sharp", "d-flat", "c". */
const TONIC_SLUG_PATTERN = /^([a-g])(-sharp|-flat)?$/;

export function tonicToSlug(tonic: string): string {
  const sanitized = NoteConverter.sanitizeNoteString(tonic);
  const letter = sanitized.charAt(0).toLowerCase();
  const accidental = AccidentalFormatter.parseAccidentalType(sanitized.slice(1));
  return letter + accidentalSlugSuffix(accidental);
}

export function slugToTonic(slug: string): string | undefined {
  const match = TONIC_SLUG_PATTERN.exec(slug.toLowerCase());
  if (!match) return undefined;

  const [, letter, suffix] = match;
  const accidental = accidentalFromSlugSuffix(suffix);
  return letter.toUpperCase() + AccidentalFormatter.getAccidentalSignForDebug(accidental);
}
