import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { metadataForSlugPage, scalesViewMetadata } from "@/lib/metadata";
import { SCALE_SLUG_MAP } from "@/types/ScaleModes/ScaleModeLibrary";
import { slugToScaleType } from "@/utils/slug/codecs";

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return Object.keys(SCALE_SLUG_MAP).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Pick<LayoutProps, "params">): Promise<Metadata> {
  const { slug } = await params;
  const scaleMode = slugToScaleType(slug);
  if (scaleMode == null) notFound();

  return metadataForSlugPage(scalesViewMetadata, `/scales/${slug}`, scaleMode);
}

export default function ScaleSlugLayout({ children }: LayoutProps) {
  return children;
}
