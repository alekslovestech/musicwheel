import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { chordProgressionViewMetadata, metadataForSlugPage } from "@/lib/metadata";
import { PROGRESSION_SLUG_MAP } from "@/types/ChordProgressions/progressionRegistry";
import { slugToProgressionType } from "@/utils/slug/codecs";
import {
  isLegalProgressionTonic,
  legalTonicsForProgression,
  slugToTonic,
  tonicToSlug,
} from "@/utils/slug/progressionSelection";

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ tonic: string; progression: string }>;
};

export function generateStaticParams() {
  return Object.entries(PROGRESSION_SLUG_MAP).flatMap(([progressionSlug, progressionType]) =>
    legalTonicsForProgression(progressionType).map((tonic) => ({
      tonic: tonicToSlug(tonic),
      progression: progressionSlug,
    })),
  );
}

export async function generateMetadata({ params }: Pick<LayoutProps, "params">): Promise<Metadata> {
  const { tonic: tonicSlug, progression: progressionSlug } = await params;

  const progressionType = slugToProgressionType(progressionSlug);
  if (progressionType == null) notFound();

  const tonic = slugToTonic(tonicSlug);
  if (tonic == null || !isLegalProgressionTonic(tonic, progressionType)) notFound();

  return metadataForSlugPage(
    chordProgressionViewMetadata,
    `/progressions/${tonicSlug}/${progressionSlug}`,
    `${progressionType} in ${tonic}`,
  );
}

export default function ProgressionSlugLayout({ children }: LayoutProps) {
  return children;
}
