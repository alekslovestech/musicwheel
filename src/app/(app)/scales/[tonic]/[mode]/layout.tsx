import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { metadataForSlugPage, scalesViewMetadata } from "@/lib/metadata";
import { ScaleModeType } from "@/types/enums/ScaleModeType";
import { SCALE_SLUG_MAP } from "@/types/ScaleModes/ScaleModeRegistry";
import {
  AnyScaleType,
  isLegalTonic,
  isOtherScaleType,
  legalTonicsForScaleMode,
  slugToAnyScaleType,
  slugToTonic,
  tonicToSlug,
} from "@/utils/slug/scaleSelection";

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ tonic: string; mode: string }>;
};

export function generateStaticParams() {
  return Object.entries(SCALE_SLUG_MAP).flatMap(([modeSlug, scaleMode]) =>
    legalTonicsForScaleMode(scaleMode).map((tonic) => ({
      tonic: tonicToSlug(tonic),
      mode: modeSlug,
    })),
  );
}

/**
 * Ionian and Aeolian are searched for as "major"/"minor" far more than by their Greek name -
 * lead the title with that term (short, matches the dominant query) and keep the Greek name as a
 * cross-reference in the description, which has room without competing for title/tab space.
 * Every other mode keeps its plain Greek-name title, matching the URL slug.
 */
function scaleMetadataLabel(
  tonic: string,
  scaleMode: AnyScaleType,
): { title: string; description?: string } {
  if (isOtherScaleType(scaleMode)) {
    return { title: `${tonic} ${scaleMode}` };
  }
  if (scaleMode === ScaleModeType.Ionian) {
    return {
      title: `${tonic} Major`,
      description: `Explore the ${tonic} major scale (Ionian mode) - notes, chords, and related modes.`,
    };
  }
  if (scaleMode === ScaleModeType.Aeolian) {
    return {
      title: `${tonic} Minor`,
      description: `Explore the ${tonic} minor scale (Aeolian mode) - notes, chords, and related modes.`,
    };
  }
  return { title: `${tonic} ${scaleMode}` };
}

export async function generateMetadata({ params }: Pick<LayoutProps, "params">): Promise<Metadata> {
  const { tonic: tonicSlug, mode: modeSlug } = await params;

  const scaleMode = slugToAnyScaleType(modeSlug);
  if (scaleMode == null) notFound();

  const tonic = slugToTonic(tonicSlug);
  if (tonic == null || !isLegalTonic(tonic, scaleMode)) notFound();

  const { title, description } = scaleMetadataLabel(tonic, scaleMode);

  return metadataForSlugPage(scalesViewMetadata, `/scales/${tonicSlug}/${modeSlug}`, title, description);
}

export default function ScaleSlugLayout({ children }: LayoutProps) {
  return children;
}
