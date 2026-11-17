
import { IndexEntry } from "@/components/Learn/layout/IndexEntry";
import { NextCard } from "@/components/Learn/prose/NextCard";
import { LEARN_STYLES } from "@/lib/design";
import { LEARN_PAGES } from "@/lib/learn/learnPages";

export default function LearnIndexPage() {
  return (
    <>
      <h1 className={LEARN_STYLES.h1}>Learn</h1>
      <p>
        Short written pieces about the ideas the wheel is built around. Every figure is the real
        wheel, drawn from the same code the app runs - but held still, so you can read it before you
        go and play with it.
      </p>

      <NextCard page={LEARN_PAGES["chromatic-circle"]} label="Start here · 1 of 3" />

      <IndexEntry id="approach">
        The idea behind this app: the chromatic circle, and the parts of theory it makes easier to
        see.
      </IndexEntry>

      <IndexEntry id="chords">
        Interval inversions, major vs. minor, chord quality, and triad inversions.
      </IndexEntry>

      <IndexEntry id="scales">
        How the modes relate to each other, what makes a scale &ldquo;harmonic&rdquo;, and pairs
        that differ by exactly one note.
      </IndexEntry>

      <IndexEntry id="progressions">
        What a chord progression is, a few common ones, and how roman numerals number them from the
        tonic.
      </IndexEntry>

      <IndexEntry id="side-tracks">
        Optional reading for the curious.
      </IndexEntry>
    </>
  );
}
