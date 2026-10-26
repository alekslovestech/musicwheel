import type { Metadata } from "next";
import Link from "next/link";

import { ComparisonGrid2 } from "@/components/Learn/layout/ComparisonGrid";
import { ChordWheel } from "@/components/Learn/figures/ChordWheel";
import { LEARN_STYLES } from "@/lib/design";
import { INTERVAL_CLASS_PALETTE } from "@/lib/design/palette";
import { INTERVAL_PAIRS } from "@/lib/learn/intervalPairs";
import { learnViewMetadata, metadataForSlugPage } from "@/lib/metadata";
import { ChordType } from "@/types/enums/ChordType";
import { IntervalType } from "@/types/enums/IntervalType";
import {
  getJoinedColorLegendGroupsForIds,
  legendLabelForGroup,
} from "@/utils/visual/colorLegendGroups";

export const metadata: Metadata = metadataForSlugPage(
  learnViewMetadata,
  "/learn/approach/color-coding",
  "Color Coding",
  "Why every wedge, chord, and step in Music Wheel is colored the way it is - and what that color is actually telling you.",
  {
    slug: "color-coding",
    alt: "The wheel with a C major triad highlighted, above a ribbon of the 7 triads of C major, each in the color of its chord quality",
  },
);

// Each row is an inversion pair sharing one interval class - label2 is what label1 becomes when
// flipped. The tritone inverts to itself, so both its labels match.
const INTERVAL_ROWS: {
  ic: keyof typeof INTERVAL_CLASS_PALETTE;
  label1: string;
  label2: string;
}[] = [
  { ic: 0, label1: "Unison", label2: "(Octave)" },
  ...INTERVAL_PAIRS.map(({ intervalClass, nameA, nameB }) => ({
    ic: intervalClass,
    label1: nameA,
    label2: nameB,
  })),
];

const CHORD_COLOR_GROUPS = getJoinedColorLegendGroupsForIds(
  new Set([
    ChordType.Major,
    ChordType.Minor,
    ChordType.Diminished,
    ChordType.Augmented,
    ChordType.Major7,
    ChordType.Minor7,
    ChordType.Dominant7,
    ChordType.MinorMajor7,
    ChordType.HalfDiminished,
    ChordType.Sus4,
    ChordType.Sus2,
  ]),
);

const TRIAD_IDS: ReadonlySet<ChordType> = new Set([
  ChordType.Major,
  ChordType.Minor,
  ChordType.Diminished,
  ChordType.Augmented,
  ChordType.Sus4,
  ChordType.Sus2,
]);

const [TRIAD_COLOR_GROUPS, OTHER_COLOR_GROUPS] = [true, false].map((wantTriads) =>
  CHORD_COLOR_GROUPS.filter(
    (group) => TRIAD_IDS.has(group.groupingIds[0] as ChordType) === wantTriads,
  ),
);

function ColorLegendCell({ group }: { group?: (typeof CHORD_COLOR_GROUPS)[number] }) {
  return (
    <td className="border-containers-divider px-snug py-tight align-middle last:border-l">
      {group && (
        <div className="flex items-center gap-snug">
          <div
            className="h-5 w-5 shrink-0 rounded-sm border border-containers-divider/40"
            style={{ backgroundColor: group.color.css() }}
          />
          <span className="min-w-0 flex-1 text-sm">{legendLabelForGroup(group)}</span>
        </div>
      )}
    </td>
  );
}

