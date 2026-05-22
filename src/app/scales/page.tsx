import { redirect } from "next/navigation";

import { scalePath } from "@/utils/slug/paths";
import { scaleTypeToSlug } from "@/utils/slug/scales";

export default async function ScalesPage({
  searchParams,
}: {
  searchParams: Promise<{ isDemo?: string }>;
}) {
  const isDemo = (await searchParams).isDemo !== undefined;
  redirect(scalePath(scaleTypeToSlug(null), isDemo));
}
