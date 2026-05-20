import { AccidentalType } from "@/types/enums/AccidentalType";

export class AccidentalFormatter {
  //mostly used in for text on keyboards / accidental toggle
  static getAccidentalSignForDisplay(accidental: AccidentalType): string {
    switch (accidental) {
      case AccidentalType.None:
        return "";
      case AccidentalType.Natural:
        return "♮";
      case AccidentalType.Sharp:
        return "♯";
      case AccidentalType.Flat:
        return "♭";
      default:
        return "";
    }
  }

  static getAccidentalSignForDebug(accidental: AccidentalType): string {
    switch (accidental) {
      case AccidentalType.None:
        return "";
      case AccidentalType.Natural:
        return "♮";
      case AccidentalType.Sharp:
        return "#";
      case AccidentalType.Flat:
        return "b";
      default:
        return "";
    }
  }

  //mostly used in StaffRenderer / EasyScore format
  static getAccidentalSignForEasyScore = (accidental: AccidentalType): string => {
    switch (accidental) {
      case AccidentalType.None:
        return "";
      case AccidentalType.Natural:
        return "n";
      case AccidentalType.Sharp:
        return "#";
      case AccidentalType.Flat:
        return "b";
      default:
        return "";
    }
  };

  //accidental string can be in display format, or debug format
  static parseAccidentalType(accidentalString: string): AccidentalType {
    switch (accidentalString) {
      case "#":
      case "♯":
        return AccidentalType.Sharp;
      case "b":
      case "♭":
        return AccidentalType.Flat;
      case "n":
      case "♮":
        return AccidentalType.Natural;
      default:
        return AccidentalType.None;
    }
  }

  static toSemitoneOffset(accidental: AccidentalType): number {
    if (accidental === AccidentalType.Sharp) return 1;
    if (accidental === AccidentalType.Flat) return -1;
    return 0;
  }
}

export const getOppositeAccidental = (prevAccidental: AccidentalType): AccidentalType => {
  if (prevAccidental === AccidentalType.Sharp) return AccidentalType.Flat;
  if (prevAccidental === AccidentalType.Flat) return AccidentalType.Sharp;
  return prevAccidental; //no change
};
