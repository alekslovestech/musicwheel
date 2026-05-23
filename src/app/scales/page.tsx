import { redirect } from "next/navigation";

import { GlobalMode } from "@/types/enums/GlobalMode";
import { getPath } from "@/utils/slug/paths";
import { scaleTypeToSlug } from "@/utils/slug/scales";

export default async function ScalesPage({
  searchParams,
}: {
  searchParams: Promise<{ isDemo?: string }>;
}) {
  const isDemo = (await searchParams).isDemo !== undefined;
  redirect(getPath(GlobalMode.Scales, scaleTypeToSlug(null), isDemo));
}
