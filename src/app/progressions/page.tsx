import { redirect } from "next/navigation";

import { progressionPath } from "@/utils/slug/paths";
import { progressionTypeToSlug } from "@/utils/slug/progressions";

export default async function ProgressionsPage({
  searchParams,
}: {
  searchParams: Promise<{ isDemo?: string }>;
}) {
  const isDemo = (await searchParams).isDemo !== undefined;
  redirect(progressionPath(progressionTypeToSlug(null), isDemo));
}
