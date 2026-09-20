import { LEARN_STYLES } from "@/lib/design";

/** One row of a "good for" comparison table: a concept, and a check/cross for each of two
 * options. */
export function GoodForRow({
  concept,
  chromatic,
  fifths,
}: {
  concept: string;
  chromatic: boolean;
  fifths: boolean;
}) {
  return (
    <tr className={LEARN_STYLES.comparisonTableRow}>
      <td className="px-snug py-tight">{concept}</td>
      <GoodForCell isGood={chromatic} />
      <GoodForCell isGood={fifths} />
    </tr>
  );
}

function GoodForCell({ isGood }: { isGood: boolean }) {
  return (
    <td className="px-snug py-tight text-center">
      {isGood ? (
        <span className="text-green-600" aria-label="Good for this">
          ✓
        </span>
      ) : (
        <span className="text-red-500" aria-label="Not what this is for">
          ✗
        </span>
      )}
    </td>
  );
}
