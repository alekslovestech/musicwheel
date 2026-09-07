import type { Metadata } from "next";
import Link from "next/link";

import { LEARN_STYLES } from "@/lib/design";
import { INTERVAL_CLASS_PALETTE } from "@/lib/design/palette";
import { learnViewMetadata, metadataForSlugPage } from "@/lib/metadata";

export const metadata: Metadata = metadataForSlugPage(
  learnViewMetadata,
  "/learn/color-coding",
  "Color Coding",
  "Why every wedge, chord, and step in Music Wheel is colored the way it is - and what that color is actually telling you.",
);

const INTERVAL_ROWS: { ic: keyof typeof INTERVAL_CLASS_PALETTE; label: string; name: string }[] = [
  { ic: 0, label: "Unison / Octave", name: "Light Gray" },
  { ic: 1, label: "Minor 2nd / Major 7th", name: "Crimson" },
  { ic: 2, label: "Major 2nd / Minor 7th", name: "Orange" },
  { ic: 3, label: "Minor 3rd / Major 6th", name: "Gold" },
  { ic: 4, label: "Major 3rd / Minor 6th", name: "Green" },
  { ic: 5, label: "Perfect 4th / Perfect 5th", name: "Blue" },
  { ic: 6, label: "Tritone", name: "Magenta" },
];

export default function ColorCodingPage() {
  return (
    <>
      <Link href="/learn" className={LEARN_STYLES.link}>
        ← Learn
      </Link>

      <h1 className="text-3xl font-semibold">Color Coding</h1>

      <p>
        Nothing on the wheel is colored for decoration. Every wedge, ribbon segment, and legend
        swatch in Music Wheel is derived from the same idea: distance matters more than direction.
        A minor third above the root and a minor third below it get the same color, because to the
        ear they&apos;re the same interval class - the wheel just cares which flavor of interval
        you&apos;re looking at, not which way it points.
      </p>

      <p>
        There are seven interval classes, 0 through 6, running from a unison up to a tritone.
        Anything past a tritone is really one of these seven counted the other way around the
        octave, so seven colors are all the palette ever needs.
      </p>

      <div className="flex flex-col gap-tight rounded-lg border border-containers-divider bg-canvas-bgScales p-normal">
        {INTERVAL_ROWS.map((row) => (
          <div key={row.ic} className="flex items-center gap-snug">
            <div
              className="h-5 w-5 shrink-0 rounded-sm border border-containers-divider/40"
              style={{ backgroundColor: INTERVAL_CLASS_PALETTE[row.ic] }}
            />
            <span className="min-w-0 flex-1 text-sm">{row.label}</span>
            <span className="text-xs text-labels-textDefault opacity-70">{row.name}</span>
          </div>
        ))}
      </div>

      <p>
        A single note or a bare interval just wears its interval class&apos;s color directly. A
        chord is where it gets more interesting: with three or more notes there are several
        intervals stacked on top of each other, so the app blends their colors together rather
        than picking one and discarding the rest. That blend isn&apos;t a flat average, either -
        it leans on a couple of rules that keep the result readable instead of muddy.
      </p>

      <p>
        First, the mixing happens in LCH color space rather than plain RGB, so hues combine the way
        they look like they should combine instead of sliding toward brown the way naive RGB
        averaging tends to. Second, not every interval in the chord gets an equal vote: the
        unstable ones - the minor second/major seventh and the tritone - are weighted more heavily,
        since they&apos;re usually what gives a chord its particular color to the ear in the first
        place. A plain major triad leans on its calmer, more evenly weighted intervals and comes out
        as a fairly settled blend; add a seventh or a sharp dissonance and the mix visibly shifts
        toward that interval&apos;s color.
      </p>

      <p>
        The scale ribbon underneath the wheel uses the same palette for a different question - not
        &ldquo;what interval is this from the root&rdquo; but &ldquo;how big is the step to the next
        note.&rdquo; With step annotations on, each segment of the ribbon is colored by its own
        semitone distance, so the half steps and whole steps of a scale are visually distinct from
        each other, and a stretched step - the augmented second in harmonic minor, for instance -
        stands out by color as well as by width.
      </p>

      <p>
        Wherever you see a legend panel - next to the wheel, under a chord preset, alongside a
        progression - it&apos;s reading colors back out of this same system, not inventing its own.
        That&apos;s deliberate: the swatch next to a chord&apos;s name is exactly the color that
        chord lights up on the wheel, so the legend can always be trusted as a direct key to what&apos;s
        on screen rather than an approximation of it.
      </p>
    </>
  );
}
