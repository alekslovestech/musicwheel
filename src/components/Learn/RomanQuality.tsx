import { ColorSwatch } from "@/components/ColorLegend/ColorSwatch";
import { Roman } from "@/components/Learn/Roman";
import { ChordType } from "@/types/enums/ChordType";
import { RomanChord } from "@/types/RomanChord";
import { ixScaleDegree } from "@/types/ScaleModes/ScaleDegreeType";
import { RomanChordFormatter } from "@/utils/formatters/RomanChordFormatter";
import { getColorForGrouping } from "@/utils/visual/NoteGroupingColorRegistry";

/** A roman numeral paired with the wheel's color for that chord quality - inline in prose or a
 * list item alike. The numeral itself (case and suffix included) is derived from the degree and
 * chord type via the app's own formatter, rather than typed out by hand, so it can't drift out of
 * sync with what the app actually shows (or contain a spelling slip like "vi°" for "vii°"). */
export function RomanQuality({ degree, chordType }: { degree: number; chordType: ChordType }) {
  const romanChord = new RomanChord(ixScaleDegree(degree), chordType);
  const numeral = RomanChordFormatter.formatRomanChord(romanChord);
  return (
    <span className="inline-flex items-center gap-1 align-baseline">
      <ColorSwatch color={getColorForGrouping(chordType)} />
      <Roman>{numeral}</Roman>
    </span>
  );
}
