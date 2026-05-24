import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { chordProgressionViewMetadata, metadataForSlugPage } from "@/lib/metadata";
import { PROGRESSION_SLUG_MAP } from "@/types/ChordProgressions/progressionRegistry";
import { slugToProgressionType } from "@/utils/slug/progressions";

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return Object.keys(PROGRESSION_SLUG_MAP).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Pick<LayoutProps, "params">): Promise<Metadata> {
  const { slug } = await params;
  const progressionType = slugToProgressionType(slug);
  if (progressionType == null) notFound();

  return metadataForSlugPage(
    chordProgressionViewMetadata,
    `/progressions/${slug}`,
    progressionType,
  );
}

export default function ProgressionSlugLayout({ children }: LayoutProps) {
  return children;
}
