import type { Metadata } from "next";
import Link from "next/link";

import { LEARN_STYLES } from "@/lib/design";
import { learnViewMetadata, metadataForSlugPage } from "@/lib/metadata";

export const metadata: Metadata = metadataForSlugPage(
  learnViewMetadata,
  "/learn/approach",
  "Approach",
  "The app's own stance: what's wrong with how music theory usually gets taught, and what this app does about it.",
);

export default function ApproachIndexPage() {
  return (
    <>
      <Link href="/learn" className={LEARN_STYLES.link}>
        ← Learn
      </Link>

      <h1 className="text-3xl font-semibold">Approach</h1>

      <p>
        Not lessons about a specific music concept - the opinions behind why this app exists and
        why it&apos;s built the way it is.
      </p>

      <h2 className="text-xl font-semibold">
        <Link href="/learn/approach/whats-wrong-with-music-theory" className={LEARN_STYLES.link}>
          What&apos;s Wrong with Music Theory
        </Link>
      </h2>
      <p>
        Historical accidents, enharmonic confusion, key signatures, pointless memorization, and
        turf wars around spelling - a tour of the parts of theory that aren&apos;t about sound.
      </p>

      <h2 className="text-xl font-semibold">
        <Link href="/learn/approach/why-this-app" className={LEARN_STYLES.link}>
          Why This App
        </Link>
      </h2>
      <p>
        The problems we&apos;re trying to solve: what matters about harmony, and what&apos;s just
        historical noise.
      </p>

      <h2 className="text-xl font-semibold">
        <Link href="/learn/approach/color-coding" className={LEARN_STYLES.link}>
          Color Coding
        </Link>
      </h2>
      <p>What the colors on the wheel, the ribbon, and every legend actually mean.</p>
    </>
  );
}
