import { LEARN_STYLES } from "@/lib/design";
import { INTERVAL_CLASS_PALETTE } from "@/lib/design/palette";
import { INTERVAL_PAIRS } from "@/lib/learn/intervalPairs";
import { NoteGroupingLibrary } from "@/types/NoteGroupingLibrary";

// Each row is an inversion pair sharing one interval class - label2 is what label1 becomes when
// flipped. The tritone inverts to itself, so both its labels match.
const INTERVAL_ROWS: {
  ic: keyof typeof INTERVAL_CLASS_PALETTE;
  label1: string;
  label2: string;
}[] = [
  { ic: 0, label1: "Unison", label2: "(Octave)" },
  ...INTERVAL_PAIRS.map(({ intervalClass, intervalA, intervalB }) => ({
    ic: intervalClass,
    label1: NoteGroupingLibrary.getGroupingById(intervalA).longForm,
    label2: NoteGroupingLibrary.getGroupingById(intervalB).longForm,
  })),
];

// The 7 interval classes, each with its color and the pair of intervals that share it.
export function IntervalColorTable() {
  return (
    <div className="flex flex-col gap-tight rounded-lg border border-containers-divider bg-canvas-bgScales p-normal">
      <p className={`text-center ${LEARN_STYLES.blockTitle}`}>Interval colors</p>
      {INTERVAL_ROWS.map((row) => (
        <div key={row.ic} className="grid grid-cols-[1fr_1.25rem_1fr] items-center gap-snug">
          <span className="min-w-0 text-right text-sm">{row.label1}</span>
          <div
            role="img"
            aria-label={`Color for ${row.label1} and its inversion, ${row.label2}`}
            className="h-5 w-5 shrink-0 justify-self-center rounded-sm border border-containers-divider/40"
            style={{ backgroundColor: INTERVAL_CLASS_PALETTE[row.ic] }}
          />
          <span className="min-w-0 text-left text-sm">{row.label2}</span>
        </div>
      ))}
    </div>
  );
}
