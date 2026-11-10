import type { Metadata } from "next";
import Link from "next/link";

import { ComparisonGrid2 } from "@/components/Learn/layout/ComparisonGrid";
import { ChordWheel } from "@/components/Learn/figures/ChordWheel";
import { IntervalColorTable } from "@/components/Learn/figures/IntervalColorTable";
import { LEARN_STYLES } from "@/lib/design";
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
        The chromatic circle is an established idea; the color coding is this app&apos;s own
        addition. Each kind of interval gets its own color, so you can recognize a <i>major third</i>{" "}
        at a glance instead of counting semitones, and a chord&apos;s color comes from the
        intervals it&apos;s made of.
      </p>

      <p>
        An interval and its inversion share a color - a <i>major third</i> and a{" "}
        <i>minor sixth</i>, for instance (see{" "}
        <Link href="/learn/interval-inversions" className={LEARN_STYLES.link}>
          interval inversions
        </Link>
        ) - so 7 colors cover every interval.
      </p>

      <IntervalColorTable />

      <p>
        A <i>major third</i> wears the same color whether it starts on C or on E:
      </p>

      <ComparisonGrid2>
        <ChordWheel
          rootNote="C"
          chordType={IntervalType.Major3}
          inversionIndex={0}
          isCompact={true}
          caption="C–E: major third"
        />
        <ChordWheel
          rootNote="E"
          chordType={IntervalType.Major3}
          inversionIndex={0}
          isCompact={true}
          caption="E–G♯: major third"
        />
      </ComparisonGrid2>

      <p>
        A chord&apos;s color comes from the intervals it&apos;s made of, and their order matters: a{" "}
        <i>major triad</i> and a <i>minor triad</i> stack the same 2 intervals in opposite order, so
        they get different colors.
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
          rootNote="C"
          chordType={ChordType.Minor}
          inversionIndex={0}
          isCompact={true}
          caption="C minor"
        />
      </ComparisonGrid2>

      <table className="w-full border-collapse rounded-lg border border-containers-divider bg-canvas-bgScales text-left">
        <caption className={`py-tight ${LEARN_STYLES.blockTitle}`}>Chord colors</caption>
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
        Chords with 4 or more notes blend more intervals, so their colors sit closer together; the
        name is the reliable cue. For how the blend works, see{" "}
        <Link href="/learn/approach/chord-color-formula" className={LEARN_STYLES.link}>
          How Chord Colors Are Computed
        </Link>
        .
      </p>

      <p>
        <Link href="/learn/chords/triad-inversions" className={LEARN_STYLES.link}>
          Triad inversions
        </Link>{" "}
        rearrange which note sits in the bass without changing the intervals, so a chord and its
        inversions share one color.
      </p>

      <p>
        The scale ribbon underneath the wheel uses the same palette for step sizes. With step
        annotations on, each segment is colored by its semitone distance, so half steps and whole
        steps look different, and a stretched step - the <i>augmented second</i> in{" "}
        <i>harmonic minor</i>, for instance - stands out.
      </p>

      <p>
        Legend panels read their colors from this same system: the swatch next to a chord&apos;s
        name is exactly the color that chord lights up on the wheel.
      </p>
    </>
  );
}
