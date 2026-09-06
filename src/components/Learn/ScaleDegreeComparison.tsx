import { ScaleFigure } from "@/components/Learn/ScaleFigure";
import { LEARN_STYLES } from "@/lib/design";
import { ScaleModeType } from "@/types/enums/ScaleModeType";
import { ScaleDegree } from "@/types/ScaleModes/ScaleDegreeType";

const DEGREE_ORDINALS = [
  "zeroth",
  "first",
  "second",
  "third",
  "fourth",
  "fifth",
  "sixth",
  "seventh",
];

/**
 * A figure pair plus the paragraph explaining the geometry, for the "off by one" comparison
 * articles: two modes on the same tonic that disagree on exactly one degree, by a single
 * semitone, from modeA to modeB. Tonic is hardcoded to C - true of every article in this category
 * so far. isClockwise defaults to true (modeB raises the degree) since that's the common case;
 * pass false for the rarer pairs where modeB lowers it instead (e.g. Harmonic Major's natural
 * second vs. Double Harmonic Major's flat second).
 */
export function ScaleDegreeComparison({
  modeA,
  modeB,
  degree,
  isClockwise = true,
  captionA,
  captionB,
}: {
  modeA: ScaleModeType;
  modeB: ScaleModeType;
  /** Scale degree both modes highlight - the one they disagree on. */
  degree: ScaleDegree;
  /** Whether modeB's wedge sits clockwise (raised) or counterclockwise (lowered) from modeA's. */
  isClockwise?: boolean;
  captionA: string;
  captionB: string;
}) {
  const tonic = "C";
  const ordinal = DEGREE_ORDINALS[degree];
  const direction = isClockwise ? "clockwise" : "counterclockwise";

  return (
    <>
      <div className={LEARN_STYLES.comparisonGrid}>
        <ScaleFigure
          tonic={tonic}
          scaleMode={modeA}
          highlightedDegree={degree}
          caption={captionA}
        />
        <ScaleFigure
          tonic={tonic}
          scaleMode={modeB}
          highlightedDegree={degree}
          caption={captionB}
        />
      </div>

      <p>
        The wheel makes the difference positional rather than verbal: the {ordinal}-degree wedge
        sits one wedge further {direction} in {modeB}, and the spoke drawn from the center recolors
        to the interval that degree now forms with the tonic. Everything else on the two wheels is
        identical.
      </p>
    </>
  );
}
