import { ColorSwatch } from "@/components/ColorLegend/ColorSwatch";
import { LEARN_STYLES } from "@/lib/design";
import { ChordType } from "@/types/enums/ChordType";
import { NoteGroupingLibrary } from "@/types/NoteGroupingLibrary";
import { getColorForGrouping } from "@/utils/visual/NoteGroupingColorRegistry";

/** One row of a chord-quality table: swatch, long form, symbolic notation, letter notation -
 * pulled straight from the catalog rather than restated by hand, so the table can't drift out of
 * sync with what the app actually shows. */
export function QualityRow({ chordType }: { chordType: ChordType }) {
  const { longForm, symbolForm, shortForm } = NoteGroupingLibrary.getGroupingById(chordType);
  return (
    <tr className={LEARN_STYLES.comparisonTableRow}>
      <td className="w-8 p-0 py-tight">
        <ColorSwatch color={getColorForGrouping(chordType)} />
      </td>
      <td className="w-1/3 px-snug py-tight">{longForm}</td>
      <td className="px-snug py-tight">{symbolForm || "___"}</td>
      <td className="px-snug py-tight">{shortForm}</td>
    </tr>
  );
}
