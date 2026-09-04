import { redirect } from "next/navigation";

import { defaultProgressionSelection, progressionSelectionPath } from "@/utils/slug/progressionSelection";

export default async function ProgressionsPage({
  searchParams,
}: {
  searchParams: Promise<{ isDemo?: string }>;
}) {
  const isDemo = (await searchParams).isDemo !== undefined;
  redirect(progressionSelectionPath(defaultProgressionSelection(), { demo: isDemo }));
}
