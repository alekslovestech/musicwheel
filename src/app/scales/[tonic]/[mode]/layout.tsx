import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { metadataForSlugPage, scalesViewMetadata } from "@/lib/metadata";
import { SCALE_SLUG_MAP } from "@/types/ScaleModes/ScaleModeRegistry";
import { slugToScaleType } from "@/utils/slug/codecs";
import { isLegalTonic, legalTonicsForScaleMode, slugToTonic, tonicToSlug } from "@/utils/slug/scaleSelection";

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

export async function generateMetadata({ params }: Pick<LayoutProps, "params">): Promise<Metadata> {
  const { tonic: tonicSlug, mode: modeSlug } = await params;

  const scaleMode = slugToScaleType(modeSlug);
  if (scaleMode == null) notFound();

  const tonic = slugToTonic(tonicSlug);
  if (tonic == null || !isLegalTonic(tonic, scaleMode)) notFound();

  return metadataForSlugPage(
    scalesViewMetadata,
    `/scales/${tonicSlug}/${modeSlug}`,
    `${tonic} ${scaleMode}`,
  );
}

export default function ScaleSlugLayout({ children }: LayoutProps) {
  return children;
}
