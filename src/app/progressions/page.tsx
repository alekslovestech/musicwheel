import { redirect } from "next/navigation";

import { GlobalMode } from "@/types/enums/GlobalMode";
import { getPath } from "@/utils/slug/paths";
import { progressionTypeToSlug } from "@/utils/slug/progressions";

export default async function ProgressionsPage({
  searchParams,
}: {
  searchParams: Promise<{ isDemo?: string }>;
}) {
  const isDemo = (await searchParams).isDemo !== undefined;
  redirect(getPath(GlobalMode.ChordProgressions, progressionTypeToSlug(null), isDemo));
}