export default function ColorCodingPage() {
  return (
    <>
      <Link href="/learn/approach" className={LEARN_STYLES.link}>
        ← Approach
      </Link>

      <h1 className={LEARN_STYLES.h1}>Color Coding</h1>

      <p>
        Colors on the wheel follow one idea: distance matters more than direction. A{" "}
        <i>minor 3rd</i> above the root and a <i>minor 3rd</i> below it get the same color.
      </p>

      <p>
        The same rule carries over to inversions. Flip an interval over - a <i>major 3rd</i> becomes
        a <i>minor 6th</i>, for instance - and it&apos;s still the same interval class, so it keeps
        the same color; see{" "}
        <Link href="/learn/interval-inversions" className={LEARN_STYLES.link}>
          interval inversions
        </Link>{" "}
        for why. The same goes for chords:{" "}
        <Link href="/learn/chords/triad-inversions" className={LEARN_STYLES.link}>
          triad inversions
        </Link>{" "}
        rearrange which note sits in the bass without changing which intervals are stacked, so a
        chord and every inversion of it land on the same color.
      </p>

      <p>
        There are seven interval classes, 0 through 6, running from a unison up to a <i>tritone</i>.
        Anything past a <i>tritone</i> is really one of these seven counted the other way around the
        octave, so seven colors are all the palette ever needs.
      </p>

      <div className="flex flex-col gap-tight rounded-lg border border-containers-divider bg-canvas-bgScales p-normal">
        <p className="text-center text-sm font-semibold">Interval colors</p>
        {INTERVAL_ROWS.map((row) => (
          <div key={row.ic} className="grid grid-cols-[1fr_1.25rem_1fr] items-center gap-snug">
            <span className="min-w-0 text-right text-sm">{row.label1}</span>
            <div
              role="img" 
              aria-label={`Color for ${row.label1}${row.label2 ? ` and its inversion, ${row.label2}` : ""}`}
              className="h-5 w-5 shrink-0 justify-self-center rounded-sm border border-containers-divider/40"
              style={{ backgroundColor: INTERVAL_CLASS_PALETTE[row.ic] }}
            />
            <span className="min-w-0 text-left text-sm">{row.label2}</span>
          </div>
        ))}
      </div>

      <p>
        The color follows the interval, not the notes. A <i>major 3rd</i> wears the same color
        whether it starts on C or on E.
      </p>

      <ComparisonGrid2>
        <ChordWheel
          rootNote="C"
          chordType={IntervalType.Major3}
          inversionIndex={0}
          isCompact={true}
          caption="C–E: major 3rd"
        />
        <ChordWheel
          rootNote="E"
          chordType={IntervalType.Major3}
          inversionIndex={0}
          isCompact={true}
          caption="E–G♯: major 3rd"
        />
      </ComparisonGrid2>

      <p>
        A single note or a bare interval just wears its interval class&apos;s color directly. A
        chord has several intervals stacked on top of each other, so the app blends their colors
        together rather than picking one and discarding the rest. The blend isn&apos;t an even
        average: the unstable intervals - the <i>minor 2nd</i>/<i>major 7th</i> and the{" "}
        <i>tritone</i> - are weighted more heavily, since they&apos;re usually what gives a chord
        its particular color to the ear. A plain <i>major triad</i> comes out as a fairly settled
        blend; add a 7th or a sharp dissonance and the mix visibly shifts toward that
        interval&apos;s color.
      </p>

      <ComparisonGrid2>
        <ChordWheel
          rootNote="C"
          chordType={ChordType.Major}
          inversionIndex={0}
          isCompact={true}
          caption="C major"
        />
        <ChordWheel
          rootNote="E"
          chordType={ChordType.Major}
          inversionIndex={0}
          isCompact={true}
          caption="E major"
        />
      </ComparisonGrid2>

      <table className="w-full border-collapse rounded-lg border border-containers-divider bg-canvas-bgScales text-left">
        <caption className="py-tight text-sm font-semibold">Chord colors</caption>
        <thead>
          <tr className="border-y border-containers-divider">
            <th className="w-1/2 px-snug py-tight text-sm">Triads</th>
            <th className="w-1/2 border-l border-containers-divider px-snug py-tight text-sm">
              Other chords
            </th>
          </tr>
        </thead>
        <tbody>
          {Array.from(
            { length: Math.max(TRIAD_COLOR_GROUPS!.length, OTHER_COLOR_GROUPS!.length) },
            (_, row) => (
              <tr key={row} className={LEARN_STYLES.comparisonTableRow}>
                <ColorLegendCell group={TRIAD_COLOR_GROUPS![row]} />
                <ColorLegendCell group={OTHER_COLOR_GROUPS![row]} />
              </tr>
            ),
          )}
        </tbody>
      </table>

      <p>
        This is why some qualities land close together and others stand apart: any two chords built
        from the same interval classes come out looking similar regardless of what they&apos;re
        called, while a single unstable interval buried in an otherwise calm chord can still pull
        its color noticeably off to one side.
      </p>

      <p>
        The scale ribbon underneath the wheel uses the same palette for a different question - not
        &ldquo;what interval is this from the root&rdquo; but &ldquo;how big is the step to the next
        note.&rdquo; With step annotations on, each segment of the ribbon is colored by its own
        semitone distance, so the half steps and whole steps of a scale are visually distinct from
        each other, and a stretched step - the <i>augmented second</i> in <i>harmonic minor</i>, for
        instance - stands out by color as well as by width.
      </p>

      <p>
        Wherever you see a legend panel - next to the wheel, under a chord preset, alongside a
        progression - it&apos;s reading colors back out of this same system, not inventing its own.
        That&apos;s deliberate: the swatch next to a chord&apos;s name is exactly the color that
        chord lights up on the wheel, so the legend can always be trusted as a direct key to
        what&apos;s on screen rather than an approximation of it.
      </p>
    </>
  );
}
