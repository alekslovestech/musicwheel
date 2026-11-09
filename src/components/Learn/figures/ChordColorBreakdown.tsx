import { LEARN_STYLES } from "@/lib/design";
import { chromaticToActual } from "@/types/IndexTypes";
import { NoteGroupingId } from "@/types/NoteGroupingId";
import { makeChordReference } from "@/types/interfaces/ChordReference";
import { ChordUtils } from "@/utils/ChordUtils";
import { NoteConverter } from "@/utils/NoteConverter";
import { ColorUtils } from "@/utils/visual/ColorUtils";

const SWATCH_CLASSES = "h-5 w-5 rounded-sm border border-containers-divider/40";

// The intervals a chord's color is mixed from, each with its class color and weight, and the
// color they mix to - computed by the same code that colors the wheel, so it can't drift from it.
export function ChordColorBreakdown({
  rootNote,
  chordType,
  caption,
}: {
  rootNote: string;
  chordType: NoteGroupingId;
  caption: string;
}) {
  const chordRef = makeChordReference(
    chromaticToActual(NoteConverter.toChromaticIndex(rootNote)),
    chordType,
    0,
  );
  const indices = ChordUtils.calculateChordNotesFromChordReference(chordRef);
  const terms = ColorUtils.getChordColorTerms(indices);
  const totalWeight = terms.reduce((sum, term) => sum + term.weight, 0);

  return (
    <table className="w-full border-collapse rounded-lg border border-containers-divider bg-canvas-bgScales text-left">
      <caption className={`py-tight ${LEARN_STYLES.blockTitle}`}>{caption}</caption>
      <thead>
        <tr className="border-y border-containers-divider">
          {["Interval", "Class", "Color", "1 + dissonance", "Order", "Weight"].map((heading) => (
            <th key={heading} className="px-snug py-tight text-sm">
              {heading}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {terms.map((term, i) => (
          <tr key={i} className={LEARN_STYLES.comparisonTableRow}>
            <td className="px-snug py-tight text-sm">{term.semitones}</td>
            <td className="px-snug py-tight text-sm">{term.intervalClass}</td>
            <td className="px-snug py-tight">
              <div className={SWATCH_CLASSES} style={{ backgroundColor: term.color.css() }} />
            </td>
            <td className="px-snug py-tight text-sm">{term.dissonanceWeight.toFixed(2)}</td>
            <td className="px-snug py-tight text-sm">{term.orderWeight.toFixed(2)}</td>
            <td className="px-snug py-tight text-sm">{term.weight.toFixed(2)}</td>
          </tr>
        ))}
        <tr className="border-t border-containers-divider">
          <td className="px-snug py-tight text-sm font-bold" colSpan={2}>
            Mix
          </td>
          <td className="px-snug py-tight">
            <div
              className={SWATCH_CLASSES}
              style={{ backgroundColor: ColorUtils.getColorForIndices(indices).css() }}
            />
          </td>
          <td className="px-snug py-tight text-sm" colSpan={2} />
          <td className="px-snug py-tight text-sm font-bold">{totalWeight.toFixed(2)}</td>
        </tr>
      </tbody>
    </table>
  );
}
