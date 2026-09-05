import { notFound, redirect } from "next/navigation";

import { ScalePlaybackMode } from "@/types/enums/ScalePlaybackMode";
import { slugToScaleType } from "@/utils/slug/codecs";
import { scaleSelectionPath } from "@/utils/slug/scaleSelection";

/** A bare `/scales/[mode]` link predates per-tonic URLs - this segment is the mode slug on its
 * own, so redirect to that mode's canonical page at the default tonic instead of 404ing. */
export default async function ScalesLegacyModePage({
  params,
  searchParams,
}: {
  params: Promise<{ tonic: string }>;
  searchParams: Promise<{ isDemo?: string }>;
}) {
  const { tonic: modeSlug } = await params;
  const scaleMode = slugToScaleType(modeSlug);
  if (scaleMode == null) notFound();

  const isDemo = (await searchParams).isDemo !== undefined;
  redirect(
    scaleSelectionPath(
      {
        tonic: "C",
        scaleMode,
        playbackMode: ScalePlaybackMode.SingleNote,
      },
      { demo: isDemo },
    ),
  );
}
