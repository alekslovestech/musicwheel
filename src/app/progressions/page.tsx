"use client";

import { useProgressionUrlSync } from "@/lib/hooks/useSlugUrlSync";

export default function ProgressionsPage() {
  useProgressionUrlSync();
  return null;
}
